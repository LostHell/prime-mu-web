import { eventSchedules } from "@/constants/events";
import { getBloodCastleRanking } from "@/lib/queries/get-blood-castle-ranking";
import { getDevilSquareRanking } from "@/lib/queries/get-devil-square-ranking";
import { EventRanking } from "./event-ranking";

export function CastleEvents() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <EventRanking
        title="Devil Square"
        scheduleHours={eventSchedules.devilSquare}
        colorClass="text-gold"
        load={getDevilSquareRanking}
      />
      <EventRanking
        title="Blood Castle"
        scheduleHours={eventSchedules.bloodCastle}
        colorClass="text-crimson"
        load={getBloodCastleRanking}
      />
    </div>
  );
}
