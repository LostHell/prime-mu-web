import type { RankingView } from "@/app/rankings/_utils/ranking-view";
import { cn } from "@/lib/utils";
import Link from "next/link";

const tabs: { view: RankingView; label: string }[] = [
  { view: "players", label: "Players" },
  { view: "guilds", label: "Guilds" },
  { view: "online", label: "Online players" },
  { view: "events", label: "Events" },
];

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
