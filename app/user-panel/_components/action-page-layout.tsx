"use client";

import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { type Character } from "@/lib/types/character";
import { useUserPanel } from "../_context/user-panel-context";
import { CharacterSelector, RelevantField } from "./character-selector";
import { LayoutCard } from "./layout-card";

interface ActionPageLayoutProps {
  title: string;
  description?: string;
  relevantFields?: RelevantField[];
  children: (character: Character) => React.ReactNode;
}

export function ActionPageLayout({
  title,
  description,
  relevantFields = ["level", "resets"],
  children,
}: ActionPageLayoutProps) {
  const { selectedCharacter } = useUserPanel();

  return (
    <>
      <Headline>
        <Text as="h1" variant="h4">
          {title}
        </Text>
        {description && <Text variant="small">{description}</Text>}
      </Headline>

      <LayoutCard>
        <CharacterSelector relevantFields={relevantFields} />
        {selectedCharacter && children(selectedCharacter)}
      </LayoutCard>
    </>
  );
}
