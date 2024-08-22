'use server';

import { auth } from '@clerk/nextjs/server';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { CreateList } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorize',
    };
  }

  const { title, boardId } = data;
  let list;
  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board) {
      return {
        error: 'Board not found.',
      };
    }

    const lastListOrder = await db.list.findFirst({
      where: {
        boardId,
      },
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true,
      },
      take: 1,
    });

    list = await db.list.create({
      data: {
        title,
        boardId,
        order: lastListOrder ? lastListOrder.order + 1 : 1,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { data: list };
  } catch (error) {
    return {
      error: 'Failed to create.',
    };
  }
};

export const createList = createSafeAction(CreateList, handler);
