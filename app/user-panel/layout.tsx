import { auth } from "@/auth";
import { getCharacters } from "@/lib/queries/get-characters";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CHARACTER_SELECTION_COOKIE } from "@/constants/character-selection";
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
  const storedSelection = (await cookies()).get(
    CHARACTER_SELECTION_COOKIE,
  )?.value;
  // Only select characters from this authenticated account, regardless of cookie contents.
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
