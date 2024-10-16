'use client';

import { CardWithList } from '@/type';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Copy, Trash } from 'lucide-react';
import { useAction } from '@/hooks/use-action';
import { copyCard } from '@/actions/card/copy-list';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { useCardModal } from '@/hooks/use-card-modal';
import { deleteCard } from '@/actions/card/delete-card';

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const { onClose } = useCardModal();

  // Copy card
  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success('Card copied successfully!');
        onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  // Delete card
  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success('Card deleted successfully!');
        onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const handleCopyCard = () => {
    executeCopyCard({
      id: data.id,
      listId: data.listId,
      boardId: params.boardId as string,
    });
  };

  const handleDeleteCard = () => {
    executeDeleteCard({
      id: data.id,
      listId: data.listId,
      boardId: params.boardId as string,
    });
  };

  return (
    <div>
      <p className="text-sm font-semibold text-neutral-700 mb-2">Actions</p>
      <Button
        variant="gray"
        size={'inline'}
        className="w-full justify-start mb-3"
        onClick={handleCopyCard}
        disabled={isLoadingCopy}
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        variant="gray"
        className="w-full"
        size={'inline'}
        onClick={handleDeleteCard}
        disabled={isLoadingDelete}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="h-4 w-20 bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
    </div>
  );
};
