'use client';

import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import { useLocalStorage } from 'usehooks-ts';

interface SidebarProps {
  storageKey?: string;
}
export const Sidebar = ({ storageKey = 't-sidebar-state' }: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const { organization, isLoaded: isLoadedOrg } = useOrganization();
  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  return <div>side bar</div>;
};
