import { Input } from '@/components/ui/input';
import { useFormStatus } from 'react-dom';

interface FormInputProps {
  errors?: {
    title?: string[];
  };
}

export const FormInput = ({ errors }: FormInputProps) => {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-row">
      <Input
        id="title"
        name="title"
        required
        placeholder="Enter a board title"
        disabled={pending}
      />
      {errors?.title ? (
        <div>
          {errors.title.map((er: string) => (
            <p className="text-rose-500" key={er}>
              {er}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
};
