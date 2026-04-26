import { auth } from "@/auth";
import PageLayout from "@/components/page-layout";
import { getCharacters } from "@/lib/queries/get-characters";
import { redirect } from "next/navigation";
import { UserPanelNav } from "./_components/user-panel-nav";
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
      <UserPanelNav />
      <PageLayout as="main" variant="panel">
        {children}
      </PageLayout>
    </UserPanelProvider>
  );
};

export default UserPanelLayout;
