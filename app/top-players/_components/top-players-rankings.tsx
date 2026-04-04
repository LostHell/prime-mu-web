import PlayersTable from "@/app/top-players/_components/players-table";
import PodiumCard from "@/app/top-players/_components/podium-card";
import { getTopPlayers } from "@/app/top-players/_lib/get-top-players";
import Divider from "@/components/divider";

const TopPlayersRankings = async () => {
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

export default TopPlayersRankings;
