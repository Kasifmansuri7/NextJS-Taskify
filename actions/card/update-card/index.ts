'use server';

import { auth } from '@clerk/nextjs/server';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { UpdateCard } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorize',
    };
  }

  const { id, listId, boardId, ...values } = data;
  let card;
  try {
    card = await db.card.update({
      where: {
        id: id,
        listId: listId,
      },
      data: {
        ...values,
      },
    });
    revalidatePath(`/board/${boardId}`);
    return { data: card };
  } catch (error) {
    return {
      error: 'Failed to create.',
    };
  }
};

export const updateCard = createSafeAction(UpdateCard, handler);
