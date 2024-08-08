import { OrganizationSwitcher } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default function OrganizationIdPage({
  params,
}: {
  params: {
    organizationId: string;
  };
}) {
  const { userId, orgId } = auth();
  return <div>Organization details: {orgId}</div>;
}
