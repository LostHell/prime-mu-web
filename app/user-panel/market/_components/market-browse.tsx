"use client";

import EmptyState from "@/components/empty-state";
import { ItemCard } from "@/components/item-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
    <Card>
      <HoverCard>
        <HoverCardTrigger asChild>
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
                <span className="text-foreground">
                  {listing.sellerCharacter}
                </span>{" "}
                • {formattedDate}
                {isOwnListing && (
                  <span className="bg-gold/20 text-gold ml-2 rounded px-1.5 py-0.5 text-[10px] tracking-wider uppercase">
                    Your listing
                  </span>
                )}
              </p>
            </div>

            <div className="shrink-0 text-right">
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
        </HoverCardTrigger>
        <HoverCardContent>
          <ItemCard item={listing.item} />
        </HoverCardContent>
      </HoverCard>

      <div className="border-border/50 space-y-4 border-t p-4">
        {state.message && (
          <Alert variant={state.success ? "success" : "destructive"}>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
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

            <Button type="submit" disabled={isPending} className="w-full">
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
            </Button>

            <p className="text-muted-foreground mt-3 text-center text-xs">
              Paid from your website zen balance once deposits are enabled.
            </p>
          </form>
        )}
      </div>
    </Card>
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
      <EmptyState
        icon={Store}
        title="No Items Listed"
        description={
          <>
            The marketplace is empty.
            <br />
            Be the first to list an item!
          </>
        }
      />
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
          <EmptyState
            icon={Filter}
            variant="compact"
            title="No items found"
            description="Try adjusting your search"
          />
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
