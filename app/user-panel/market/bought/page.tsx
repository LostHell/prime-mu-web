"use client";

import { Package } from "lucide-react";
import { MarketLayout } from "../_components/market-layout";

export default function BoughtItemsPage() {
  return (
    <MarketLayout>
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <Package className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-2">No Purchases Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          You haven&apos;t purchased any items yet.
          <br />
          Browse the market to find items to buy.
        </p>
      </div>
    </MarketLayout>
  );
}
