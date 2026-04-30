"use client";

import { CharacterList } from "./_components/character-list";
import { UserPanelPageLayout } from "./_components/user-panel-page-layout";
import { useUserPanel } from "./_context/user-panel-context";

export default function UserPanelPage() {
  const { characters } = useUserPanel();

  return (
    <UserPanelPageLayout
      title="Dashboard"
      description={`${characters.length} character${characters.length !== 1 ? "s" : ""} in your account`}
    >
      <CharacterList characters={characters} />
    </UserPanelPageLayout>
  );
}
