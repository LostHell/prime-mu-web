"use client";

import { CircleDollarSign } from "lucide-react";
import { MarketLayout } from "../_components/market-layout";

export default function SoldItemsPage() {
  return (
    <MarketLayout>
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <CircleDollarSign className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-2">No Sales Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          You haven&apos;t sold any items yet.
          <br />
          Your completed sales will appear here.
        </p>
      </div>
    </MarketLayout>
  );
}
