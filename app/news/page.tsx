import {
  NEWS_FEED_ALTERNATE,
  NEWS_FEED_PATH,
} from "@/app/_constants/news-feed";
import PageHero from "@/components/page-hero";
import PageLayout from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import { BRAND } from "@/constants/app";
import { NEWS } from "@/constants/news";
import { getServerStatus } from "@/lib/queries/get-server-status";
import { cn } from "@/lib/utils";
import { formatServerLiveNote } from "@/lib/utils/dates";
import { openGraphFor } from "@/lib/utils/open-graph";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News",
  description: `News from ${BRAND}, newest first: new features on the website, server changes and updates for the MU Online private server.`,
  alternates: { canonical: "/news", types: NEWS_FEED_ALTERNATE },
  openGraph: openGraphFor("/news"),
};

const NewsPage = async () => {
  const { status } = await getServerStatus();

  return (
    <>
      <PageHero
        label="News"
        title="News"
        description="What changed on the server, newest first."
        status={status}
        statusNote={formatServerLiveNote()}
      />
      <PageLayout>
        <Card>
          <CardContent className="flex flex-col gap-6">
            {NEWS.map((item, index) => (
              <article
                key={item.id}
                className={cn(index > 0 && "border-border border-t pt-6")}
              >
                <time
                  dateTime={item.dateTime}
                  className="text-muted-foreground text-xs tracking-widest uppercase"
                >
                  {item.date}
                </time>
                <Text variant="h4" as="h2" className="mt-2">
                  <Link href={`/news/${item.id}`} className="hover:underline">
                    {item.title}
                  </Link>
                </Text>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {item.summary}
                </p>
                <Link
                  href={`/news/${item.id}`}
                  className="text-gold mt-2 inline-block text-sm underline underline-offset-4"
                  aria-label={`Read more: ${item.title}`}
                >
                  Read more
                </Link>
              </article>
            ))}
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-6 text-sm">
          Follow the news in a feed reader:{" "}
          <a
            href={NEWS_FEED_PATH}
            className="text-gold underline underline-offset-4"
          >
            RSS feed
          </a>
          .
        </p>
      </PageLayout>
    </>
  );
};

export default NewsPage;
