import { auth } from "@/auth";
import { getMyPurchases } from "@/lib/queries/get-marketplace-listings";
import { redirect } from "next/navigation";
import { MarketLayout } from "../_components/market-layout";
import { BoughtItems } from "./_components/bought-items";

export default async function BoughtItemsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const purchases = await getMyPurchases(session.user.id);

  return (
    <MarketLayout>
      <BoughtItems purchases={purchases} />
    </MarketLayout>
  );
}
