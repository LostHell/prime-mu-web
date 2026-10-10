import PageLayout from "@/components/page-layout";
import { UserPanelFrame } from "./user-panel-frame";

interface UserPanelShellProps {
  children: React.ReactNode;
}

export function UserPanelShell({ children }: UserPanelShellProps) {
  return (
    <PageLayout
      as="div"
      variant="panel"
      className="bg-card/80 border-border relative lg:border-x backdrop-blur-md"
    >
      <UserPanelFrame>{children}</UserPanelFrame>
    </PageLayout>
  );
}
