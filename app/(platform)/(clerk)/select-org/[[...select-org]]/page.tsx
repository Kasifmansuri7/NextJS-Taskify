import { OrganizationList } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
export default async function CreateOrganizationPage() {
  const user = await currentUser();
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organization/:id"
      afterCreateOrganizationUrl="/organization/:id"
    />
  );
}
