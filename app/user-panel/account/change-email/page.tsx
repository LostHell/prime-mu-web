import { UserPanelPageLayout } from "@/app/user-panel/_components/user-panel-page-layout";
import type { Metadata } from "next";
import { ChangeEmailForm } from "./_components/change-email-form";

export const metadata: Metadata = {
  title: "Change Email",
};

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
