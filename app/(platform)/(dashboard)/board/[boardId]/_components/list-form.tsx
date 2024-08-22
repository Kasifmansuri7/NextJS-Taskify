'use client';

import { Plus, X } from 'lucide-react';
import { ListWrapper } from './list-wrapper';

import { useState, useRef, ElementRef } from 'react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { FormInput } from '@/components/form/form-input';
import { useParams } from 'next/navigation';
import { FormSubmit } from '@/components/form/form-submit';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { createList } from '@/actions/list/create-list';
import { CreateList } from '@/actions/list/create-list/schema';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

export const ListForm = () => {
  const router = useRouter();
  const params = useParams();
  const boardId: string = params.boardId as string;
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);
  const { pending } = useFormStatus();

  const { execute, isLoading, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" created.`);
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
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

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing); // clicking outside of form ref

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    execute({ title, boardId });
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
          action={onSubmit}
        >
          <FormInput
            errors={fieldErrors}
            id="title"
            ref={inputRef}
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter list title..."
          />
          <div className="flex items-center gap-x-1">
            <FormSubmit variant="primary" disabled={isLoading || pending}>
              Add list
            </FormSubmit>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
              disabled={isLoading || pending}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      {/* <form className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"> */}
      <button
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
        onClick={enableEditing}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add a list
      </button>
      {/* </form> */}
    </ListWrapper>
  );
};
