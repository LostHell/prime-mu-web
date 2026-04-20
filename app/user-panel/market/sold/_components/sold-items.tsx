"use client";

import { MarketListing } from "@/app/user-panel/_lib/get-marketplace-listings";
import { ItemHoverCard } from "@/components/item-hover-card";
import { CircleDollarSign, Receipt } from "lucide-react";

interface SoldItemsProps {
  listings: MarketListing[];
}

function SoldItemCard({ listing }: { listing: MarketListing }) {
  const soldDate = listing.soldAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(listing.soldAt)
    : "Unknown";

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-visible">
      <ItemHoverCard item={listing.item}>
        <div className="w-full p-4 flex items-center gap-4 hover:bg-muted/20 transition-colors text-left cursor-default">
          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
            <Receipt className="size-5 text-green-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className={`font-semibold truncate ${listing.item.excellent > 0 ? "text-sky-400" : "text-gold"}`}>
              {listing.item.excellent > 0 ? "Exc " : ""}{listing.item.name} +{listing.item.level}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sold {soldDate}
            {listing.buyerCharacter ? (
              <> to <span className="text-foreground">{listing.buyerCharacter}</span></>
            ) : (
              <> to <span className="text-foreground">another player</span></>
            )}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-green-400">
              <CircleDollarSign className="size-4" />
              <span className="font-bold tabular-nums">
                +{listing.zenPrice?.toLocaleString() ?? "—"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
              Zen received
            </p>
          </div>
        </div>
      </ItemHoverCard>
    </div>
  );
}

export function SoldItems({ listings }: SoldItemsProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <Receipt className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-2">No Sales Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          You haven&apos;t sold any items yet.
          <br />
          List items for sale and wait for buyers.
        </p>
      </div>
    );
  }

  const totalEarned = listings.reduce((sum, l) => sum + (l.zenPrice ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {listings.length} Item{listings.length !== 1 ? "s" : ""} Sold
        </h3>
        <div className="flex items-center gap-1 text-green-400">
          <CircleDollarSign className="size-4" />
          <span className="font-bold tabular-nums">{totalEarned.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground ml-1">total earned</span>
        </div>
      </div>

      <div className="space-y-3">
        {listings.map((listing) => (
          <SoldItemCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
