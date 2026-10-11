import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import { getRankings } from "@/lib/queries/get-rankings";
import { formatNumber } from "@/lib/utils/numbers";
import Link from "next/link";
import { Suspense } from "react";

const TopPlayersList = async () => {
  const { characters } = await getRankings({ pageSize: 3 });

  return (
    <Card>
      <CardContent>
        {characters.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No characters on the ranking yet.
          </p>
        ) : (
          <ol className="divide-border/50 grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
            {characters.map((character) => (
              <li
                key={character.name}
                className="flex items-center gap-4 py-4 md:px-5 md:py-0 md:first:pl-0 md:last:pr-0"
              >
                <span className="text-gold font-serif text-3xl leading-none">
                  {character.rank}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{character.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {character.class}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="gold-gradient-text font-semibold">
                      {formatNumber(character.resets)} resets
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      · Lv. {formatNumber(character.level)}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};

const TopPlayersFallback = () => {
  return (
    <Card>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {["first", "second", "third"].map((place) => (
          <div key={place} className="bg-muted h-16 animate-pulse rounded" />
        ))}
      </CardContent>
    </Card>
  );
};

const TopPlayers = () => {
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Text variant="h3" as="h2">
            Server leaders
          </Text>
          <Text variant="small" className="mt-1">
            Ranked by resets, then level.
          </Text>
        </div>
        <Button variant="link" asChild>
          <Link href="/rankings">Full rankings</Link>
        </Button>
      </div>
      <Suspense fallback={<TopPlayersFallback />}>
        <TopPlayersList />
      </Suspense>
    </section>
  );
};

export default TopPlayers;
