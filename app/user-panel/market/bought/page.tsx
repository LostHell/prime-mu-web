import { auth } from "@/auth";
import { getMyPurchases } from "@/lib/queries/get-marketplace-listings";
import { redirect } from "next/navigation";
import { MarketLayout } from "../_components/market-layout";
import { BoughtItems } from "./_components/bought-items";

import { ResultsPagination } from "@/components/results-pagination";
import { getPageNumber, type SearchParams } from "@/lib/utils/pagination";

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

  return (
    <MarketLayout>
      <BoughtItems purchases={purchases} />
      <ResultsPagination
        page={page}
        hasNext={result.hasNext}
        pathname="/user-panel/market/bought"
      />
    </MarketLayout>
  );
}
