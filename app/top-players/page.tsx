import TopPlayersRankings from "@/app/top-players/_components/top-players-rankings";
import PageLayout from "@/components/page-layout";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { BRAND } from "@/constants/app";

const TopPlayers = () => {
  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-4">
        <Headline className="text-center">
          <Text variant="h1">Top Players</Text>
          <Text variant="p">The mightiest warriors of {BRAND}</Text>
        </Headline>

        <TopPlayersRankings />
      </div>
    </PageLayout>
  );
};

export default TopPlayers;
