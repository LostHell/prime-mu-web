import { auth } from "@/auth";
import { CHARACTER_SELECTION_COOKIE } from "@/constants/character-selection";
import { getCharacters } from "@/lib/queries/get-characters";
import { getServerCookie } from "@/lib/utils/cookies.server";
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

  const { account, characters } = await getCharacters(session.user.id);
  const storedSelection = await getServerCookie(CHARACTER_SELECTION_COOKIE);
  const initialSelectedName = characters.find(
    (character) => character.name === storedSelection,
  )?.name;

  return (
    <UserPanelProvider
      account={account}
      characters={characters}
      initialSelectedName={initialSelectedName}
    >
      <UserPanelShell>{children}</UserPanelShell>
    </UserPanelProvider>
  );
};

export default UserPanelLayout;
