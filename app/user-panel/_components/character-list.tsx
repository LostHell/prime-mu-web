"use client";

import ClassAvatar from "@/components/class-avatar";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Character,
} from "@/lib/types/character";
import { cn } from "@/lib/utils";
import { ChevronRight, User } from "lucide-react";
import { useState } from "react";

interface CharacterListProps {
  characters: Character[];
}

export function CharacterList({ characters }: CharacterListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (characters.length === 0) {
    return (
      <Card className="gap-0 p-0">
        <EmptyState
          icon={User}
          variant="compact"
          title="No Characters"
          description="Create a character in-game to get started"
          className="py-8"
        />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {characters.map((character, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <Card
            key={character.name}
            className={cn("gap-0 overflow-hidden p-0 transition-all")}
          >
            {/* Main Row */}
            <Button
              type="button"
              variant="ghost"
              size="lg"
              aria-expanded={isExpanded}
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="hover:bg-muted/20 flex h-auto w-full items-center justify-start gap-4 rounded-none border-0 p-4 font-sans font-normal tracking-normal whitespace-normal"
            >
              <ClassAvatar
                characterClass={character.class}
                className="h-14 w-12 shrink-0"
              />

              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground truncate font-semibold">
                    {character.name}
                  </span>
                  <span
                    className="shrink-0 text-xs tracking-wide uppercase"
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
                className={`text-muted-foreground size-5 transition-transform ${isExpanded ? "rotate-90" : ""
                  }`}
              />
            </Button>

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
                        colorClass:
                          character.pkCount > 0 ? "text-crimson" : undefined,
                      },
                      { label: "Strength", value: character.stats.str },
                      { label: "Agility", value: character.stats.agi },
                      { label: "Vitality", value: character.stats.vit },
                      { label: "Energy", value: character.stats.ene },
                    ].map(({ label, value, colorClass }) => (
                      <div key={label}>
                        <p className="text-muted-foreground mb-0.5 text-xs">
                          {label}
                        </p>
                        <p
                          className={cn(
                            "font-semibold tabular-nums",
                            colorClass,
                          )}
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
          </Card>
        );
      })}
    </div>
  );
}
