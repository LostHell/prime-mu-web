"use client";

import { ItemCard } from "@/components/item-card";
import {
  ItemTooltip,
  ItemTooltipContent,
  ItemTooltipTrigger,
} from "@/components/item-tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { buyMarketItemAction } from "@/lib/actions/buy-market-item";
import { cancelMarketplaceListingAction } from "@/lib/actions/cancel-market-listing";
import type {
  ListingItem,
  MarketListing,
} from "@/lib/queries/get-marketplace-listings";
import { cn } from "@/lib/utils";
import { Coins, Gem, WalletCards } from "lucide-react";
import * as React from "react";
import { useActionState } from "react";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

type PriceCurrency = "zen" | "stone" | "credits";

const PRICE_ICONS = {
  zen: Coins,
  stone: Gem,
  credits: WalletCards,
} as const;

function ItemName({ item }: { item: ListingItem }) {
  const isExc = item.excellent > 0;
  const itemLevel = item.level > 0 ? `+${item.level}` : "";

  return (
    <p
      className={cn(
        "font-semibold",
        isExc ? "text-mu-tooltip-exc" : "text-gold",
      )}
    >
      {item.name} {itemLevel}
    </p>
  );
}

function Seller({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground font-medium">{children}</span>;
}

function DateText({ date }: { date: Date | null }) {
  if (date == null) {
    return <span className="tabular-nums">Unknown</span>;
  }
  return <span className="tabular-nums">{formatDate(date)}</span>;
}

function PriceLine({
  currency,
  price,
  variant = "default",
}: {
  currency: PriceCurrency;
  price: number | null;
  variant?: "default" | "spent" | "earned";
}) {
  const Icon = PRICE_ICONS[currency];
  const amountClass =
    variant === "spent"
      ? "text-destructive"
      : variant === "earned"
        ? "text-online"
        : "text-gold";

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={cn("min-w-0 flex-1 font-bold tabular-nums", amountClass)}
      >
        {variant === "spent" && price != null ? "-" : null}
        {variant === "earned" && price != null ? "+" : null}
        {price?.toLocaleString() ?? "—"}
      </span>
      <span className="text-muted-foreground shrink-0 text-xs tracking-wider uppercase">
        {currency}
      </span>
      <Icon
        className={cn(
          "size-icon-sm shrink-0",
          currency === "stone" && "text-sky-400",
          currency === "zen" && variant === "default" && "text-gold-dim",
          currency === "credits" && "text-muted-foreground",
        )}
      />
    </div>
  );
}

function PriceLines({
  lines,
  variant = "default",
}: {
  lines: Array<{ currency: PriceCurrency; amount: number | null }>;
  variant?: "default" | "spent" | "earned";
}) {
  return (
    <div className="flex flex-col gap-2">
      {lines.map((line, i) => (
        <PriceLine
          key={`${line.currency}-${i}`}
          currency={line.currency}
          price={line.amount}
          variant={variant}
        />
      ))}
    </div>
  );
}

