import EventCountdown from "@/components/event-countdown";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Text from "@/components/ui/text";
import { type ScoredRankingEntry } from "@/lib/queries/rank-scored-characters";
import { formatNumber } from "@/lib/utils/numbers";
import { Suspense } from "react";

const RowsSkeleton = () => (
  <TableBody>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <div className="bg-muted h-4 w-6 animate-pulse rounded" />
        </TableCell>
        <TableCell>
          <div className="bg-muted h-4 w-28 animate-pulse rounded" />
        </TableCell>
        <TableCell>
          <div className="bg-muted ml-auto h-4 w-16 animate-pulse rounded" />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);

const EventRows = async ({
  load,
}: {
  load: () => Promise<ScoredRankingEntry[]>;
}) => {
  const ranking = await load();

  return (
    <TableBody>
      {ranking.map((entry) => (
        <TableRow key={entry.name}>
          <TableCell className="text-gold">{entry.rank}</TableCell>
          <TableCell className="font-medium">{entry.name}</TableCell>
          <TableCell>{formatNumber(entry.score)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export function EventRanking({
  title,
  scheduleHours,
  colorClass,
  load,
}: {
  title: string;
  scheduleHours: number[];
  colorClass: string;
  load: () => Promise<ScoredRankingEntry[]>;
}) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <Text variant="h3" as="h3">
          {title}
        </Text>
        <EventCountdown scheduleHours={scheduleHours} colorClass={colorClass} />
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <Suspense fallback={<RowsSkeleton />}>
              <EventRows load={load} />
            </Suspense>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
