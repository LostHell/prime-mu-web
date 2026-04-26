import EventCountdown from "@/components/event-countdown";
import { Card, CardContent } from "@/components/ui/card";
import OrnamentLine from "@/components/ui/ornament-line";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Text from "@/components/ui/text";
import { eventSchedules } from "@/constants/events";
import { getDevilSquareRanking } from "@/lib/queries/get-devil-square-ranking";
import { Suspense } from "react";

const DevilSquareRows = async () => {
  const devilSquareRanking = await getDevilSquareRanking();
  return (
    <TableBody>
      {devilSquareRanking.map((entry) => (
        <TableRow key={entry.name}>
          <TableCell className="text-gold">{entry.rank}</TableCell>
          <TableCell className="font-medium">
            {entry.name}
          </TableCell>
          <TableCell>{entry.score.toLocaleString()}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

const RowsSkeleton = () => (
  <TableBody>
    {Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
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

const DevilSquareRanking = () => {
  return (
    <Card>
      <CardContent>
        <div className="mb-2 flex items-center justify-between gap-3">
          <Text variant="h3">Devil Square</Text>
          <EventCountdown
            scheduleHours={eventSchedules.devilSquare}
            colorClass="text-gold"
          />
        </div>

        <OrnamentLine className="my-4" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <Suspense fallback={<RowsSkeleton />}>
            <DevilSquareRows />
          </Suspense>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DevilSquareRanking;
