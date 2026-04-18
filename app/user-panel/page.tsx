"use client";

import Headline from "@/components/ui/headline";
import { CharacterList } from "./_components/character-list";
import { useUserPanel } from "./_context/user-panel-context";

export default function UserPanelPage() {
  const { characters } = useUserPanel();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Headline>
          <h1 className="text-2xl font-serif font-bold gold-gradient-text">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {characters.length} character{characters.length !== 1 ? "s" : ""} in
            your account
          </p>
          </Headline>
      </div>

      {/* Characters Section */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Your Characters
        </h2>
        <CharacterList characters={characters} />
      </div>
    </div>
  );
}
