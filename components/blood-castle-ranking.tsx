import EventCountdown from "@/components/event-countdown";
import OrnamentLine from "@/components/ui/ornament-line";
import { eventSchedules } from "@/constants/events";
import { getBloodCastleRanking } from "@/lib/queries/get-blood-castle-ranking";
import { cn } from "@/lib/utils";
import { CLASS_TEXT_COLOR } from "@/types/character";
import { Shield } from "lucide-react";
import { Suspense } from "react";

const BloodCastleRows = async () => {
  const bloodCastleRanking = await getBloodCastleRanking();

  return (
    <tbody>
      {bloodCastleRanking.map((entry) => (
        <tr key={entry.name} className="border-b border-border/50 table-row-hover">
          <td className="table-body-cell text-gold">{entry.rank}</td>
          <td className={cn("table-body-cell font-medium", CLASS_TEXT_COLOR[entry.class])}>{entry.name}</td>
          <td className="table-body-cell">{entry.score.toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  );
};

const RowsSkeleton = () => (
  <tbody>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="border-b border-border/50">
        <td className="table-body-cell">
          <div className="h-4 w-6 bg-muted animate-pulse rounded" />
        </td>
        <td className="table-body-cell">
          <div className="h-4 w-28 bg-muted animate-pulse rounded" />
        </td>
        <td className="table-body-cell">
          <div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" />
        </td>
      </tr>
    ))}
  </tbody>
);

const BloodCastleRanking = () => {
  return (
    <div className="card-dark p-6 card-hover">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="w-6 h-6 text-crimson" />
        <h3 className="section-title">Blood Castle</h3>
      </div>
      <div className="flex justify-end mb-4">
        <EventCountdown scheduleHours={eventSchedules.bloodCastle} colorClass="text-crimson" />
      </div>
      <OrnamentLine className="mb-4" />
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
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
