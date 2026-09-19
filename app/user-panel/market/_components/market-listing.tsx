"use client";

import { ItemCard } from "@/components/item-card";
import { ItemIcon } from "@/components/item-icon";
import {
  ItemTooltip,
  ItemTooltipContent,
  ItemTooltipTrigger,
} from "@/components/item-tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DEPOSIT_ITEM_TYPES,
  DEPOSITABLE_ITEMS,
  type DepositAmounts,
  type DepositItemType,
} from "@/constants/depositable-items";
import { buyMarketItemAction } from "@/lib/actions/buy-market-item";
import { cancelMarketplaceListingAction } from "@/lib/actions/cancel-market-listing";
import { formatItemName } from "@/lib/game/item-database/formatters";
import type {
  ListingItem,
  MarketListing,
} from "@/lib/queries/get-marketplace-listings";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/numbers";
import { Coins } from "lucide-react";
import Link from "next/link";
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

function ItemName({ item }: { item: ListingItem }) {
  const isExcellent = item.excellent > 0;

  return (
    <p
      className={cn(
        "font-semibold",
        isExcellent ? "text-mu-tooltip-exc" : "text-gold",
      )}
    >
      {formatItemName({
        item: {
          name: item.name,
          group: item.group,
          index: item.index,
          level: item.level,
          excellent: item.excellent,
        },
      })}
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
  type,
  amount,
  variant = "default",
}: {
  type: DepositItemType;
  amount: number;
  variant?: "default" | "spent" | "earned";
}) {
  const config = DEPOSITABLE_ITEMS[type];
  const amountClass =
    variant === "spent"
      ? "text-destructive"
      : variant === "earned"
        ? "text-online"
        : "text-gold";
  const prefix = variant === "spent" ? "-" : variant === "earned" ? "+" : "";

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={cn("min-w-0 flex-1 font-bold tabular-nums", amountClass)}
      >
        {prefix}
        {formatNumber(amount)}
      </span>
      <span className="text-muted-foreground shrink-0 text-xs tracking-wider uppercase">
        {config.label}
      </span>
      {config.icon ? (
        <div className="flex size-4 shrink-0 items-center justify-center overflow-hidden">
          <ItemIcon
            group={config.icon.group}
            index={config.icon.index}
            className="size-full"
          />
        </div>
      ) : (
        <Coins className="text-gold-dim size-icon-sm shrink-0" />
      )}
    </div>
  );
}

function ListingPrices({
  listing,
  variant = "default",
}: {
  listing: MarketListing;
  variant?: "default" | "spent" | "earned";
}) {
  const lines = DEPOSIT_ITEM_TYPES.filter(
    (type) => listing.prices[type] > 0,
  ).map((type) => ({
    type,
    amount: listing.prices[type],
  }));

  if (lines.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className="flex flex-col gap-2">
      {lines.map((line) => (
        <PriceLine
          key={line.type}
          type={line.type}
          amount={line.amount}
          variant={variant}
        />
      ))}
    </div>
  );
}

function Buy({
  listing,
  buyerDeposits,
}: {
  listing: MarketListing;
  buyerDeposits: DepositAmounts;
}) {
  const [state, formAction, isPending] = useActionState(buyMarketItemAction, {
    success: false,
    message: "",
  });
  const canAfford = DEPOSIT_ITEM_TYPES.every(
    (type) => buyerDeposits[type] >= listing.prices[type],
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

      {!canAfford && (
        <p className="text-muted-foreground text-xs">
          Not enough deposited funds.{" "}
          <Link
            href="/user-panel/deposits"
            className="text-gold hover:underline"
          >
            Deposit
          </Link>{" "}
          the required currencies first.
        </p>
      )}

      <form action={formAction} className="w-full">
        <input type="hidden" name="listingId" value={listing.id} />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !canAfford}
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

function ListingPricesForVariant({
  variant,
  listing,
}: {
  variant: ListingVariant;
  listing: MarketListing;
}) {
  switch (variant) {
    case "browse":
    case "listed":
      return <ListingPrices listing={listing} />;
    case "bought":
      return <ListingPrices listing={listing} variant="spent" />;
    case "sold":
      return <ListingPrices listing={listing} variant="earned" />;
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
        <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
          <div className="flex flex-1 gap-3 md:gap-4">
            <div className="shrink-0">
              <ItemTooltip>
                <ItemTooltipTrigger asChild>
                  <div className="border-border/50 bg-muted relative flex size-24 shrink-0 cursor-default items-center justify-center overflow-hidden rounded-lg border md:size-30">
                    <ItemIcon
                      group={item.group}
                      index={item.index}
                      level={item.level}
                      className="size-full"
                    />
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

          <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
            <ListingPricesForVariant variant={variant} listing={listing} />
          </div>
        </div>

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
