import { UserPanelPageLayout } from "@/app/user-panel/_components/user-panel-page-layout";
import { ChangePasswordForm } from "./_components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <UserPanelPageLayout
      title="Change Password"
      description="Update your account password"
    >
      <ChangePasswordForm />
    </UserPanelPageLayout>
  );
}
