"use client";

import { Character } from "@/types/character";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold gold-gradient-text">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>

      {/* Character Selector */}
      <div className="card-dark p-6">
        <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-3">
          Select Character
        </label>
        <CharacterSelector relevantFields={relevantFields} />
      </div>

      {/* Action Form - Only shown when character is selected */}
      {selectedCharacter && (
        <div className="card-dark p-6">
          {children(selectedCharacter)}
        </div>
      )}
    </div>
  );
}
