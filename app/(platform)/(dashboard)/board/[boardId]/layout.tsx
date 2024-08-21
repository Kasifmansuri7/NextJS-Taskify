import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { startCase } from 'lodash';
import { BoardNavbar } from './_components/board-navbar';

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
    },
    select: {
      title: true,
    },
  });

  return { title: startCase(board?.title || 'Board') };
}

export default async function BoardIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) {
  const { orgId } = auth();

  if (!orgId) {
    return redirect(`/select-org`);
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) {
    return notFound();
  }

  return (
    <div
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      className="relative h-full bg-no-repeat bg-cover bg-center overflow-hidden"
    >
      <BoardNavbar board={board} />
      <div className="absolute h-full w-full inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>;
    </div>
  );
}
