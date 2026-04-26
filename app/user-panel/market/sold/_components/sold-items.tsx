"use client";

import EmptyState from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MarketListing } from "@/lib/queries/get-marketplace-listings";
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
    <Card>
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="hover:bg-muted/20 flex w-full cursor-default items-center gap-4 p-4 text-left transition-colors">
            <div className="bg-online/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <Receipt className="text-online size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-semibold ${listing.item.excellent > 0 ? "text-sky-400" : "text-gold"}`}
              >
                {listing.item.excellent > 0 ? "Exc " : ""}
                {listing.item.name} +{listing.item.level}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Sold {soldDate}
                {listing.buyerCharacter ? (
                  <>
                    {" "}
                    to{" "}
                    <span className="text-foreground">
                      {listing.buyerCharacter}
                    </span>
                  </>
                ) : (
                  <>
                    {" "}
                    to <span className="text-foreground">another player</span>
                  </>
                )}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-online flex items-center gap-1">
                <CircleDollarSign className="size-4" />
                <span className="font-bold tabular-nums">
                  +{listing.zenPrice?.toLocaleString() ?? "—"}
                </span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-[10px] tracking-wider uppercase">
                Zen received
              </p>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent>
          <ItemCard item={listing.item} />
        </HoverCardContent>
      </HoverCard>
    </Card>
  );
}

export function SoldItems({ listings }: SoldItemsProps) {
  if (listings.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No Sales Yet"
        description={
          <>
            You haven&apos;t sold any items yet.
            <br />
            List items for sale and wait for buyers.
          </>
        }
      />
    );
  }

  const totalEarned = listings.reduce((sum, l) => sum + (l.zenPrice ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          {listings.length} Item{listings.length !== 1 ? "s" : ""} Sold
        </h3>
        <div className="text-online flex items-center gap-1">
          <CircleDollarSign className="size-4" />
          <span className="font-bold tabular-nums">
            {totalEarned.toLocaleString()}
          </span>
          <span className="text-muted-foreground ml-1 text-xs">
            total earned
          </span>
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
