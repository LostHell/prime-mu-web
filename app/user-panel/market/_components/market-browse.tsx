"use client";

import EmptyState from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { MarketListing as ListingRow } from "@/lib/queries/get-marketplace-listings";
import { Filter, Search, Store } from "lucide-react";
import { useState } from "react";
import MarketListing from "./market-listing";

interface MarketBrowseProps {
  listings: ListingRow[];
  currentAccountId: string;
}

export function MarketBrowse({
  listings,
  currentAccountId,
}: MarketBrowseProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = listings.filter((listing) =>
    listing.item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (listings.length === 0) {
    return (
      <EmptyState
        icon={Store}
        title="No Items Listed"
        description={
          <>
            The marketplace is empty.
            <br />
            Be the first to list an item!
          </>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search items..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredListings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredListings.map((listing) => {
            return (
              <MarketListing
                key={listing.id}
                variant="browse"
                listing={listing}
                actions={
                  <>
                    {listing.sellerAccountId === currentAccountId && (
                      <MarketListing.Cancel listing={listing} />
                    )}
                    {listing.sellerAccountId !== currentAccountId && (
                      <MarketListing.Buy listing={listing} />
                    )}
                  </>
                }
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Filter}
          variant="compact"
          title="No items found"
          description="Try adjusting your search"
        />
      )}

      <div className="pt-2 text-center">
        <p className="text-muted-foreground text-xs">
          {filteredListings.length} item
          {filteredListings.length !== 1 ? "s" : ""} listed
          <br />
          You must be disconnected from the game to buy items.
        </p>
      </div>
    </div>
  );
}
