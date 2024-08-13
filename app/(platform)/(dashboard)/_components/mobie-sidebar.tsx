'use client';

import { Menu } from 'lucide-react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';
import { Sidebar } from './Sidebar';

export const MobileSidebar = () => {
  const pathname = usePathname();
  console.log('pathname: ', pathname);
  const { onOpen, onClose, isOpen } = useMobileSidebar();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      <Button
        onClick={onOpen}
        className="block md:hidden mr-2"
        variant="ghost"
        size="sm"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};
