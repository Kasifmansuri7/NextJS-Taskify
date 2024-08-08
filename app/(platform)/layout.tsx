import { ClerkProvider } from '@clerk/nextjs';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return <ClerkProvider afterSignOutUrl="/">{children}</ClerkProvider>;
};

export default PlatformLayout;
