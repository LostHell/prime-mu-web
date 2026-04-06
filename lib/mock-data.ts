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

export const classColors: Record<MuClass, string> = {
  "Dark Knight": "class-badge-dk",
  "Dark Wizard": "class-badge-dw",
  "Fairy Elf": "class-badge-fe",
  "Magic Gladiator": "class-badge-mg",
  "Dark Lord": "class-badge-dl",
};

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
