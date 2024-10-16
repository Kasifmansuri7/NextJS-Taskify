'use client';

import { ElementRef, useRef, useState } from 'react';
import { CardWithList } from '@/type';
import { Layout } from 'lucide-react';
import { FormInput } from '@/components/form/form-input';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useAction } from '@/hooks/use-action';
import { updateCard } from '@/actions/card/update-card';
import { toast } from 'sonner';

interface HeaderProps {
  data: CardWithList;
}

export const Header = ({ data }: HeaderProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const inputRef = useRef<ElementRef<'input'>>(null);
  const [title, setTitle] = useState(data.title);
  const { execute: executeUpdateCard, fieldErrors } = useAction(updateCard, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id],
      });

      toast.success(`Renamed to ${data.title}`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const inputTitle = formData.get('title') as string;
    if (inputTitle == title) {
      return;
    }

    executeUpdateCard({
      id: data.id,
      title: title,
      listId: data.listId,
      boardId: params.boardId as string,
    });
  };

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1  text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            id={'title'}
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
            ref={inputRef}
            onBlur={onBlur}
            errors={fieldErrors}
          />
        </form>
        <p className="text-sm text-muted-foreground ">
          in list <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-100" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};
