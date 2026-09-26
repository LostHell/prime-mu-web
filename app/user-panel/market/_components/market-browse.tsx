"use client";

import EmptyState from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { MAX_SEARCH_LENGTH } from "@/constants/pagination";
import { type DepositAmounts } from "@/constants/depositable-items";
import { MarketListing as ListingRow } from "@/lib/queries/get-marketplace-listings";
import { Filter } from "lucide-react";
import MarketListing from "./market-listing";

interface MarketBrowseProps {
  listings: ListingRow[];
  query: string;
  buyerDeposits: DepositAmounts;
}

export function MarketBrowse({
  listings,
  query,
  buyerDeposits,
}: MarketBrowseProps) {
  return (
    <div className="flex flex-col gap-5">
      <form
        action="/user-panel/market"
        method="get"
        className="flex items-end gap-3"
      >
        <Field>
          <FieldLabel htmlFor="market-search">Search all listings</FieldLabel>
          <Input
            key={query}
            id="market-search"
            name="q"
            defaultValue={query}
            maxLength={MAX_SEARCH_LENGTH}
            placeholder="Item name"
          />
        </Field>
        <Button type="submit">Search</Button>
      </form>

      <p className="text-muted-foreground -mt-2 text-xs">
        {listings.length} item
        {listings.length !== 1 ? "s" : ""} on this page
      </p>

      {listings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => {
            return (
              <MarketListing
                key={listing.id}
                variant="browse"
                listing={listing}
                actions={
                  <>
                    {listing.isOwnListing && (
                      <MarketListing.Cancel listing={listing} />
                    )}
                    {!listing.isOwnListing && (
                      <MarketListing.Buy
                        listing={listing}
                        buyerDeposits={buyerDeposits}
                      />
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
          description="Try another search or return to an earlier page."
        />
      )}
    </div>
  );
}
