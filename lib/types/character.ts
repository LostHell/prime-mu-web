export type CharacterClass =
  | "Dark Knight"
  | "Blade Knight"
  | "Dark Wizard"
  | "Soul Master"
  | "Fairy Elf"
  | "Muse Elf"
  | "Magic Gladiator"
  | "Dark Lord";

export interface CharacterStats {
  str: number;
  agi: number;
  vit: number;
  ene: number;
  cmd: number;
}

export interface Character {
  name: string;
  class: CharacterClass;
  level: number;
  resets: number;
  guild?: string;
  zen: number;
  pkCount: number;
  freePoints: number;
  stats: CharacterStats;
}

/** Account state that applies to every character returned for an account. */
export interface AccountConnectionState {
  isOffline: boolean;
}

/** The character-specific values and checks for its next reset. */
export interface NextReset {
  equipmentStatus: "empty" | "equipped" | "unknown";
  resultingLevel: number;
  resultingAvailablePoints: number;
}

/** A panel character enriched with information needed by the reset service. */
export interface CharacterWithNextReset extends Character {
  nextReset: NextReset | null;
}

/** Data needed to render the authenticated character-services panel. */
export interface AccountCharactersResult {
  account: AccountConnectionState;
  characters: CharacterWithNextReset[];
}

export const CMD_CLASSES: CharacterClass[] = ["Dark Lord"];
