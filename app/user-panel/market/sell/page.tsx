import { auth } from "@/auth";
import { getWarehouseItems } from "@/lib/queries/get-warehouse-items";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MarketLayout } from "../_components/market-layout";
import { SellItemForm } from "./_components/sell-item-form";

export const metadata: Metadata = {
  title: "Sell an item",
};

export default async function SellItemPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const warehouseItems = await getWarehouseItems(session.user.id);

  return (
    <MarketLayout>
      <SellItemForm warehouseItems={warehouseItems} />
    </MarketLayout>
  );
}
