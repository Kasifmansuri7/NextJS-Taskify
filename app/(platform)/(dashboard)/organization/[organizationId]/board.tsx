import { deleteBoard } from '@/actions/delete-board';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface BoardProps {
  id: string;
  title: string;
}

export const Board = ({ title, id }: BoardProps) => {
  const deleteBoardWithId = deleteBoard.bind(null, id);

  return (
    <form className="flex gap-x-2 items-center" action={deleteBoardWithId}>
      <p>Board title: {title}</p>
      <Button type="submit" variant="destructive" size="sm">
        <Trash className="h-4 w-4" />
      </Button>
    </form>
  );
};
