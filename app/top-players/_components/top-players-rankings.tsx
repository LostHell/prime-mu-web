import PlayersTable from "@/app/top-players/_components/players-table";
import PodiumCard from "@/app/top-players/_components/podium-card";
import Divider from "@/components/divider";
import { Card, CardContent } from "@/components/ui/card";
import { getTopCharacters } from "@/lib/queries/get-top-characters";

const TopPlayersRankings = async () => {
  const allCharacters = await getTopCharacters();
  const [first, second, third] = allCharacters.slice(0, 3);

  return (
    <>
      <div className="my-3 grid grid-cols-1 gap-6 md:grid-cols-3">
        <PodiumCard
          character={second}
          position={2}
          className="order-2 md:order-1"
        />
        <PodiumCard
          character={first}
          position={1}
          className="order-1 md:order-2"
        />
        <PodiumCard
          character={third}
          position={3}
          className="order-3 md:order-3"
        />
      </div>

      <Divider />

      <Card>
        <CardContent>
          <PlayersTable characters={allCharacters} />
        </CardContent>
      </Card>
    </>
  );
};

export default TopPlayersRankings;
