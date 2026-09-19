import { auth } from "@/auth";
import { getAccountDepositAmounts } from "@/lib/queries/get-deposits";
import { getAllActiveListings } from "@/lib/queries/get-marketplace-listings";
import { redirect } from "next/navigation";
import { MarketBrowse } from "./_components/market-browse";
import { MarketLayout } from "./_components/market-layout";

export default async function MarketPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [listings, buyerDeposits] = await Promise.all([
    getAllActiveListings(),
    getAccountDepositAmounts(session.user.id),
  ]);

  return (
    <MarketLayout>
      <MarketBrowse
        listings={listings}
        currentAccountId={session.user.id}
        buyerDeposits={buyerDeposits}
      />
    </MarketLayout>
  );
}
