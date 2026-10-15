import { CastleEvents } from "@/app/rankings/_components/castle-events";
import GuildTable from "@/app/rankings/_components/guild-table";
import PlayersTable from "@/app/rankings/_components/players-table";
import PodiumCard from "@/app/rankings/_components/podium-card";
import RankingsCta from "@/app/rankings/_components/rankings-cta";
import RankingsTabs from "@/app/rankings/_components/rankings-tabs";
import { getRankingView } from "@/app/rankings/_utils/ranking-view";
import {
  getPaginationHref,
  SearchResultsPagination,
} from "@/components/search-results-pagination";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import { MAX_SEARCH_LENGTH } from "@/constants/pagination";
import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/characters";
import { getGuildRankings } from "@/lib/queries/get-guild-rankings";
import { getOnlineCharacterNames } from "@/lib/queries/get-character-online-status";
import { getOnlineRankings } from "@/lib/queries/get-online-rankings";
import { getRankings, type RankingEntry } from "@/lib/queries/get-rankings";
import {
  getPageNumber,
  getSearchQuery,
  type SearchParams,
} from "@/lib/utils/pagination";
import { redirect } from "next/navigation";

const RankingsList = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const params = await searchParams;
  const view = getRankingView(params.view);
  const page = getPageNumber(params.page);
  const query = getSearchQuery(params.query, MAX_SEARCH_LENGTH);
  const classId =
    typeof params.class === "string" &&
    Object.hasOwn(CHARACTER_CLASS_BY_ID, params.class)
      ? Number(params.class)
      : undefined;
  const paginationSearchParams: Record<string, string> = {
    ...(view === "players" ? {} : { view }),
    ...(view === "guilds" || !query ? {} : { query }),
    ...(view === "guilds" || classId === undefined
      ? {}
      : { class: String(classId) }),
  };

  if (view === "events") {
    return (
      <div className="flex flex-col gap-10">
        <RankingsTabs view={view} />
        <CastleEvents />
        <RankingsCta />
      </div>
    );
  }

  if (view === "guilds") {
    const result = await getGuildRankings({ page });
    if (page > 1 && result.guilds.length === 0) {
      redirect(getPaginationHref("/rankings", 1, paginationSearchParams));
    }

    return (
      <div className="flex flex-col gap-10">
        <RankingsTabs view={view} />
        <section>
          <Text variant="h3" as="h2" className="mb-4">
            Guild rankings
          </Text>
          <Card>
            <CardContent>
              <GuildTable guilds={result.guilds} />
              {result.guilds.length > 0 && (
                <SearchResultsPagination
                  page={page}
                  hasNext={result.hasNext}
                  pathname="/rankings"
                  searchParams={paginationSearchParams}
                />
              )}
            </CardContent>
          </Card>
        </section>
        <RankingsCta />
      </div>
    );
  }

  if (view === "online") {
    const result = await getOnlineRankings({ page, query, classId });
    if (page > 1 && result.characters.length === 0) {
      redirect(getPaginationHref("/rankings", 1, paginationSearchParams));
    }

    return (
      <div className="flex flex-col gap-10">
        <RankingsTabs view={view} />
        <section>
          <div className="mb-4">
            <Text variant="h3" as="h2">
              Online players
            </Text>
            <Text variant="small" className="mt-1">
              Ranked by resets, then level.
            </Text>
          </div>
          <Card>
            <CardContent>
              <PlayersTable
                characters={result.characters}
                query={query}
                classId={classId}
                view={view}
                onlineNames={
                  new Set(result.characters.map((character) => character.name))
                }
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
        </section>
        <RankingsCta />
      </div>
    );
  }

  const [result, leaders] = await Promise.all([
    getRankings({ page, query, classId }),
    getRankings({ pageSize: 3 }),
  ]);
  if (page > 1 && result.characters.length === 0) {
    redirect(getPaginationHref("/rankings", 1, paginationSearchParams));
  }

  const onlineNames = await getOnlineCharacterNames(
    [...result.characters, ...leaders.characters].map(
      (character) => character.name,
    ),
  );
  const [first, second, third] = leaders.characters;

  return (
    <div className="flex flex-col gap-10">
      <RankingsTabs view={view} />
      <TopPlayers leaders={[first, second, third]} />
      <section>
        <div className="mb-4">
          <Text variant="h3" as="h2">
            Player rankings
          </Text>
          <Text variant="small" className="mt-1">
            Ranked by resets, then level.
          </Text>
        </div>
        <Card>
          <CardContent>
            <PlayersTable
              characters={result.characters}
              query={query}
              classId={classId}
              view={view}
              onlineNames={onlineNames}
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
      </section>
      <RankingsCta />
    </div>
  );
};

const TopPlayers = ({
  leaders,
}: {
  leaders: [RankingEntry?, RankingEntry?, RankingEntry?];
}) => {
  const cards = (
    [
      [1, leaders[0]],
      [2, leaders[1]],
      [3, leaders[2]],
    ] as const
  ).filter((entry): entry is readonly [1 | 2 | 3, RankingEntry] =>
    Boolean(entry[1]),
  );
  if (cards.length === 0) return null;

  return (
    <section>
      <Text variant="h3" as="h2" className="mb-4">
        Top players
      </Text>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(([position, character]) => (
          <PodiumCard
            key={position}
            position={position}
            character={character}
          />
        ))}
      </div>
    </section>
  );
};

export default RankingsList;
