'use client';
import { FormInput } from './form-input';
import { FormButton } from './form-button';
import { useAction } from '@/hooks/use-action';
import { createBoard } from '@/actions/create-board';

export const Form = () => {
  const { execute, fieldErrors, isLoading } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log('data', data);
    },
    onError: (error) => {
      console.log('error: ', error);
    },
  });
  console.log('isLoading: ', isLoading);

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    execute({ title });
  };

  return (
    <form action={onSubmit} className="flex flex-row">
      <FormInput errors={fieldErrors} />
      <FormButton text="Submit" />
    </form>
  );
};
