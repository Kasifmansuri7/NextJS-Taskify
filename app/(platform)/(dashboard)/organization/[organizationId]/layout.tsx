import React from 'react';
import { OrgControl } from './_component/org-control';
import { Metadata } from 'next';
import { startCase } from 'lodash';
import { auth } from '@clerk/nextjs/server';

export const generateMetadata = () => {
  const { orgSlug } = auth();

  return {
    title: startCase(orgSlug || 'organization'),
  };
};

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
