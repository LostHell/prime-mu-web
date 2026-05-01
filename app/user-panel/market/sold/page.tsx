import { auth } from "@/auth";
import { getMyListings } from "@/lib/queries/get-marketplace-listings";
import { redirect } from "next/navigation";
import { MarketLayout } from "../_components/market-layout";
import { SoldItems } from "./_components/sold-items";

export default async function SoldItemsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const sales = await getMyListings(session.user.id, "sold");

  return (
    <MarketLayout>
      <SoldItems sales={sales} />
    </MarketLayout>
  );
}
