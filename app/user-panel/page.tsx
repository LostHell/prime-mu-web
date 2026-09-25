"use client";

import { Separator } from "@/components/ui/separator";
import { CMD_CLASSES } from "@/lib/types/character";
import { ActionPageLayout } from "./_components/action-page-layout";
import {
  CharacterSection,
  CharacterValues,
} from "./_components/character-info";

export default function UserPanelPage() {
  return (
    <ActionPageLayout
      title="Character overview"
      description="Progress, attributes, and balances for your selected character."
    >
      {(character) => (
        <div className="flex flex-col gap-6">
          <CharacterSection title="Progression">
            <CharacterValues
              items={[
                {
                  label: "Free stat points",
                  value: character.freePoints.toLocaleString(),
                },
                { label: "Guild", value: character.guild || "No guild" },
              ]}
            />
          </CharacterSection>
          <Separator />
          <CharacterSection title="Attributes">
            <CharacterValues
              items={[
                {
                  label: "Strength",
                  value: character.stats.str.toLocaleString(),
                },
                {
                  label: "Agility",
                  value: character.stats.agi.toLocaleString(),
                },
                {
                  label: "Vitality",
                  value: character.stats.vit.toLocaleString(),
                },
                {
                  label: "Energy",
                  value: character.stats.ene.toLocaleString(),
                },
                ...(CMD_CLASSES.includes(character.class)
                  ? [
                      {
                        label: "Command",
                        value: character.stats.cmd.toLocaleString(),
                      },
                    ]
                  : []),
              ]}
            />
          </CharacterSection>
          <Separator />
          <CharacterSection title="Balance & PK status">
            <CharacterValues
              items={[
                { label: "Zen", value: character.zen.toLocaleString() },
                { label: "PK kills", value: character.pkCount },
              ]}
            />
          </CharacterSection>
        </div>
      )}
    </ActionPageLayout>
  );
}
