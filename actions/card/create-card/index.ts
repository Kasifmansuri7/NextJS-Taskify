'use server';

import { auth } from '@clerk/nextjs/server';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { CreateCard } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorize',
    };
  }

  const { title, boardId, listId } = data;
  let card;
  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId,
        },
      },
    });

    if (!list) {
      return {
        error: 'List not found.',
      };
    }

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

    card = await db.card.create({
      data: {
        listId: listId,
        title: title,
        order: lastCardOrder ? lastCardOrder.order + 1 : 1,
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

export const createCard = createSafeAction(CreateCard, handler);
