import TopPlayersRankings from "@/app/top-players/_components/top-players-rankings";
import SuspenseFallback from "@/components/suspense-fallback";
import { BRAND } from "@/constants/app";
import { Suspense } from "react";

const TopPlayers = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-48 pb-16">
      <div className="text-center mb-12 animate-fade-up">
        <h1 className="font-serif text-4xl md:text-5xl font-bold gold-gradient-text mb-4">Top Players</h1>
        <p className="text-muted-foreground text-lg">The mightiest warriors of {BRAND}</p>
      </div>

      <Suspense fallback={<SuspenseFallback />}>
        <TopPlayersRankings />
      </Suspense>
    </div>
  );
};

export default TopPlayers;
