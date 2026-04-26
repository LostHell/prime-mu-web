"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { type Character } from "@/lib/types/character";
import { useUserPanel } from "../_context/user-panel-context";
import { CharacterSelector, RelevantField } from "./character-selector";

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

      <Card>
        <CardContent>
          <Field className="mb-2">
            <FieldLabel htmlFor="characterSelector">
              Select Character
            </FieldLabel>
          </Field>
          <CharacterSelector relevantFields={relevantFields} />
          {selectedCharacter && children(selectedCharacter)}
        </CardContent>
      </Card>
    </>
  );
}
