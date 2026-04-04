import { getBloodCastleRanking } from "@/app/_lib/get-blood-castle-ranking";
import EventCountdown from "@/components/event-countdown";
import { eventSchedules } from "@/lib/mock-data";
import { CLASS_TEXT_COLOR } from "@/lib/types/character";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

const BloodCastleRanking = async () => {
  const bloodCastleRanking = await getBloodCastleRanking();

  return (
    <div className="card-dark p-6 card-hover">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="w-6 h-6 text-crimson" />
        <h3 className="section-title">Blood Castle</h3>
      </div>
      <div className="flex justify-end mb-4">
        <EventCountdown scheduleHours={eventSchedules.bloodCastle} colorClass="text-crimson" />
      </div>
      <div className="ornament-line mb-4" />
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header-cell">#</th>
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {bloodCastleRanking.map((entry) => (
            <tr key={entry.name} className="border-b border-border/50 table-row-hover">
              <td className="table-body-cell text-gold">{entry.rank}</td>
              <td className={cn("table-body-cell font-medium", CLASS_TEXT_COLOR[entry.class])}>{entry.name}</td>
              <td className="table-body-cell">{entry.score.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BloodCastleRanking;
