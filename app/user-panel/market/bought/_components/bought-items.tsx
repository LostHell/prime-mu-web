"use client";

import { MarketListing } from "@/app/user-panel/_lib/get-marketplace-listings";
import { ItemHoverCard } from "@/components/item-hover-card";
import { CircleDollarSign, Package } from "lucide-react";

interface BoughtItemsProps {
  purchases: MarketListing[];
}

function BoughtItemCard({ listing }: { listing: MarketListing }) {
  const boughtDate = listing.soldAt
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
          <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
            <Package className="size-5 text-gold" />
          </div>

          <div className="flex-1 min-w-0">
            <p className={`font-semibold truncate ${listing.item.excellent > 0 ? "text-sky-400" : "text-gold"}`}>
              {listing.item.excellent > 0 ? "Exc " : ""}{listing.item.name} +{listing.item.level}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Bought {boughtDate} from <span className="text-foreground">{listing.sellerCharacter}</span>
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 text-red-400">
              <CircleDollarSign className="size-4" />
              <span className="font-bold tabular-nums">
                -{listing.zenPrice?.toLocaleString() ?? "—"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
              Zen spent
            </p>
          </div>
        </div>
      </ItemHoverCard>
    </div>
  );
}

export function BoughtItems({ purchases }: BoughtItemsProps) {
  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <Package className="size-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-2">No Purchases Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          You haven&apos;t bought any items yet.
          <br />
          Browse the market to find items.
        </p>
      </div>
    );
  }

  const totalSpent = purchases.reduce((sum, l) => sum + (l.zenPrice ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {purchases.length} Item{purchases.length !== 1 ? "s" : ""} Purchased
        </h3>
        <div className="flex items-center gap-1 text-red-400">
          <CircleDollarSign className="size-4" />
          <span className="font-bold tabular-nums">{totalSpent.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground ml-1">total spent</span>
        </div>
      </div>

      <div className="space-y-3">
        {purchases.map((purchase) => (
          <BoughtItemCard key={purchase.id} listing={purchase} />
        ))}
      </div>
    </div>
  );
}
