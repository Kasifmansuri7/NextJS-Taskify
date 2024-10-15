'use server';

import { auth } from '@clerk/nextjs/server';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { UpdateCardReorder } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorize',
    };
  }

  const { items } = data;

  let cards;
  try {
    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
        },
        data: {
          listId: card.listId,
          order: card.order,
        },
      })
    );
    cards = await db.$transaction(transaction);
    return { data: cards };
  } catch (error) {
    return {
      error: 'Failed to reorder.',
    };
  }
};

export const updateCardReorder = createSafeAction(UpdateCardReorder, handler);
