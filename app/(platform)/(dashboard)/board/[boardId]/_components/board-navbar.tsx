import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Board } from '@prisma/client';
import { BoardTitleForm } from './board-title-form';
import { BoardOptions } from './board-options';

interface BoardNavbarProps {
  board: Board;
}

export const BoardNavbar = async ({ board }: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-4 text-white">
      <BoardTitleForm board={board} />
      <div className="ml-auto">
        <BoardOptions id={board.id} orgId={board.orgId} />
      </div>
    </div>
  );
};
