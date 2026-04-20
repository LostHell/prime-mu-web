"use client";

import { cancelMarketplaceListingAction } from "@/actions/cancel-market-listing";
import { MarketListing } from "@/app/user-panel/_lib/get-marketplace-listings";
import { ItemHoverCard } from "@/components/item-hover-card";
import { CircleDollarSign, Loader2, ShoppingBag, X } from "lucide-react";
import { useActionState } from "react";

interface MyListingsProps {
  listings: MarketListing[];
}

function ListingCard({ listing }: { listing: MarketListing }) {
  const [state, formAction, isPending] = useActionState(cancelMarketplaceListingAction, {
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
              Listed {formattedDate}
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

        <form action={formAction}>
          <input type="hidden" name="listingId" value={listing.id} />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Cancelling...</span>
              </>
            ) : (
              <>
                <X className="size-4" />
                <span>Cancel Listing</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export function MyListings({ listings }: MyListingsProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-2">No Active Listings</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          You don&apos;t have any items listed for sale.
          <br />
          Go to &quot;Sell Item&quot; to list your first item.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {listings.length} Active Listing{listings.length !== 1 ? "s" : ""}
        </h3>
      </div>

      <div className="space-y-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">
          You must be disconnected from the game to cancel listings.
        </p>
      </div>
    </div>
  );
}
