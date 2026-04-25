import EventCountdown from "@/components/event-countdown";
import OrnamentLine from "@/components/ui/ornament-line";
import { eventSchedules } from "@/constants/events";
import { getDevilSquareRanking } from "@/lib/queries/get-devil-square-ranking";
import { CLASS_TEXT_COLOR } from "@/lib/types/character";
import { cn } from "@/lib/utils";
import { Skull } from "lucide-react";
import { Suspense } from "react";

const DevilSquareRows = async () => {
  const devilSquareRanking = await getDevilSquareRanking();
  return (
    <tbody>
      {devilSquareRanking.map((entry) => (
        <tr
          key={entry.name}
          className="border-border/50 table-row-hover border-b"
        >
          <td className="table-body-cell text-gold">{entry.rank}</td>
          <td
            className={cn(
              "table-body-cell font-medium",
              CLASS_TEXT_COLOR[entry.class],
            )}
          >
            {entry.name}
          </td>
          <td className="table-body-cell">{entry.score.toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  );
};

const RowsSkeleton = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="border-border/50 border-b">
        <td className="table-body-cell">
          <div className="bg-muted h-4 w-6 animate-pulse rounded" />
        </td>
        <td className="table-body-cell">
          <div className="bg-muted h-4 w-28 animate-pulse rounded" />
        </td>
        <td className="table-body-cell">
          <div className="bg-muted ml-auto h-4 w-16 animate-pulse rounded" />
        </td>
      </tr>
    ))}
  </tbody>
);

const DevilSquareRanking = () => {
  return (
    <div className="card-dark card-hover p-6">
      <div className="mb-2 flex items-center gap-3">
        <Skull className="text-gold h-6 w-6" />
        <h3 className="section-title">Devil Square</h3>
      </div>
      <div className="mb-4 flex justify-end">
        <EventCountdown
          scheduleHours={eventSchedules.devilSquare}
          colorClass="text-gold"
        />
      </div>
      <OrnamentLine className="mb-4" />
      <table className="w-full">
        <thead>
          <tr className="border-border border-b">
            <th className="table-header-cell">#</th>
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell">Score</th>
          </tr>
        </thead>
        <Suspense fallback={<RowsSkeleton />}>
          <DevilSquareRows />
        </Suspense>
      </table>
    </div>
  );
};

export default DevilSquareRanking;
