'use client';

import { useState, useRef, ElementRef, KeyboardEvent } from 'react';
import { CardWithList } from '@/type';
import { Skeleton } from '../ui/skeleton';
import { AlignLeft } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { FormTextarea } from '../form/form-text-area';
import { FormSubmit } from '../form/form-submit';
import { Button } from '../ui/button';
import { useAction } from '@/hooks/use-action';
import { updateCard } from '@/actions/card/update-card';
import { toast } from 'sonner';

interface DescriptionProps {
  data: CardWithList;
}
export const Description = ({ data }: DescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<'form'>>(null);
  const textareaRef = useRef<ElementRef<'textarea'>>(null);
  const queryClient = useQueryClient();
  const params = useParams();

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id],
      });
      toast.success('Card description updated.');
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: any) => {
    if (e.key === 'Escape') {
      disableEditing();
    } else if (e.key === 'Enter') {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputDescription = formData.get('description') as string;

    execute({
      id: data.id,
      description: inputDescription,
      listId: data.listId,
      boardId: params.boardId as string,
    });
  };
  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />

      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Desription</p>
        {isEditing ? (
          <form ref={formRef} onSubmit={handleSubmit}>
            <FormTextarea
              id={'description'}
              label="description"
              ref={textareaRef}
              placeholder="Add a more detailed description..."
              onKeyDown={onKeyDown}
              defaultValue={data.description || undefined}
              errors={fieldErrors}
            />
            <div className="flex items-center gap-x-2 mt-2">
              <FormSubmit variant="primary">Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size={'sm'}
                variant={'ghost'}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
            onClick={enableEditing}
          >
            {data.description || 'Add a more detailed description...'}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-4 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};
