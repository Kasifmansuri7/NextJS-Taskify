import { OrganizationProfile } from '@clerk/nextjs';

export default function OrganizationSettingsPage() {
  return (
    <div>
      <OrganizationProfile
        appearance={{
          elements: {
            card: {
              boxShadow: 'none',
            },
          },
        }}
      />
    </div>
  );
}
