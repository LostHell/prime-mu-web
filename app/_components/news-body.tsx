import type { NewsId } from "@/constants/news";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

const bodyClassName =
  "text-muted-foreground space-y-2 leading-relaxed [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5";

// The text of each news item; its date, title and summary are in constants/news.ts.
const bodies: Record<NewsId, ReactNode> = {
  marketplace: (
    <>
      <p>
        List gear from your warehouse and buy from other players. A listing can
        be priced in any of these:
      </p>
      <ul>
        <li>Zen</li>
        <li>Rena</li>
        <li>Jewels of Bless, Soul, Life, Creation, and Chaos</li>
      </ul>
      <p>
        <Link href="/user-panel/market">Browse the market</Link>
      </p>
    </>
  ),
  resets: (
    <>
      <p>
        A character that has reached the reset level can reset here. The zen
        cost rises with each reset.
      </p>
      <p>
        The points from that reset are free to assign on{" "}
        <Link href="/user-panel/add-stats">Add stats</Link>, without logging out
        of the game.
      </p>
    </>
  ),
  rankings: (
    <p>
      <Link href="/rankings">Rankings</Link> now cover players, guilds, and who
      is online. Castle scores for Blood Castle and Devil Square are on the
      Events tab.
    </p>
  ),
};

/** The full text of a news item, for the home page and its own page. */
export const NewsBody = ({
  id,
  className,
}: {
  id: NewsId;
  className?: string;
}) => {
  return <div className={cn(bodyClassName, className)}>{bodies[id]}</div>;
};
