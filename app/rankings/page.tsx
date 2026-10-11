import RankingsList from "@/app/rankings/_components/rankings-list";
import PageHero from "@/components/page-hero";
import PageLayout from "@/components/page-layout";
import { BRAND } from "@/constants/app";
import { getServerStatus } from "@/lib/queries/get-server-status";
import { formatServerLiveNote } from "@/lib/utils/dates";
import type { SearchParams } from "@/lib/utils/pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Rankings - ${BRAND}`,
  description: `Player and guild rankings on ${BRAND}.`,
};

const Rankings = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { status } = await getServerStatus();

  return (
    <>
      <PageHero
        label="Rankings"
        title="Legends are earned."
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
