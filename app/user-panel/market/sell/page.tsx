import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getWarehouseItems } from "../../_lib/get-warehouse-items";
import { MarketLayout } from "../_components/market-layout";
import { SellItemForm } from "./_components/sell-item-form";

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
