import { OrganizationSwitcher } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default function OrganizationDetailPage({
  params,
}: {
  params: {
    organizationId: string;
  };
}) {
  const { userId, orgId } = auth();
  return (
    <div>
      <OrganizationSwitcher hidePersonal />
    </div>
  );
}
