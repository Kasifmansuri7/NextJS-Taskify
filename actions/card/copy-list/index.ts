'use server';

import { auth } from '@clerk/nextjs/server';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { CopyCard } from './schema';

const handler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorize',
    };
  }

  const { id, listId, boardId } = data;
  let card;
  try {
    // Find the card to copy
    const cardToCopy = await db.card.findUnique({
      where: {
        id: id,
        listId: listId,
      },
    });

    if (!cardToCopy) {
      return {
        error: 'Card not found!',
      };
    }

    // Find the last card order
    const lastCardOrder = await db.card.findFirst({
      where: {
        listId: listId,
      },
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true,
      },
      take: 1,
    });

    const newOrder = lastCardOrder?.order ? lastCardOrder.order + 1 : 1;
    card = await db.card.create({
      data: {
        title: `${cardToCopy?.title} - Copy`,
        description: cardToCopy?.description,
        listId: listId,
        order: newOrder,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return {
      data: card,
    };
  } catch (error) {
    return {
      error: 'Failed to copy.',
    };
  }
};

export const copyCard = createSafeAction(CopyCard, handler);
