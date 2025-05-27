import { PageHeader } from "@/components/shared/page-header";
import { ProfileClient } from "@/components/pages/profile/profile-client";

export default function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Manage your personal information, skills, and preferences."
      />
      <ProfileClient />
    </div>
  );
}
