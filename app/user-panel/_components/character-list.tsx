"use client";

import ClassAvatar from "@/components/class-avatar";
import { Character, CLASS_COLOR } from "@/types/character";
import { ChevronRight, User } from "lucide-react";
import { useState } from "react";

interface CharacterListProps {
  characters: Character[];
}

export function CharacterList({ characters }: CharacterListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (characters.length === 0) {
    return (
      <div className="card-dark p-8 text-center">
        <User className="size-12 mx-auto mb-3 text-muted-foreground/50" />
        <h3 className="font-medium text-lg mb-2">No Characters</h3>
        <p className="text-sm text-muted-foreground">
          Create a character in-game to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {characters.map((character, index) => {
        const classColor = CLASS_COLOR[character.class];
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={character.name}
            className="card-dark overflow-hidden transition-all"
            style={{
              borderColor: isExpanded ? `${classColor}50` : undefined,
            }}
          >
            {/* Main Row */}
            <button
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="w-full p-4 flex items-center gap-4 hover:bg-muted/20 transition-colors"
            >
              <ClassAvatar
                muClass={character.class}
                color={classColor}
                className="w-12 h-14 shrink-0"
              />

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-foreground truncate">
                    {character.name}
                  </span>
                  <span
                    className="text-xs uppercase tracking-wide shrink-0"
                    style={{ color: classColor }}
                  >
                    {character.class}
                  </span>
                </div>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Level{" "}
                    <span className="text-foreground font-medium">
                      {character.level}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Resets{" "}
                    <span className="text-gold font-medium">
                      {character.resets}
                    </span>
                  </span>
                </div>
              </div>

              <ChevronRight
                className={`size-5 text-muted-foreground transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-4 pb-4 animate-fade-in">
                <div className="pt-4 border-t border-border/50">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Level", value: character.level },
                      { label: "Resets", value: character.resets },
                      { label: "Free Points", value: character.freePoints },
                      {
                        label: "PK Count",
                        value: character.pkCount,
                        color:
                          character.pkCount > 0 ? "hsl(var(--crimson))" : undefined,
                      },
                      { label: "Strength", value: character.stats.str },
                      { label: "Agility", value: character.stats.agi },
                      { label: "Vitality", value: character.stats.vit },
                      { label: "Energy", value: character.stats.ene },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground mb-0.5">
                          {label}
                        </p>
                        <p
                          className="font-semibold tabular-nums"
                          style={{ color: color ?? classColor }}
                        >
                          {value.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Zen</span>
                      <span className="font-bold text-gold tabular-nums">
                        {character.zen.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
