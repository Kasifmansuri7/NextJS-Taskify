'use client';

import { List } from '@prisma/client';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, X } from 'lucide-react';
import { FormSubmit } from '@/components/form/form-submit';
import { Separator } from '@/components/ui/separator';
import { useAction } from '@/hooks/use-action';
import { deleteList } from '@/actions/list/delete-list';
import { toast } from 'sonner';
import { ElementRef, useRef } from 'react';
import { copyList } from '@/actions/list/copy-list';

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export const ListOptions = ({ onAddCard, data }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<'button'>>(null);
  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`"${data.title}" list deleted successfully.`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`"${data.title}" is copied`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDeleteList = () => {
    executeDelete({ id: data.id, boardId: data.boardId });
    closeRef.current?.click();
  };

  const onCopyList = () => {
    executeCopy({ id: data.id, boardId: data.boardId });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button asChild className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-0 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List option
        </div>

        <PopoverClose asChild ref={closeRef}>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <Button
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
          onClick={onAddCard}
        >
          Add card...
        </Button>
        <Button
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          onClick={onCopyList}
        >
          Copy list...
        </Button>
        <Separator />
        <Button
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          onClick={onDeleteList}
        >
          Delete this list...
        </Button>
      </PopoverContent>
    </Popover>
  );
};
