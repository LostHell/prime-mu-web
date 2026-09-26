import { auth } from "@/auth";
import { getMyListings } from "@/lib/queries/get-marketplace-listings";
import { redirect } from "next/navigation";
import { MarketLayout } from "../_components/market-layout";
import { MyListings } from "./_components/my-listings";

import { ResultsPagination } from "@/components/results-pagination";
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

  return (
    <MarketLayout>
      <MyListings listings={listings} />
      <ResultsPagination
        page={page}
        hasNext={result.hasNext}
        pathname="/user-panel/market/listed"
      />
    </MarketLayout>
  );
}
