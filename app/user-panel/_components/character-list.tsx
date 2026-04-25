"use client";

import ClassAvatar from "@/components/class-avatar";
import { Character, CLASS_COLOR } from "@/lib/types/character";
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
        <User className="text-muted-foreground/50 mx-auto mb-3 size-12" />
        <h3 className="mb-2 text-lg font-medium">No Characters</h3>
        <p className="text-muted-foreground text-sm">
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
              className="hover:bg-muted/20 flex w-full items-center gap-4 p-4 transition-colors"
            >
              <ClassAvatar
                muClass={character.class}
                color={classColor}
                className="h-14 w-12 shrink-0"
              />

              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground truncate font-semibold">
                    {character.name}
                  </span>
                  <span
                    className="shrink-0 text-xs tracking-wide uppercase"
                    style={{ color: classColor }}
                  >
                    {character.class}
                  </span>
                </div>
                <div className="mt-1 flex gap-4">
                  <span className="text-muted-foreground text-xs">
                    Level{" "}
                    <span className="text-foreground font-medium">
                      {character.level}
                    </span>
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Resets{" "}
                    <span className="text-gold font-medium">
                      {character.resets}
                    </span>
                  </span>
                </div>
              </div>

              <ChevronRight
                className={`text-muted-foreground size-5 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="animate-fade-in px-4 pb-4">
                <div className="border-border/50 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                      { label: "Level", value: character.level },
                      { label: "Resets", value: character.resets },
                      { label: "Free Points", value: character.freePoints },
                      {
                        label: "PK Count",
                        value: character.pkCount,
                        color:
                          character.pkCount > 0
                            ? "hsl(var(--crimson))"
                            : undefined,
                      },
                      { label: "Strength", value: character.stats.str },
                      { label: "Agility", value: character.stats.agi },
                      { label: "Vitality", value: character.stats.vit },
                      { label: "Energy", value: character.stats.ene },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <p className="text-muted-foreground mb-0.5 text-xs">
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

                  <div className="border-border/50 mt-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">Zen</span>
                      <span className="text-gold font-bold tabular-nums">
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
