import { ServerInfo } from "@/types/server-info";

export type MuClass = "Dark Knight" | "Dark Wizard" | "Fairy Elf" | "Magic Gladiator" | "Dark Lord";

export interface Player {
  rank: number;
  name: string;
  class: MuClass;
  level: number;
  resets: number;
  guild?: string;
}

export interface DevilSquareEntry {
  rank: number;
  name: string;
  class: MuClass;
  score: number;
}

export interface BloodCastleEntry {
  rank: number;
  name: string;
  class: MuClass;
  score: number;
}

export interface DisconnectedUser {
  name: string;
  map: string;
  class: MuClass;
  time: string;
}

export const classColors: Record<MuClass, string> = {
  "Dark Knight": "class-badge-dk",
  "Dark Wizard": "class-badge-dw",
  "Fairy Elf": "class-badge-fe",
  "Magic Gladiator": "class-badge-mg",
  "Dark Lord": "class-badge-dl",
};

export const topPlayers: Player[] = [
  { rank: 1, name: "xDarkLord", class: "Dark Lord", level: 400, resets: 15, guild: "Legends" },
  { rank: 2, name: "ShadowBlade", class: "Dark Knight", level: 400, resets: 14, guild: "Legends" },
  { rank: 3, name: "ArcaneStorm", class: "Dark Wizard", level: 400, resets: 13, guild: "Phoenix" },
  { rank: 4, name: "ElvenQueen", class: "Fairy Elf", level: 398, resets: 13, guild: "Phoenix" },
  { rank: 5, name: "MageSlayer", class: "Magic Gladiator", level: 400, resets: 12, guild: "Chaos" },
  { rank: 6, name: "NightFury", class: "Dark Knight", level: 395, resets: 12, guild: "Chaos" },
  { rank: 7, name: "FrostMage", class: "Dark Wizard", level: 400, resets: 11, guild: "Legends" },
  { rank: 8, name: "WindArcher", class: "Fairy Elf", level: 392, resets: 11, guild: "Valor" },
  { rank: 9, name: "BladeMaster", class: "Dark Knight", level: 400, resets: 10, guild: "Valor" },
  { rank: 10, name: "ThunderGod", class: "Magic Gladiator", level: 388, resets: 10, guild: "Chaos" },
  { rank: 11, name: "DragonSlayer", class: "Dark Lord", level: 400, resets: 9, guild: "Legends" },
  { rank: 12, name: "SilverArrow", class: "Fairy Elf", level: 385, resets: 9 },
  { rank: 13, name: "DarkPhoenix", class: "Dark Wizard", level: 400, resets: 8, guild: "Phoenix" },
  { rank: 14, name: "IronFist", class: "Dark Knight", level: 380, resets: 8 },
  { rank: 15, name: "MysticLord", class: "Dark Lord", level: 375, resets: 7, guild: "Valor" },
];

export const devilSquareRanking: DevilSquareEntry[] = [
  { rank: 1, name: "xDarkLord", class: "Dark Lord", score: 98500 },
  { rank: 2, name: "ShadowBlade", class: "Dark Knight", score: 95200 },
  { rank: 3, name: "MageSlayer", class: "Magic Gladiator", score: 91800 },
  { rank: 4, name: "ArcaneStorm", class: "Dark Wizard", score: 88400 },
  { rank: 5, name: "ElvenQueen", class: "Fairy Elf", score: 85100 },
];

export const bloodCastleRanking: BloodCastleEntry[] = [
  { rank: 1, name: "ShadowBlade", class: "Dark Knight", score: 87600 },
  { rank: 2, name: "ArcaneStorm", class: "Dark Wizard", score: 84300 },
  { rank: 3, name: "xDarkLord", class: "Dark Lord", score: 81900 },
  { rank: 4, name: "NightFury", class: "Dark Knight", score: 78500 },
  { rank: 5, name: "FrostMage", class: "Dark Wizard", score: 75200 },
];

export const lastDisconnected: DisconnectedUser[] = [
  { name: "xDarkLord", map: "Lorencia", class: "Magic Gladiator", time: "2 min ago" },
  { name: "FrostMage", map: "Noria", class: "Dark Wizard", time: "5 min ago" },
  { name: "WindArcher", map: "Davias", class: "Fairy Elf", time: "8 min ago" },
  { name: "NightFury", map: "Lost Tower", class: "Dark Lord", time: "12 min ago" },
  { name: "ElvenQueen", map: "Davias", class: "Fairy Elf", time: "15 min ago" },
  { name: "BladeMaster", map: "Tarkan", class: "Dark Knight", time: "20 min ago" },
  { name: "ThunderGod", map: "Icarus", class: "Magic Gladiator", time: "25 min ago" },
  { name: "DarkPhoenix", map: "Atlans", class: "Dark Wizard", time: "30 min ago" },
  { name: "IronFist", map: "Tarkan", class: "Dark Knight", time: "35 min ago" },
  { name: "SilverArrow", map: "Davias", class: "Fairy Elf", time: "42 min ago" },
];

// Event schedules — hours (local time) at which each event starts
export const eventSchedules = {
  devilSquare: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23], // every odd hour
  bloodCastle: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], // every even hour
};

export const serverInfo: ServerInfo = {
  version: "0.97d",
  experience: "30x",
  drop: "40%",
  maxLevel: 350,
  maxResets: 50,
  points: "350/lvl",
  online: 247,
  maxOnline: 500,
  registered: 3842,
  guilds: 65,
  status: "online" as "online" | "offline",
};
