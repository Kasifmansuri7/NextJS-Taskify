import React from 'react';
import { OrgControl } from './_component/org-control';
import { Button } from '@/components/ui/button';

export default function OrganizationIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
}
