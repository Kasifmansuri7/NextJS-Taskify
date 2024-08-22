'use server';

import { auth } from '@clerk/nextjs/server';
import { InputType, ReturnType } from './types';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/create-safe-action';
import { CopyList } from './schema';

const handler = async (data: InputType) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorize',
    };
  }

  const { id, boardId } = data;
  let list;
  try {
    const boardExist = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!boardExist) {
      return {
        error: 'Board does not exist.',
      };
    }

    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId: boardId,
        board: {
          orgId,
        },
      },
      include: {
        cards: true,
      },
    });

    if (!listToCopy) {
      return {
        error: 'List does not exist.',
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
        title: `${listToCopy.title} - Copy`,
        boardId: boardId,
        order: lastListOrder ? lastListOrder.order + 1 : 1,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    });
  } catch (error) {
    return {
      error: 'Failed to copy.',
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list,
  };
};

export const copyList = createSafeAction(CopyList, handler);
