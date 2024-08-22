'use client';

import { Board } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ElementRef, useRef, useState } from 'react';
import { FormInput } from '@/components/form/form-input';
import { useAction } from '@/hooks/use-action';
import { updateBoard } from '@/actions/board/update-board';
import { toast } from 'sonner';

interface BoardTitleFormProps {
  board: Board;
}
export const BoardTitleForm = ({ board }: BoardTitleFormProps) => {
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState(board.title);
  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      setTitle(data.title);
      toast.success('Title updated!');
    },
    onComplete: () => {
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const enableEditing = () => {
    setIsEditable(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditable(false);
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    execute({ id: board.id, title: title });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <>
      {isEditable ? (
        <form
          action={onSubmit}
          className="flex items-center gap-x-2"
          ref={formRef}
        >
          <FormInput
            id="title"
            onBlur={onBlur}
            defaultValue={title}
            className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
            ref={inputRef}
          />
        </form>
      ) : (
        <Button
          className="font-bold text-lg h-auto w-auto p-1 px-2"
          variant="transparent"
          onClick={enableEditing}
        >
          {title}
        </Button>
      )}
    </>
  );
};
