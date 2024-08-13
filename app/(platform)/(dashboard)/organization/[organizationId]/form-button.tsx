import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

export const FormButton = ({ text }: { text: string }) => {
  const { pending } = useFormStatus();
  return (
    <Button variant="primary" className="mx-2" disabled={pending}>
      {text}
    </Button>
  );
};
