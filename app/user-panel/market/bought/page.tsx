import { auth } from "@/auth";
import { SearchResultsPagination } from "@/components/search-results-pagination";
import { getMyPurchases } from "@/lib/queries/get-marketplace-listings";
import { getPageNumber, type SearchParams } from "@/lib/utils/pagination";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BoughtItems } from "./_components/bought-items";
import { MarketLayout } from "../_components/market-layout";

export const metadata: Metadata = {
  title: "Purchased items",
};

export default async function BoughtItemsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const page = getPageNumber((await searchParams).page);
  const result = await getMyPurchases(session.user.id, page);
  const purchases = result.items;

  if (page > 1 && purchases.length === 0) {
    redirect("/user-panel/market/bought");
  }

  return (
    <MarketLayout>
      <BoughtItems purchases={purchases} />
      {purchases.length > 0 && (
        <SearchResultsPagination
          page={page}
          hasNext={result.hasNext}
          pathname="/user-panel/market/bought"
        />
      )}
    </MarketLayout>
  );
}
