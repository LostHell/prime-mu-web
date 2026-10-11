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

/** When an event starts: dayOfWeek 1 = Sunday ... 7 = Saturday, or null for every day. */
export type EventScheduleEntry = {
  dayOfWeek: number | null;
  hour: number;
  minute: number;
};

/** A scheduled server event (GameServerInfo - Event.dat and Data/Event/*.dat). */
export type GameEvent = {
  /** bloodCastle, devilSquare, bonus-<index>, invasion-<index> or goldenArcherBingo. */
  id: string;
  name: string;
  /** Whether the event's switch in GameServerInfo - Event.dat is on. */
  enabled: boolean;
  durationMinutes: number;
  /** Times are in the game server's time zone (SERVER_TIME_ZONE). */
  schedule: EventScheduleEntry[];
  /** Map numbers the event spawns on (invasions). */
  maps?: number[];
  /**
   * Bonuses while the event runs (bonus events). type is experience, itemDrop,
   * commonItemDrop, excItemDrop, resetAmount or grandResetAmount; for
   * experience and itemDrop, value is the percentage added (150 = +150%).
   */
  bonuses?: { type: string; value: number }[];
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
  events: {
    /** Daily start times in hours (0.5 = 00:30). */
    bloodCastle: number[];
    devilSquare: number[];
    /** Every scheduled event on the server, including Blood Castle and Devil Square. */
    list: GameEvent[];
  };
  maps: Record<string, string>;
  warehouse: {
    maxMoney: number;
  };
  pkClear: {
    /** Zen charged per PK kill by /pkclear and the website (CommandPKClearMoney). */
    moneyPerKill: number;
  };
  account: {
    /** How memb__pwd is stored (JoinServer.ini MD5Encryption): 0 plain, 1 Webzen MD5, 2 MD5. */
    md5Encryption: number;
  };
};

export const serverConfig: ServerConfig = config;
