import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMyPurchases } from "../../_lib/get-marketplace-listings";
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
