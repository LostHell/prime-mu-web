"use client";

import { ItemHoverCard } from "@/components/item-hover-card";
import { cancelMarketplaceListingAction } from "@/lib/actions/cancel-market-listing";
import { MarketListing } from "@/lib/queries/get-marketplace-listings";
import { CircleDollarSign, Loader2, ShoppingBag, X } from "lucide-react";
import { useActionState } from "react";

interface MyListingsProps {
  listings: MarketListing[];
}

function ListingCard({ listing }: { listing: MarketListing }) {
  const [state, formAction, isPending] = useActionState(
    cancelMarketplaceListingAction,
    {
      success: false,
      message: "",
    },
  );

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
              Listed {formattedDate}
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

        <form action={formAction}>
          <input type="hidden" name="listingId" value={listing.id} />

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/50 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 disabled:opacity-50"
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
      <div className="py-12 text-center">
        <div className="bg-muted/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <ShoppingBag className="text-muted-foreground size-8" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No Active Listings</h3>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
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
        <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          {listings.length} Active Listing{listings.length !== 1 ? "s" : ""}
        </h3>
      </div>

      <div className="space-y-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      <div className="pt-4 text-center">
        <p className="text-muted-foreground text-xs">
          You must be disconnected from the game to cancel listings.
        </p>
      </div>
    </div>
  );
}
