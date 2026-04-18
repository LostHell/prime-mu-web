"use client";

import { ShoppingBag } from "lucide-react";
import { MarketLayout } from "../_components/market-layout";

export default function ListedItemsPage() {
  return (
    <MarketLayout>
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-2">No Active Listings</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          You don&apos;t have any items listed for sale.
          <br />
          Go to &quot;Sell Item&quot; to list your first item.
        </p>
      </div>
    </MarketLayout>
  );
}
