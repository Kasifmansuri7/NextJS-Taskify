'use client';
import { useAction } from '@/hooks/use-action';
import { createBoard } from '@/actions/create-board';
import { FormInput } from '@/components/form/form-input';
import { FormSubmit } from '@/components/form/form-submit';

export const Form = () => {
  const { execute, fieldErrors, isLoading } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log('data', data);
    },
    onError: (error) => {
      console.log('error: ', error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    execute({ title });
  };

  return (
    <form action={onSubmit} className="flex items-end justify-center gap-x-2">
      <FormInput
        label="Board title"
        id="title"
        errors={fieldErrors}
        placeholder="Enter a title"
      />
      <FormSubmit variant="primary">Submit</FormSubmit>
    </form>
  );
};
