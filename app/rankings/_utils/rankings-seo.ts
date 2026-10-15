import { getRankingView, type RankingView } from "./ranking-view";
import { BRAND } from "@/constants/app";
import { MAX_SEARCH_LENGTH } from "@/constants/pagination";
import { getPageNumber, getSearchQuery } from "@/lib/utils/pagination";
import type { Metadata } from "next";

const RANKING_PAGES: Record<
  RankingView,
  { title: string; description: string }
> = {
  players: {
    title: "Player rankings",
    description: `Player rankings on ${BRAND}, ordered by resets and level.`,
  },
  guilds: {
    title: "Guild rankings",
    description: `Guild rankings on ${BRAND}.`,
  },
  online: {
    title: "Online players",
    description: `Characters online now on ${BRAND}.`,
  },
  events: {
    title: "Event rankings",
    description: `Blood Castle and Devil Square rankings on ${BRAND}.`,
  },
};

const rankingsCanonical = (view: RankingView, page: number) => {
  const search = new URLSearchParams();
  if (view !== "players") search.set("view", view);
  // Events is one page. A page number there does not change the content.
  if (view !== "events" && page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `/rankings?${query}` : "/rankings";
};

const hasFilteredParams = (
  params: Record<string, string | string[] | undefined>,
) => {
  const classValue = Array.isArray(params.class)
    ? params.class[0]
    : params.class;
  return (
    getSearchQuery(params.query, MAX_SEARCH_LENGTH).length > 0 ||
    (typeof classValue === "string" && classValue.trim().length > 0)
  );
};

export const getRankingsSeo = (
  params: Record<string, string | string[] | undefined>,
) => {
  const view = getRankingView(params.view);
  const page = RANKING_PAGES[view];
  const metadata: Metadata = {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: rankingsCanonical(view, getPageNumber(params.page)),
    },
  };

  if (hasFilteredParams(params)) {
    metadata.robots = { index: false, follow: true };
  }

  return { title: page.title, metadata };
};
