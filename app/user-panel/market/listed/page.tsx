import { auth } from "@/auth";
import { getMyListings } from "@/lib/queries/get-marketplace-listings";
import { redirect } from "next/navigation";
import { MarketLayout } from "../_components/market-layout";
import { MarketPagination } from "../_components/market-pagination";
import { MyListings } from "./_components/my-listings";
import { getPageNumber, type SearchParams } from "@/lib/utils/pagination";

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
        <MarketPagination
          page={page}
          hasNext={result.hasNext}
          pathname="/user-panel/market/listed"
        />
      )}
    </MarketLayout>
  );
}
