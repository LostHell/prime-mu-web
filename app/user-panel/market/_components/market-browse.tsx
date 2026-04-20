"use client";

import { buyMarketItemAction } from "@/actions/buy-market-item";
import { MarketListing } from "@/app/user-panel/_lib/get-marketplace-listings";
import { ItemHoverCard } from "@/components/item-hover-card";
import { Input } from "@/components/ui/input";
import { CircleDollarSign, Filter, Loader2, Search, ShoppingCart, Store } from "lucide-react";
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
    <div className="rounded-xl border border-border/50 bg-card overflow-visible">
      <ItemHoverCard item={listing.item}>
        <div className="w-full p-4 flex items-center gap-4 hover:bg-muted/20 transition-colors text-left cursor-default">
          <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
            <div className={`text-xs font-medium ${listing.item.excellent > 0 ? "text-sky-400" : "text-gold"}`}>
              +{listing.item.level}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className={`font-semibold truncate ${listing.item.excellent > 0 ? "text-sky-400" : "text-gold"}`}>
              {listing.item.excellent > 0 ? "Exc " : ""}{listing.item.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              by <span className="text-foreground">{listing.sellerCharacter}</span> • {formattedDate}
              {isOwnListing && (
                <span className="ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold/20 text-gold">
                  Your listing
                </span>
              )}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 text-gold">
              <CircleDollarSign className="size-4" />
              <span className="font-bold tabular-nums">
                {listing.zenPrice?.toLocaleString() ?? "—"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
              Zen
            </p>
          </div>
        </div>
      </ItemHoverCard>

      <div className="border-t border-border/50 p-4 space-y-4">
        {state.message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              state.success
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {state.message}
          </div>
        )}

        {isOwnListing ? (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              This is your listing. Go to &quot;My Listings&quot; to cancel it.
            </p>
          </div>
        ) : (
          <form action={formAction}>
            <input type="hidden" name="listingId" value={listing.id} />

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-lg font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 bg-gold text-background hover:bg-gold/90"
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

            <p className="text-xs text-muted-foreground text-center mt-3">
              Paid from your website zen balance once deposits are enabled.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export function MarketBrowse({ listings, currentAccountId }: MarketBrowseProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <Store className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-2">No Items Listed</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
          <div className="text-center py-12">
            <Filter className="size-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No items found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          {filteredListings.length} item{filteredListings.length !== 1 ? "s" : ""} listed
          <br />
          You must be disconnected from the game to buy items.
        </p>
      </div>
    </div>
  );
}
