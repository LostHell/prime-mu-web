import { getDevilSquareRanking } from "@/app/_lib/get-devil-square-ranking";
import EventCountdown from "@/components/event-countdown";
import { eventSchedules } from "@/lib/mock-data";
import { CLASS_TEXT_COLOR } from "@/lib/types/character";
import { cn } from "@/lib/utils";
import { Skull } from "lucide-react";

const DevilSquareRanking = async () => {
  const devilSquareRanking = await getDevilSquareRanking();

  return (
    <div className="card-dark p-6 card-hover">
      <div className="flex items-center gap-3 mb-2">
        <Skull className="w-6 h-6 text-gold" />
        <h3 className="section-title">Devil Square</h3>
      </div>
      <div className="flex justify-end mb-4">
        <EventCountdown scheduleHours={eventSchedules.devilSquare} colorClass="text-gold" />
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
          {devilSquareRanking.map((entry) => (
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

export default DevilSquareRanking;
