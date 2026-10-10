import RankingsList from "@/app/rankings/_components/rankings-list";
import PageLayout from "@/components/page-layout";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { BRAND } from "@/constants/app";
import type { SearchParams } from "@/lib/utils/pagination";

const Rankings = ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <PageLayout>
      <Headline className="text-center">
        <Text variant="h1">Rankings</Text>
        <Text variant="p">The mightiest warriors of {BRAND}</Text>
      </Headline>

      <RankingsList searchParams={searchParams} />
    </PageLayout>
  );
};

export default Rankings;
