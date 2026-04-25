"use client";

import { ItemHoverCard } from "@/components/item-hover-card";
import { MarketListing } from "@/lib/queries/get-marketplace-listings";
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
    <div className="border-border/50 bg-card overflow-visible rounded-xl border">
      <ItemHoverCard item={listing.item}>
        <div className="hover:bg-muted/20 flex w-full cursor-default items-center gap-4 p-4 text-left transition-colors">
          <div className="bg-gold/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
            <Package className="text-gold size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`truncate font-semibold ${listing.item.excellent > 0 ? "text-sky-400" : "text-gold"}`}
            >
              {listing.item.excellent > 0 ? "Exc " : ""}
              {listing.item.name} +{listing.item.level}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Bought {boughtDate} from{" "}
              <span className="text-foreground">{listing.sellerCharacter}</span>
            </p>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-1 text-red-400">
              <CircleDollarSign className="size-4" />
              <span className="font-bold tabular-nums">
                -{listing.zenPrice?.toLocaleString() ?? "—"}
              </span>
            </div>
            <p className="text-muted-foreground mt-0.5 text-[10px] tracking-wider uppercase">
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
      <div className="py-12 text-center">
        <div className="bg-muted/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Package className="text-muted-foreground size-8" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No Purchases Yet</h3>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
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
        <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          {purchases.length} Item{purchases.length !== 1 ? "s" : ""} Purchased
        </h3>
        <div className="flex items-center gap-1 text-red-400">
          <CircleDollarSign className="size-4" />
          <span className="font-bold tabular-nums">
            {totalSpent.toLocaleString()}
          </span>
          <span className="text-muted-foreground ml-1 text-xs">
            total spent
          </span>
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
