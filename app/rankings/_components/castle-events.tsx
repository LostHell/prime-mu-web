import BloodCastleRanking from "@/components/blood-castle-ranking";
import DevilSquareRanking from "@/components/devil-square-ranking";

const CastleEvents = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DevilSquareRanking />
      <BloodCastleRanking />
    </div>
  );
};

export default CastleEvents;
