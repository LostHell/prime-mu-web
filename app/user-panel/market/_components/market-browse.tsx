"use client";

import { ItemHoverCard } from "@/components/item-hover-card";
import { Input } from "@/components/ui/input";
import { buyMarketItemAction } from "@/lib/actions/buy-market-item";
import { MarketListing } from "@/lib/queries/get-marketplace-listings";
import {
  CircleDollarSign,
  Filter,
  Loader2,
  Search,
  ShoppingCart,
  Store,
} from "lucide-react";
import { useActionState, useState } from "react";

interface MarketBrowseProps {
  listings: MarketListing[];
  currentAccountId: string;
}

function BuyableListingCard({
  listing,
  isOwnListing,
}: {
  listing: MarketListing;
  isOwnListing: boolean;
}) {
  const [state, formAction, isPending] = useActionState(buyMarketItemAction, {
    success: false,
    message: "",
  });

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(listing.listedAt);

  return (
    <div className="border-border/50 bg-card overflow-visible rounded-xl border">
      <ItemHoverCard item={listing.item}>
        <div className="hover:bg-muted/20 flex w-full cursor-default items-center gap-4 p-4 text-left transition-colors">
          <div className="bg-muted/30 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
            <div
              className={`text-xs font-medium ${listing.item.excellent > 0 ? "text-sky-400" : "text-gold"}`}
            >
              +{listing.item.level}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`truncate font-semibold ${listing.item.excellent > 0 ? "text-sky-400" : "text-gold"}`}
            >
              {listing.item.excellent > 0 ? "Exc " : ""}
              {listing.item.name}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              by{" "}
              <span className="text-foreground">{listing.sellerCharacter}</span>{" "}
              • {formattedDate}
              {isOwnListing && (
                <span className="bg-gold/20 text-gold ml-2 rounded px-1.5 py-0.5 text-[10px] tracking-wider uppercase">
                  Your listing
                </span>
              )}
            </p>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className="text-gold flex items-center gap-1">
              <CircleDollarSign className="size-4" />
              <span className="font-bold tabular-nums">
                {listing.zenPrice?.toLocaleString() ?? "—"}
              </span>
            </div>
            <p className="text-muted-foreground mt-0.5 text-[10px] tracking-wider uppercase">
              Zen
            </p>
          </div>
        </div>
      </ItemHoverCard>

      <div className="border-border/50 space-y-4 border-t p-4">
        {state.message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              state.success
                ? "border border-green-500/20 bg-green-500/10 text-green-400"
                : "border border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {state.message}
          </div>
        )}

        {isOwnListing ? (
          <div className="py-2 text-center">
            <p className="text-muted-foreground text-sm">
              This is your listing. Go to &quot;My Listings&quot; to cancel it.
            </p>
          </div>
        ) : (
          <form action={formAction}>
            <input type="hidden" name="listingId" value={listing.id} />

            <button
              type="submit"
              disabled={isPending}
              className="bg-gold text-background hover:bg-gold/90 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Buying...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="size-4" />
                  <span>Buy item</span>
                </>
              )}
            </button>

            <p className="text-muted-foreground mt-3 text-center text-xs">
              Paid from your website zen balance once deposits are enabled.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export function MarketBrowse({
  listings,
  currentAccountId,
}: MarketBrowseProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (listings.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-muted/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Store className="text-muted-foreground size-8" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No Items Listed</h3>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          The marketplace is empty.
          <br />
          Be the first to list an item!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search items..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <BuyableListingCard
              key={listing.id}
              listing={listing}
              isOwnListing={listing.sellerAccountId === currentAccountId}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <Filter className="text-muted-foreground/50 mx-auto mb-3 size-12" />
            <p className="text-muted-foreground">No items found</p>
            <p className="text-muted-foreground/70 mt-1 text-sm">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>

      {/* Info */}
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
