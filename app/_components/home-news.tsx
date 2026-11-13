import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import { NEWS, type NewsId } from "@/constants/news";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

const bodyClassName =
  "text-muted-foreground space-y-2 text-sm leading-relaxed [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5";

// The text of each news item; its date and title are in constants/news.ts (the launcher reads them too).
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

const HomeNews = () => {
  return (
    <section>
      <Text variant="h3" as="h2" className="mb-4">
        Latest News
      </Text>
      <Card>
        <CardContent className="flex flex-col gap-6">
          {NEWS.map((item, index) => (
            <article
              key={item.id}
              id={`news-${item.id}`}
              className={cn(index > 0 && "border-border border-t pt-6")}
            >
              <time
                dateTime={item.dateTime}
                className="text-muted-foreground text-xs tracking-widest uppercase"
              >
                {item.date}
              </time>
              <h3 className="mt-2 font-serif text-2xl font-semibold">
                {item.title}
              </h3>
              <div className={cn("mt-3", bodyClassName)}>{bodies[item.id]}</div>
            </article>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default HomeNews;
