"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Character } from "@/lib/types/character";
import { User } from "lucide-react";
import { useUserPanel } from "../_context/user-panel-context";

export type RelevantField =
  | "level"
  | "resets"
  | "freePoints"
  | "pkCount"
  | "zen"
  | "stats";

interface CharacterSelectorProps {
  relevantFields?: RelevantField[];
  onSelect?: (character: Character) => void;
}

const FIELD_LABELS: Record<RelevantField, string> = {
  level: "Level",
  resets: "Resets",
  freePoints: "Free Points",
  pkCount: "PK",
  zen: "Zen",
  stats: "Stats",
};

function formatFieldValue(character: Character, field: RelevantField): string {
  switch (field) {
    case "level":
      return character.level.toLocaleString();
    case "resets":
      return character.resets.toLocaleString();
    case "freePoints":
      return character.freePoints.toLocaleString();
    case "pkCount":
      return character.pkCount.toLocaleString();
    case "zen":
      return character.zen.toLocaleString();
    case "stats":
      return `STR ${character.stats.str} / AGI ${character.stats.agi}`;
    default:
      return "";
  }
}

export function CharacterSelector({
  relevantFields = ["level", "resets"],
  onSelect,
}: CharacterSelectorProps) {
  const { characters, selectedCharacter, selectCharacterByName } =
    useUserPanel();

  const handleSelect = (name: string) => {
    selectCharacterByName(name);
    const character = characters.find((c) => c.name === name);
    if (character && onSelect) {
      onSelect(character);
    }
  };

  if (characters.length === 0) {
    return (
      <div className="border-border/50 bg-muted/20 rounded-xl border p-6 text-center">
        <User className="text-muted-foreground/50 mx-auto mb-2 size-10" />
        <p className="text-muted-foreground text-sm">No characters found</p>
      </div>
    );
  }

  const selected = selectedCharacter;

  return (
    <Field>
      <FieldLabel htmlFor="characterSelector">Select Character</FieldLabel>
      <Select value={selected?.name ?? ""} onValueChange={handleSelect}>
        <SelectTrigger className="bg-card border-gold-dim/50 hover:border-gold/50 h-auto w-full p-4 transition-colors [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-3">
          <SelectValue id="characterSelector" placeholder="Select a character">
            {selected ? (
              <>
                <div className="min-w-0 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{selected.name}</span>
                    <span className="text-[10px] tracking-wide uppercase">
                      {selected.class}
                    </span>
                  </div>
                  <div className="text-muted-foreground mt-0.5 flex gap-3 text-xs">
                    {relevantFields.slice(0, 3).map((field) => (
                      <span key={field}>
                        {FIELD_LABELS[field]}:{" "}
                        <span className="text-gold">
                          {formatFieldValue(selected, field)}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-muted/50 flex h-12 w-10 shrink-0 items-center justify-center rounded-lg">
                  <User className="text-muted-foreground size-5" />
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground font-medium">
                    Select a character
                  </div>
                  <div className="text-muted-foreground/70 text-xs">
                    {characters.length} available
                  </div>
                </div>
              </>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="min-w-(--radix-select-trigger-width) p-2">
          {characters.map((character) => {
            return (
              <SelectItem
                key={character.name}
                value={character.name}
                className="cursor-pointer rounded-lg p-3 [&>span:first-child]:hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{character.name}</span>
                      <span className="text-[10px] tracking-wide uppercase">
                        {character.class}
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-0.5 flex gap-3 text-xs">
                      {relevantFields.slice(0, 5).map((field) => (
                        <span key={field}>
                          {FIELD_LABELS[field]}:{" "}
                          {formatFieldValue(character, field)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </Field>
  );
}
