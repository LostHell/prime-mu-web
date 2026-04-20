import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMyListings } from "../../_lib/get-marketplace-listings";
import { MarketLayout } from "../_components/market-layout";
import { MyListings } from "./_components/my-listings";

export default async function ListedItemsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const listings = await getMyListings(session.user.id, "active");

  return (
    <MarketLayout>
      <MyListings listings={listings} />
    </MarketLayout>
  );
}
