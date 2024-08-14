'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';

interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}
export const FormSubmit = ({
  children,
  disabled,
  className,
  variant,
  size,
}: FormSubmitProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      variant={variant}
      size={size || 'sm'}
    >
      {children}
    </Button>
  );
};
