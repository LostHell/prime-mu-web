import { auth } from "@/auth";
import { getAccountDepositAmounts } from "@/lib/queries/get-deposits";
import { getAllActiveListings } from "@/lib/queries/get-marketplace-listings";
import { redirect } from "next/navigation";
import { MarketBrowse } from "./_components/market-browse";
import { MarketLayout } from "./_components/market-layout";
import { ResultsPagination } from "@/components/results-pagination";
import { getPageNumber, type SearchParams } from "@/lib/utils/pagination";
import { MAX_SEARCH_LENGTH } from "@/constants/pagination";

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
  const query =
    typeof params.q === "string"
      ? params.q.trim().slice(0, MAX_SEARCH_LENGTH)
      : "";
  const [result, buyerDeposits] = await Promise.all([
    getAllActiveListings(session.user.id, page, query),
    getAccountDepositAmounts(session.user.id),
  ]);

  return (
    <MarketLayout>
      <MarketBrowse
        listings={result.items}
        query={query}
        buyerDeposits={buyerDeposits}
      />
      <ResultsPagination
        page={page}
        hasNext={result.hasNext}
        pathname="/user-panel/market"
        query={query ? { q: query } : {}}
      />
    </MarketLayout>
  );
}
