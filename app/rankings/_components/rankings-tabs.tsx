import { cn } from "@/lib/utils";
import Link from "next/link";

export type RankingView = "players" | "guilds" | "online" | "events";

const tabs: { view: RankingView; label: string }[] = [
  { view: "players", label: "Players" },
  { view: "guilds", label: "Guilds" },
  { view: "online", label: "Online players" },
  { view: "events", label: "Events" },
];

export const getRankingView = (
  value: string | string[] | undefined,
): RankingView => {
  const view = Array.isArray(value) ? value[0] : value;
  if (view === "guilds" || view === "online" || view === "events") return view;
  return "players";
};

const RankingsTabs = ({ view }: { view: RankingView }) => {
  return (
    <nav
      aria-label="Ranking lists"
      className="border-border flex gap-6 border-b"
    >
      {tabs.map((tab) => {
        const current = tab.view === view;
        return (
          <Link
            key={tab.view}
            href={
              tab.view === "players"
                ? "/rankings"
                : `/rankings?view=${tab.view}`
            }
            aria-current={current ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 pb-3 font-serif text-sm",
              current
                ? "border-gold text-gold"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default RankingsTabs;
