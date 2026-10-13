"use client";

import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/lib/utils/numbers";
import { ActionPageLayout } from "./action-page-layout";
import { CharacterSection, CharacterValues } from "./character-info";

export function CharacterOverview() {
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
                  value: formatNumber(character.freePoints),
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
                  value: formatNumber(character.stats.str),
                },
                {
                  label: "Agility",
                  value: formatNumber(character.stats.agi),
                },
                {
                  label: "Vitality",
                  value: formatNumber(character.stats.vit),
                },
                {
                  label: "Energy",
                  value: formatNumber(character.stats.ene),
                },
              ]}
            />
          </CharacterSection>
          <Separator />
          <CharacterSection title="Balance & PK status">
            <CharacterValues
              items={[
                { label: "Zen", value: formatNumber(character.zen) },
                { label: "PK kills", value: character.pkCount },
              ]}
            />
          </CharacterSection>
        </div>
      )}
    </ActionPageLayout>
  );
}
