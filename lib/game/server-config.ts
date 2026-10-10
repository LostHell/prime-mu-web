import config from "./data/server-config.json";

type ClassValues<T> = Record<"dw" | "dk" | "fe" | "mg", T>;

/** One row of the server's reset table: the requirements and reward of a reset. */
export type ResetRule = {
  /** Which reset this is (1 = the first reset). */
  reset: number;
  level: number;
  money: number;
  points: number;
};

/**
 * Server settings synced from LostHell/mu-online-server by its
 * "Sync server data to web" workflow (.github/scripts/export-web-config.ts).
 * Don't edit server-config.json by hand; change the server and let the
 * workflow open a pull request.
 */
export type ServerConfig = {
  server: {
    maxOnline: number;
    /** Experience multiplier (AddExperienceRate). */
    experienceRate: number;
    /** Item drop rate in percent (ItemDropRate). */
    itemDropRate: number;
  };
  character: {
    maxLevel: number;
    maxStatPoint: number;
    levelUpPoints: ClassValues<number>;
    plusStatPoint: number;
    defaultStats: ClassValues<{
      str: number;
      agi: number;
      vit: number;
      ene: number;
    }>;
    /** Quests by quest index: their level-up point reward and who can take them. */
    quests: Record<
      string,
      /** `classes` holds class keys: "dw", "dk", "fe", "mg". */
      { rewardPoints: number; classes: string[] }
    >;
    /**
     * Whether finishing quest 2 grants PlusStatPoint per level above 220
     * (the server has a HERO quest reward).
     */
    heroLevelBonus: boolean;
  };
  reset: {
    limit: number;
    table: ResetRule[];
  };
  /** Daily start times in hours (0.5 = 00:30). */
  events: {
    bloodCastle: number[];
    devilSquare: number[];
  };
  maps: Record<string, string>;
  warehouse: {
    maxMoney: number;
  };
};

export const serverConfig: ServerConfig = config;
