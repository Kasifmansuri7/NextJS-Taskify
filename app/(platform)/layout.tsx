import { Toaster } from 'sonner';
import { ModalProvider } from '@/components/provider/modal-provider';
import { QueryProvider } from '@/components/provider/query-provider';
import { ClerkProvider } from '@clerk/nextjs';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;
