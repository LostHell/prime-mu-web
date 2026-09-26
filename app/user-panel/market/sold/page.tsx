import { auth } from "@/auth";
import { getMyListings } from "@/lib/queries/get-marketplace-listings";
import { redirect } from "next/navigation";
import { MarketLayout } from "../_components/market-layout";
import { SoldItems } from "./_components/sold-items";

import { ResultsPagination } from "@/components/results-pagination";
import { getPageNumber, type SearchParams } from "@/lib/utils/pagination";

export default async function SoldItemsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const page = getPageNumber((await searchParams).page);
  const result = await getMyListings(session.user.id, "sold", page);
  const sales = result.items;

  return (
    <MarketLayout>
      <SoldItems sales={sales} />
      <ResultsPagination
        page={page}
        hasNext={result.hasNext}
        pathname="/user-panel/market/sold"
      />
    </MarketLayout>
  );
}
