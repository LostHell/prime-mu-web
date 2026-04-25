import EventCountdown from "@/components/event-countdown";
import OrnamentLine from "@/components/ui/ornament-line";
import { eventSchedules } from "@/constants/events";
import { getBloodCastleRanking } from "@/lib/queries/get-blood-castle-ranking";
import { CLASS_TEXT_COLOR } from "@/lib/types/character";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { Suspense } from "react";

const BloodCastleRows = async () => {
  const bloodCastleRanking = await getBloodCastleRanking();

  return (
    <tbody>
      {bloodCastleRanking.map((entry) => (
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

const BloodCastleRanking = () => {
  return (
    <div className="card-dark card-hover p-6">
      <div className="mb-2 flex items-center gap-3">
        <Shield className="text-crimson h-6 w-6" />
        <h3 className="section-title">Blood Castle</h3>
      </div>
      <div className="mb-4 flex justify-end">
        <EventCountdown
          scheduleHours={eventSchedules.bloodCastle}
          colorClass="text-crimson"
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
          <BloodCastleRows />
        </Suspense>
      </table>
    </div>
  );
};

export default BloodCastleRanking;
