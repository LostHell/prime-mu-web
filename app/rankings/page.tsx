import RankingsList from "@/app/rankings/_components/rankings-list";
import { getRankingsSeo } from "@/app/rankings/_utils/rankings-seo";
import PageHero from "@/components/page-hero";
import PageLayout from "@/components/page-layout";
import { getServerStatus } from "@/lib/queries/get-server-status";
import { formatServerLiveNote } from "@/lib/utils/dates";
import type { SearchParams } from "@/lib/utils/pagination";
import type { Metadata } from "next";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> => {
  return getRankingsSeo(await searchParams).metadata;
};

const Rankings = async ({ searchParams }: { searchParams: SearchParams }) => {
  const [params, { status }] = await Promise.all([
    searchParams,
    getServerStatus(),
  ]);
  const seo = getRankingsSeo(params);

  return (
    <>
      <PageHero
        label="Rankings"
        title={seo.title}
        description="Follow the climb. Find your rivals."
        status={status}
        statusNote={formatServerLiveNote()}
      />
      <PageLayout>
        <RankingsList searchParams={searchParams} />
      </PageLayout>
    </>
  );
};

export default Rankings;
