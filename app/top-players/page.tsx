import TopPlayersRankings from "@/app/top-players/_components/top-players-rankings";
import PageLayout from "@/components/page-layout";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { BRAND } from "@/constants/app";
import type { SearchParams } from "@/lib/utils/pagination";

const TopPlayers = ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <PageLayout>
      <Headline className="text-center">
        <Text variant="h1">Top Players</Text>
        <Text variant="p">The mightiest warriors of {BRAND}</Text>
      </Headline>

      <TopPlayersRankings searchParams={searchParams} />
    </PageLayout>
  );
};

export default TopPlayers;
