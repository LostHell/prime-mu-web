export type RankingView = "players" | "guilds" | "online" | "events";

export const getRankingView = (
  value: string | string[] | undefined,
): RankingView => {
  const view = Array.isArray(value) ? value[0] : value;
  if (view === "guilds" || view === "online" || view === "events") return view;
  return "players";
};
