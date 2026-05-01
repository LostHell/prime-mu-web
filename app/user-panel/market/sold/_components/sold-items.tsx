"use client";

import EmptyState from "@/components/empty-state";
import type { MarketListing as Listing } from "@/lib/queries/get-marketplace-listings";
import { Receipt } from "lucide-react";
import MarketListing from "../../_components/market-listing";

interface SoldItemsProps {
  sales: Listing[];
}

export function SoldItems({ sales }: SoldItemsProps) {
  if (sales.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No Sales Yet"
        description={
          <>
            You haven&apos;t sold any items yet.
            <br />
            List items for sale and wait for buyers.
          </>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          {sales.length} Item{sales.length !== 1 ? "s" : ""} Sold
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {sales.map((listing) => (
          <MarketListing
            key={listing.id}
            variant="sold"
            listing={listing}
          />
        ))}
      </div>
    </div>
  );
}
