import { auth } from "@/auth";
import { getMyListings } from "@/lib/queries/get-marketplace-listings";
import { redirect } from "next/navigation";
import { MarketLayout } from "../_components/market-layout";
import { MarketPagination } from "../_components/market-pagination";
import { SoldItems } from "./_components/sold-items";
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

  if (page > 1 && sales.length === 0) {
    redirect("/user-panel/market/sold");
  }

  return (
    <MarketLayout>
      <SoldItems sales={sales} />
      {sales.length > 0 && (
        <MarketPagination
          page={page}
          hasNext={result.hasNext}
          pathname="/user-panel/market/sold"
        />
      )}
    </MarketLayout>
  );
}
