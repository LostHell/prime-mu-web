"use client";

import EmptyState from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { MAX_SEARCH_LENGTH } from "@/constants/pagination";
import { type DepositAmounts } from "@/constants/depositable-items";
import { MarketListing as ListingRow } from "@/lib/queries/get-marketplace-listings";
import { Filter } from "lucide-react";
import Form from "next/form";
import MarketListing from "./market-listing";

interface MarketBrowseProps {
  listings: ListingRow[];
  total: number;
  query: string;
  buyerDeposits: DepositAmounts;
}

export function MarketBrowse({
  listings,
  total,
  query,
  buyerDeposits,
}: MarketBrowseProps) {
  return (
    <div className="flex flex-col gap-5">
      <Form
        action="/user-panel/market"
        scroll={false}
        className="flex items-end gap-3"
      >
        <Field>
          <FieldLabel htmlFor="market-search">Search all listings</FieldLabel>
          <Input
            key={query}
            id="market-search"
            name="query"
            defaultValue={query}
            maxLength={MAX_SEARCH_LENGTH}
            placeholder="Item name"
          />
        </Field>
        <Button type="submit">Search</Button>
      </Form>

      <p className="text-muted-foreground -mt-2 text-xs">
        {total} item{total === 1 ? "" : "s"} found
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
