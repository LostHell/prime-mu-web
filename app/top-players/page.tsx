import TopPlayersRankings from "@/app/top-players/_components/top-players-rankings";
import { BRAND } from "@/constants/app";

const TopPlayers = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-48 pb-16">
      <div className="text-center mb-12 animate-fade-up">
        <h1 className="font-serif text-4xl md:text-5xl font-bold gold-gradient-text mb-4">Top Players</h1>
        <p className="text-muted-foreground text-lg">The mightiest warriors of {BRAND}</p>
      </div>

      <TopPlayersRankings />
    </div>
  );
};

export default TopPlayers;
