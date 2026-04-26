import PlayersTable from "@/app/top-players/_components/players-table";
import PodiumCard from "@/app/top-players/_components/podium-card";
import Divider from "@/components/divider";
import { Card, CardContent } from "@/components/ui/card";
import { getTopPlayers } from "@/lib/queries/get-top-players";

const TopPlayersContent = async () => {
  const allPlayers = await getTopPlayers();
  const top3 = allPlayers.slice(0, 3);

  return (
    <>
      <div className="my-3 grid grid-cols-1 gap-6 md:grid-cols-3">
        <PodiumCard
          player={top3[1]}
          position={2}
          className="order-2 md:order-1"
        />
        <PodiumCard
          player={top3[0]}
          position={1}
          className="order-1 md:order-2"
        />
        <PodiumCard
          player={top3[2]}
          position={3}
          className="order-3 md:order-3"
        />
      </div>

      <Divider />

      <Card>
        <CardContent>
          <PlayersTable players={allPlayers} />
        </CardContent>
      </Card>
    </>
  );
};

const TopPlayersRankings = () => <TopPlayersContent />;

export default TopPlayersRankings;
