export type ServerInfo = {
  version: string;
  experience: string;
  drop: string;
  maxLevel: number;
  maxResets: number;
  points: string;
  online: number;
  maxOnline: number;
  registered: number;
  guilds: number;
  status: "online" | "offline";
};
