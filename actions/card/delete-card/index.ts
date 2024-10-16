'use server';

import { auth } from '@clerk/nextjs/server';
import { InputType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { DeleteCard } from './schema';

const handler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorize',
    };
  }

  const { id, listId, boardId } = data;
  let list;
  try {
    list = await db.card.delete({
      where: {
        id,
        listId,
      },
    });
  } catch (error) {
    return {
      error: 'Failed to delete.',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
