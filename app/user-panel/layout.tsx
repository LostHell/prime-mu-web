import { auth } from "@/auth";
import { getCharacters } from "@/lib/queries/get-characters";
import { redirect } from "next/navigation";
import { UserPanelShell } from "./_components/user-panel-shell";
import { UserPanelProvider } from "./_context/user-panel-context";

interface UserPanelLayoutProps {
  children: React.ReactNode;
}

const UserPanelLayout = async ({ children }: UserPanelLayoutProps) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const characters = await getCharacters(session.user.id);

  return (
    <UserPanelProvider characters={characters}>
      <UserPanelShell>{children}</UserPanelShell>
    </UserPanelProvider>
  );
};

export default UserPanelLayout;
