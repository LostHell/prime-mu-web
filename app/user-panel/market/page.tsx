import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllActiveListings } from "../_lib/get-marketplace-listings";
import { MarketLayout } from "./_components/market-layout";
import { MarketBrowse } from "./_components/market-browse";

export default async function MarketPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const listings = await getAllActiveListings();

  return (
    <MarketLayout>
      <MarketBrowse listings={listings} currentAccountId={session.user.id} />
    </MarketLayout>
  );
}
