"use client";

import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { CharacterList } from "./_components/character-list";
import { useUserPanel } from "./_context/user-panel-context";

export default function UserPanelPage() {
  const { characters } = useUserPanel();

  return (
    <>
      <Headline>
        <Text as="h1" variant="h4">
          Dashboard
        </Text>
        <Text variant="small">
          {characters.length} character{characters.length !== 1 ? "s" : ""} in
          your account
        </Text>
      </Headline>

      <CharacterList characters={characters} />
    </>
  );
}
