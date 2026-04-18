import { auth } from "@/auth";
import PageLayout from "@/components/page-layout";
import { redirect } from "next/navigation";
import { UserPanelNav } from "./_components/user-panel-nav";
import { UserPanelProvider } from "./_context/user-panel-context";
import { getCharacters } from "./_lib/get-characters";

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
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </UserPanelProvider>
  );
};

export default UserPanelLayout;
