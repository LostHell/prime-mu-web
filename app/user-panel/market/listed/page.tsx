import { auth } from "@/auth";
import { SearchResultsPagination } from "@/components/search-results-pagination";
import { getMyListings } from "@/lib/queries/get-marketplace-listings";
import { getPageNumber, type SearchParams } from "@/lib/utils/pagination";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MarketLayout } from "../_components/market-layout";
import { MyListings } from "./_components/my-listings";

export const metadata: Metadata = {
  title: "My listings",
};

export default async function ListedItemsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const page = getPageNumber((await searchParams).page);
  const result = await getMyListings(session.user.id, "active", page);
  const listings = result.items;

  if (page > 1 && listings.length === 0) {
    redirect("/user-panel/market/listed");
  }

  return (
    <MarketLayout>
      <MyListings listings={listings} />
      {listings.length > 0 && (
        <SearchResultsPagination
          page={page}
          hasNext={result.hasNext}
          pathname="/user-panel/market/listed"
        />
      )}
    </MarketLayout>
  );
}
