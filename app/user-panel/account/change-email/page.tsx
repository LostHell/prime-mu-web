import { UserPanelPageLayout } from "@/app/user-panel/_components/user-panel-page-layout";
import { ChangeEmailForm } from "./_components/change-email-form";

export default function ChangeEmailPage() {
  return (
    <UserPanelPageLayout
      title="Change Email"
      description="Update your account email address"
    >
      <ChangeEmailForm />
    </UserPanelPageLayout>
  );
}
