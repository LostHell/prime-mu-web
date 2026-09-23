"use client";

import { ItemCard } from "@/components/item-card";
import { ItemIcon } from "@/components/item-icon";
import {
  ItemTooltip,
  ItemTooltipContent,
  ItemTooltipTrigger,
} from "@/components/item-tooltip";
import { Button } from "@/components/ui/button";
import { withActionToast } from "@/hooks/use-action-toast";
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
import { hasAnyPositiveDepositAmounts } from "@/lib/utils/deposits";
import { formatNumber } from "@/lib/utils/numbers";
import { Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";

export type ListingVariant = "browse" | "bought" | "listed" | "sold";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function ItemName({ item }: { item: ListingItem }) {
  const isExcellent = item.excellent > 0;

  return (
    <p
      className={cn(
        "truncate text-base font-semibold",
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

/** Compact icon + amount chip. The currency label is visually hidden (icon
 * carries the meaning) but stays available via `title` and `sr-only` text so
 * the price is still identifiable on hover and to screen readers. */
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
    <div className="flex items-center gap-0.5" title={config.label}>
      {config.icon ? (
        <div className="size-icon-sm flex shrink-0 items-center justify-center overflow-hidden">
          <ItemIcon
            group={config.icon.group}
            index={config.icon.index}
            className="size-full"
          />
        </div>
      ) : (
        <Coins className="text-gold-dim size-icon-sm shrink-0" />
      )}
      <span
        className={cn(
          "text-sm font-bold whitespace-nowrap tabular-nums",
          amountClass,
        )}
      >
        {prefix}
        {formatNumber(amount)}
        <span className="sr-only"> {config.label}</span>
      </span>
    </div>
  );
}

function listingPriceVariant(
  variant: ListingVariant,
): "default" | "spent" | "earned" {
  if (variant === "bought") return "spent";
  if (variant === "sold") return "earned";
  return "default";
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
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {lines.map((line) => (
        <div
          key={line.type}
          className={cn(line.type === "zen" && "basis-full")}
        >
          <PriceLine
            type={line.type}
            amount={line.amount}
            variant={variant}
          />
        </div>
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
  const [, formAction, isPending] = useActionState(
    withActionToast(buyMarketItemAction),
    {
      success: false,
      message: "",
    },
  );
  const router = useRouter();
  const hasPrice = hasAnyPositiveDepositAmounts(listing.prices);
  const canAfford =
    hasPrice &&
    DEPOSIT_ITEM_TYPES.every(
      (type) => buyerDeposits[type] >= listing.prices[type],
    );

  return (
    <form
      action={formAction}
      className="w-full sm:w-auto"
      onSubmit={(event) => {
        if (!hasPrice || canAfford) return;
        event.preventDefault();
        toast.error("Insufficient funds.", {
          action: {
            label: "Deposit",
            onClick: () => router.push("/user-panel/deposits"),
          },
        });
      }}
    >
      <input type="hidden" name="listingId" value={listing.id} />
      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={!hasPrice || isPending}
        aria-label="Buy item"
      >
        {isPending ? "Buying…" : "Buy item"}
      </Button>
    </form>
  );
}

function Cancel({ listing }: { listing: MarketListing }) {
  const [, formAction, isPending] = useActionState(
    withActionToast(cancelMarketplaceListingAction),
    {
      success: false,
      message: "",
    },
  );

  return (
    <form action={formAction} className="w-full sm:w-auto">
      <input type="hidden" name="listingId" value={listing.id} />
      <Button
        type="submit"
        variant="destructive"
        className="w-full sm:w-auto"
        disabled={isPending}
      >
        {isPending ? "Taking back…" : "Take back"}
      </Button>
    </form>
  );
}

export type MarketListingCardProps = {
  listing: MarketListing;
  variant: ListingVariant;
  className?: string;
  actions?: React.ReactNode;
};

/** Single-line "who / when" summary. Combines what used to be two stacked
 * lines (seller, then date) into one truncating line to keep the card row
 * short regardless of variant. */
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
        <p className="text-muted-foreground truncate text-sm">
          <Seller>{listing.sellerCharacter}</Seller> · Listed{" "}
          <DateText date={listing.listedAt} />
        </p>
      );
    case "bought":
      return (
        <p className="text-muted-foreground truncate text-sm">
          <Seller>{listing.sellerCharacter}</Seller> · Bought{" "}
          <DateText date={listing.soldAt} />
        </p>
      );
    case "listed":
      return (
        <p className="text-muted-foreground truncate text-sm">
          Active · Listed <DateText date={listing.listedAt} />
        </p>
      );
    case "sold":
      return (
        <p className="text-muted-foreground truncate text-sm">
          Sold <DateText date={listing.soldAt} /> to{" "}
          <Seller>{listing.buyerCharacter ?? "another player"}</Seller>
        </p>
      );
  }
}

function MarketListingCard(props: MarketListingCardProps) {
  const { listing, variant, className, actions } = props;
  const item = listing.item;

  return (
    <article
      className={cn(
        "@container/market-listing bg-card border-border rounded-xl border p-4",
        className,
      )}
    >
      {/*
        Layout follows card width (sidebar narrows the list, not the viewport).
        Narrow: icon + title, then prices, then action.
        Wide (@md container): icon | title + prices | action.
      */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-3 @md/market-listing:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div className="col-start-1 row-start-1 @md/market-listing:row-span-2">
          <ItemTooltip>
            <ItemTooltipTrigger asChild>
              <div className="border-border/50 bg-muted relative flex size-14 cursor-default items-center justify-center overflow-hidden rounded-lg border @md/market-listing:size-16">
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

        <div className="col-start-2 row-start-1 flex min-w-0 flex-col gap-1">
          <ItemName item={item} />
          <ListingMeta variant={variant} listing={listing} />
        </div>

        <div className="col-span-2 col-start-1 row-start-2 min-w-0 @md/market-listing:col-span-1 @md/market-listing:col-start-2 @md/market-listing:row-start-2">
          <ListingPrices
            listing={listing}
            variant={listingPriceVariant(variant)}
          />
        </div>

        {actions ? (
          <div className="col-span-2 col-start-1 row-start-3 @md/market-listing:col-span-1 @md/market-listing:col-start-3 @md/market-listing:row-start-1 @md/market-listing:row-span-2 @md/market-listing:self-center @md/market-listing:justify-self-end [&_form]:w-full @md/market-listing:[&_form]:w-auto">
            {actions}
          </div>
        ) : null}
      </div>
    </article>
  );
}

const MarketListing = Object.assign(MarketListingCard, {
  Buy,
  Cancel,
});

export default MarketListing;
