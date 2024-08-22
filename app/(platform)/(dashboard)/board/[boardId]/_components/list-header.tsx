'use client';

import { updateList } from '@/actions/list/update-list';
import { FormInput } from '@/components/form/form-input';
import { useAction } from '@/hooks/use-action';
import { List } from '@prisma/client';
import { useRef, useState, ElementRef } from 'react';
import { toast } from 'sonner';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { ListOptions } from './list-options';

interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<ElementRef<'input'>>(null);
  const formRef = useRef<ElementRef<'form'>>(null);
  const { execute, isLoading } = useAction(updateList, {
    onSuccess: (data) => {
      setTitle(data.title);
      toast.success(`Renamed to "${data.title}" successfully.`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: globalThis.KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing();
    }
  };

  const onSubmit = (formData: FormData) => {
    const formTitle = formData.get('title') as string;
    if (formTitle === title) {
      return disableEditing();
    }

    execute({ title: formTitle, boardId: data.boardId, id: data.id });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, onBlur);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-center gap-x-2 w-full">
      {isEditing ? (
        <form className="w-[252px]" action={onSubmit} ref={formRef}>
          <FormInput
            id="title"
            defaultValue={title}
            className=" text-sm w-full px-[7px] py-1 h-7 border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
            onBlur={onBlur}
            ref={inputRef}
            placeholder="Enter a list title..."
          />
        </form>
      ) : (
        <div
          className="w-full text-sm px-2.5 py-1 h-7 font-medium"
          onClick={enableEditing}
        >
          {title}
        </div>
      )}

      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
};
