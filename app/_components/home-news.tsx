import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import { NEWS } from "@/constants/news";
import { cn } from "@/lib/utils";
import Link from "next/link";

const HomeNews = () => {
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <Text variant="h3" as="h2">
          Latest News
        </Text>
        <Button variant="link" asChild>
          <Link href="/news">All news</Link>
        </Button>
      </div>
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
                <Link href={`/news/${item.id}`} className="hover:text-gold">
                  {item.title}
                </Link>
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
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
    </section>
  );
};

export default HomeNews;
