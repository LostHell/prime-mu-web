import PlayersTable from "@/app/top-players/_components/players-table";
import PodiumCard from "@/app/top-players/_components/podium-card";
import { getTopPlayers } from "@/app/top-players/_lib/get-top-players";
import Divider from "@/components/divider";
import { Suspense } from "react";

const TopPlayersContent = async () => {
  const allPlayers = await getTopPlayers();
  const top3 = allPlayers.slice(0, 3);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PodiumCard player={top3[1]} position={2} className="order-2 md:order-1" />
        <PodiumCard player={top3[0]} position={1} className="order-1 md:order-2" />
        <PodiumCard player={top3[2]} position={3} className="order-3 md:order-3" />
      </div>

      <Divider />

      <div className="card-dark p-6 card-hover animate-fade-up [animation-delay:0.3s] fill-mode-[backwards]">
        <PlayersTable players={allPlayers} />
      </div>
    </>
  );
};

const TopPlayersContentSkeleton = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card-dark p-6 animate-pulse h-48" />
      ))}
    </div>

    <Divider />

    <div className="card-dark p-6">
      <div className="h-10 bg-muted animate-pulse rounded mb-4" />
      <div className="flex gap-2 mb-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-24 bg-muted animate-pulse rounded" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  </>
);

const TopPlayersRankings = () => (
  <Suspense fallback={<TopPlayersContentSkeleton />}>
    <TopPlayersContent />
  </Suspense>
);

export default TopPlayersRankings;
