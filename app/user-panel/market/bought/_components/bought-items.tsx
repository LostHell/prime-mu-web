"use client";

import EmptyState from "@/components/empty-state";
import type { MarketListing as Listing } from "@/lib/queries/get-marketplace-listings";
import { Package } from "lucide-react";
import MarketListing from "../../_components/market-listing";

interface BoughtItemsProps {
  purchases: Listing[];
}

export function BoughtItems({ purchases }: BoughtItemsProps) {
  if (purchases.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No Purchases Yet"
        description={
          <>
            You haven&apos;t bought any items yet.
            <br />
            Browse the market to find items.
          </>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          {purchases.length} Item{purchases.length !== 1 ? "s" : ""} Purchased
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {purchases.map((listing) => (
          <MarketListing
            key={listing.id}
            variant="bought"
            listing={listing}
          />
        ))}
      </div>
    </div>
  );
}
