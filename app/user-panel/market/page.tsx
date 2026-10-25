import { auth } from "@/auth";
import {
  getPaginationHref,
  SearchResultsPagination,
} from "@/components/search-results-pagination";
import { MAX_SEARCH_LENGTH } from "@/constants/pagination";
import { getAccountDepositAmounts } from "@/lib/queries/get-deposits";
import { getAllActiveListings } from "@/lib/queries/get-marketplace-listings";
import {
  getPageNumber,
  getSearchQuery,
  type SearchParams,
} from "@/lib/utils/pagination";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MarketBrowse } from "./_components/market-browse";
import { MarketLayout } from "./_components/market-layout";

export const metadata: Metadata = {
  title: "Market",
};

export default async function MarketPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = getPageNumber(params.page);
  const query = getSearchQuery(params.query, MAX_SEARCH_LENGTH);
  // The name search is one count and one page. The balance waits so each read holds one connection.
  const result = await getAllActiveListings(session.user.id, page, query);
  const buyerDeposits = await getAccountDepositAmounts(session.user.id);
  const paginationQuery: Record<string, string> = query ? { query } : {};

  if (page > 1 && result.items.length === 0) {
    redirect(getPaginationHref("/user-panel/market", 1, paginationQuery));
  }

  return (
    <MarketLayout>
      <MarketBrowse
        listings={result.items}
        total={result.total}
        query={query}
        buyerDeposits={buyerDeposits}
      />
      {result.items.length > 0 && (
        <SearchResultsPagination
          page={page}
          hasNext={result.hasNext}
          pathname="/user-panel/market"
          searchParams={paginationQuery}
        />
      )}
    </MarketLayout>
  );
}
