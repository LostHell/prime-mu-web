"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Character, CLASS_COLOR } from "@/types/character";
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
  const { characters, selectedCharacter, selectCharacterByName } = useUserPanel();

  const handleSelect = (name: string) => {
    selectCharacterByName(name);
    const character = characters.find((c) => c.name === name);
    if (character && onSelect) {
      onSelect(character);
    }
  };

  if (characters.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 p-6 text-center bg-muted/20">
        <User className="size-10 mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No characters found</p>
      </div>
    );
  }

  const selected = selectedCharacter;
  const selectedColor = selected ? CLASS_COLOR[selected.class] : undefined;

  return (
    <Select value={selected?.name ?? ""} onValueChange={handleSelect}>
      <SelectTrigger className="w-full h-auto p-4 bg-card border-gold-dim/50 hover:border-gold/50 transition-colors [&>span]:flex [&>span]:items-center [&>span]:gap-3 [&>span]:w-full">
        <SelectValue placeholder="Select a character">
          {selected ? (
            <>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{selected.name}</span>
                  <span
                    className="text-[10px] uppercase tracking-wide"
                    style={{ color: selectedColor }}
                  >
                    {selected.class}
                  </span>
                </div>
                <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                  {relevantFields.slice(0, 3).map((field) => (
                    <span key={field}>
                      {FIELD_LABELS[field]}:{" "}
                      <span className="text-gold">{formatFieldValue(selected, field)}</span>
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-12 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                <User className="size-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <div className="font-medium text-muted-foreground">Select a character</div>
                <div className="text-xs text-muted-foreground/70">
                  {characters.length} available
                </div>
              </div>
            </>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="p-2 min-w-[var(--radix-select-trigger-width)]">
        {characters.map((character) => {
          const classColor = CLASS_COLOR[character.class];
          return (
            <SelectItem
              key={character.name}
              value={character.name}
              className="p-3 rounded-lg cursor-pointer [&>span:first-child]:hidden"
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{character.name}</span>
                    <span
                      className="text-[10px] uppercase tracking-wide"
                      style={{ color: classColor }}
                    >
                      {character.class}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                    {relevantFields.slice(0, 5).map((field) => (
                      <span key={field}>
                        {FIELD_LABELS[field]}: {formatFieldValue(character, field)}
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
  );
}
