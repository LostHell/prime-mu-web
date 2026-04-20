import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMyListings } from "../../_lib/get-marketplace-listings";
import { MarketLayout } from "../_components/market-layout";
import { SoldItems } from "./_components/sold-items";

export default async function SoldItemsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const listings = await getMyListings(session.user.id, "sold");

  return (
    <MarketLayout>
      <SoldItems listings={listings} />
    </MarketLayout>
  );
}
