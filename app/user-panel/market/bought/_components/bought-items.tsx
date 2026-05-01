"use client";

import EmptyState from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <Card>
      <Tooltip>
        <TooltipTrigger asChild>
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
                <span className="text-foreground">
                  {listing.sellerCharacter}
                </span>
              </p>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-destructive flex items-center gap-1">
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
        </TooltipTrigger>
        <TooltipContent className="bg-transparent p-0 shadow-none">
          <ItemCard item={listing.item} />
        </TooltipContent>
      </Tooltip>
    </Card>
  );
}

export function BoughtItems({ purchases }: BoughtItemsProps) {
  if (purchases.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No Purchases Yet"
        description={
          <>
            You haven&apos;t bought any items yet.
            <br />
            Browse the market to find items.
          </>
        }
      />
    );
  }

  const totalSpent = purchases.reduce((sum, l) => sum + (l.zenPrice ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          {purchases.length} Item{purchases.length !== 1 ? "s" : ""} Purchased
        </h3>
        <div className="text-destructive flex items-center gap-1">
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