function Buy({ listing }: { listing: MarketListing }) {
  const [state, formAction, isPending] = useActionState(buyMarketItemAction, {
    success: false,
    message: "",
  });

  return (
    <div className="flex w-full flex-col gap-2 md:max-w-xs">
      {state.message ? (
        <Alert
          variant={state.success ? "success" : "destructive"}
          className="w-full"
        >
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <form action={formAction} className="w-full">
        <input type="hidden" name="listingId" value={listing.id} />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          aria-label="Buy item"
        >
          {isPending ? "Buying…" : "Buy item"}
        </Button>
      </form>
    </div>
  );
}

function Cancel({ listing }: { listing: MarketListing }) {
  const [state, formAction, isPending] = useActionState(
    cancelMarketplaceListingAction,
    {
      success: false,
      message: "",
    },
  );

  return (
    <div className="flex w-full flex-col gap-2 md:max-w-xs">
      {state.message ? (
        <Alert
          variant={state.success ? "success" : "destructive"}
          className="w-full"
        >
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <form action={formAction} className="w-full">
        <input type="hidden" name="listingId" value={listing.id} />
        <Button
          type="submit"
          variant="destructive"
          className="w-full"
          disabled={isPending}
          aria-label="Cancel listing"
        >
          {isPending ? "Cancelling…" : "Cancel listing"}
        </Button>
      </form>
    </div>
  );
}

export type ListingVariant = "browse" | "bought" | "listed" | "sold";

export type MarketListingCardProps = {
  listing: MarketListing;
  variant: ListingVariant;
  className?: string;
  actions?: React.ReactNode;
};

function ListingMeta({
  variant,
  listing,
}: {
  variant: ListingVariant;
  listing: MarketListing;
}) {
  switch (variant) {
    case "browse":
      return (
        <div className="flex flex-col gap-2">
          <Seller>{listing.sellerCharacter}</Seller>
          <span className="text-muted-foreground text-sm">
            Listed <DateText date={listing.listedAt} />
          </span>
        </div>
      );
    case "bought":
      return (
        <div className="flex flex-col gap-2">
          <Seller>{listing.sellerCharacter}</Seller>
          <span className="text-muted-foreground text-sm">
            Bought <DateText date={listing.soldAt} />
          </span>
        </div>
      );
    case "listed":
      return (
        <div className="flex flex-col gap-2">
          <Seller>{listing.sellerCharacter}</Seller>
          <span className="text-muted-foreground text-sm">
            Active · Listed <DateText date={listing.listedAt} />
          </span>
        </div>
      );
    case "sold":
      return (
        <div className="flex flex-col gap-2">
          <Seller>{listing.sellerCharacter}</Seller>
          <span className="text-muted-foreground text-sm">
            Sold <DateText date={listing.soldAt} /> to{" "}
            <Seller>{listing.buyerCharacter ?? "another player"}</Seller>
          </span>
        </div>
      );
  }
}

function ListingPrices({
  variant,
  listing,
}: {
  variant: ListingVariant;
  listing: MarketListing;
}) {
  switch (variant) {
    case "browse":
      return (
        <PriceLines lines={[{ currency: "zen", amount: listing.zenPrice }]} />
      );
    case "bought":
      return (
        <PriceLine currency="zen" price={listing.zenPrice} variant="spent" />
      );
    case "listed":
      return <PriceLine currency="zen" price={listing.zenPrice} />;
    case "sold":
      return (
        <PriceLine currency="zen" price={listing.zenPrice} variant="earned" />
      );
  }
}

function MarketListingCard(props: MarketListingCardProps) {
  const { listing, variant, className, actions } = props;
  const item = listing.item;

  return (
    <div
      className={cn("bg-card border-border rounded-xl border p-4", className)}
    >
      <div className="flex flex-col gap-4">
        {/* Row 1: item preview + title, meta line, skill/luck tags */}
        <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
          <div className="flex flex-1 gap-3 md:gap-4">
            <div className="shrink-0">
              <ItemTooltip>
                <ItemTooltipTrigger asChild>
                  <div className="border-border/50 bg-muted relative flex size-24 shrink-0 cursor-default items-center justify-center overflow-hidden rounded-lg border md:size-30">
                    Image
                  </div>
                </ItemTooltipTrigger>
                <ItemTooltipContent>
                  <ItemCard item={item} />
                </ItemTooltipContent>
              </ItemTooltip>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <ItemName item={item} />
              <ListingMeta variant={variant} listing={listing} />
            </div>
          </div>

          {/* Row 2: price column(s) */}
          <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
            <ListingPrices variant={variant} listing={listing} />
          </div>
        </div>

        {/* Row 3 (optional): market actions — Buy, Cancel, etc. */}
        {actions && (
          <div className="border-border flex flex-col justify-end gap-2 border-t pt-4 md:shrink-0 md:flex-row md:justify-end md:border-t-0 md:pt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

const MarketListing = Object.assign(MarketListingCard, {
  Buy,
  Cancel,
});

export default MarketListing;
