import PlayersTable from "@/app/top-players/_components/players-table";
import PodiumCard from "@/app/top-players/_components/podium-card";
import Divider from "@/components/divider";
import { Card, CardContent } from "@/components/ui/card";
import { getTopCharacters } from "@/lib/queries/get-top-characters";
import { getPageNumber, type SearchParams } from "@/lib/utils/pagination";
import { MAX_SEARCH_LENGTH } from "@/constants/pagination";
import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/characters";
import { ResultsPagination } from "@/components/results-pagination";

const TopPlayersRankings = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const params = await searchParams;
  const page = getPageNumber(params.page);
  const query =
    typeof params.q === "string"
      ? params.q.trim().slice(0, MAX_SEARCH_LENGTH)
      : "";
  const classId =
    typeof params.class === "string" &&
    Object.hasOwn(CHARACTER_CLASS_BY_ID, params.class)
      ? Number(params.class)
      : undefined;
  const [result, podium] = await Promise.all([
    getTopCharacters({ page, query, classId }),
    getTopCharacters({ pageSize: 3 }),
  ]);
  const [first, second, third] = podium.characters;

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
          <ResultsPagination
            page={page}
            hasNext={result.hasNext}
            pathname="/top-players"
            query={{
              ...(query ? { q: query } : {}),
              ...(classId === undefined ? {} : { class: String(classId) }),
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default TopPlayersRankings;
