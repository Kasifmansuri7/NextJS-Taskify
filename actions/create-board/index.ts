'use server';

import { auth } from '@clerk/nextjs/server';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { CreateBoard } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'unauthorize!',
    };
  }

  const { title, image } = data;
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUsername] =
    image.split('|');

  // if anything is not present return with error
  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUsername
  ) {
    return {
      error: 'Missing fields! Failed to create board.',
    };
  }

  const createObj = {
    title,
    orgId,
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUsername,
  };

  let board;
  try {
    board = await db.board.create({
      data: createObj,
    });
  } catch (error) {
    return {
      error: 'Failed to create.',
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
