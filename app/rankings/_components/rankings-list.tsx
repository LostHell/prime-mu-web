import PlayersTable from "@/app/rankings/_components/players-table";
import PodiumCard from "@/app/rankings/_components/podium-card";
import Divider from "@/components/divider";
import { Card, CardContent } from "@/components/ui/card";
import { getRankings } from "@/lib/queries/get-rankings";
import {
  getPageNumber,
  getSearchQuery,
  type SearchParams,
} from "@/lib/utils/pagination";
import { MAX_SEARCH_LENGTH } from "@/constants/pagination";
import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/characters";
import {
  getPaginationHref,
  SearchResultsPagination,
} from "@/components/search-results-pagination";
import { redirect } from "next/navigation";

const RankingsList = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const params = await searchParams;
  const page = getPageNumber(params.page);
  const query = getSearchQuery(params.query, MAX_SEARCH_LENGTH);
  const classId =
    typeof params.class === "string" &&
    Object.hasOwn(CHARACTER_CLASS_BY_ID, params.class)
      ? Number(params.class)
      : undefined;
  const [result, podium] = await Promise.all([
    getRankings({ page, query, classId }),
    getRankings({ pageSize: 3 }),
  ]);
  const [first, second, third] = podium.characters;
  const paginationSearchParams: Record<string, string> = {
    ...(query ? { query } : {}),
    ...(classId === undefined ? {} : { class: String(classId) }),
  };

  if (page > 1 && result.characters.length === 0) {
    redirect(getPaginationHref("/rankings", 1, paginationSearchParams));
  }

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
          <PlayersTable
            characters={result.characters}
            query={query}
            classId={classId}
          />
          {result.characters.length > 0 && (
            <SearchResultsPagination
              page={page}
              hasNext={result.hasNext}
              pathname="/rankings"
              searchParams={paginationSearchParams}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default RankingsList;
