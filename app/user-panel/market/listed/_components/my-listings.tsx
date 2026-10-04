"use client";
import Text from "@/components/ui/text";

import EmptyState from "@/components/empty-state";
import type { MarketListing as Listing } from "@/lib/queries/get-marketplace-listings";
import { ShoppingBag } from "lucide-react";
import MarketListing from "../../_components/market-listing";

interface MyListingsProps {
  listings: Listing[];
}

export function MyListings({ listings }: MyListingsProps) {
  if (listings.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No Active Listings"
        description={
          <>
            You don&apos;t have any items listed for sale.
            <br />
            Go to &quot;Sell Item&quot; to list your first item.
          </>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text variant="section">
          {listings.length} Active Listing{listings.length !== 1 ? "s" : ""}
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        {listings.map((listing) => (
          <MarketListing
            key={listing.id}
            variant="listed"
            listing={listing}
            actions={<MarketListing.Cancel listing={listing} />}
          />
        ))}
      </div>
    </div>
  );
}
