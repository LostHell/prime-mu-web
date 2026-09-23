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

/** Renders one chip per positive currency. The caller wraps this in a
 * `flex flex-wrap` container so multiple currencies flow onto as few rows
 * as the available width allows, instead of one full-width row each. */
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

  // Zen amounts can run into the tens of millions, much wider than a jewel
  // count. Always give it its own row instead of letting it wrap in with
  // (and misalign) the other currency chips.
  const zenLine = lines.find((line) => line.type === "zen");
  const itemLines = lines.filter((line) => line.type !== "zen");

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <div className="flex flex-wrap items-center gap-1.5">
        {itemLines.map((line) => (
          <PriceLine
            key={line.type}
            type={line.type}
            amount={line.amount}
            variant={variant}
          />
        ))}
      </div>
      {zenLine && (
        <div className="flex w-full sm:justify-end">
          <PriceLine
            type={zenLine.type}
            amount={zenLine.amount}
            variant={variant}
          />
        </div>
      )}
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

export type ListingVariant = "browse" | "bought" | "listed" | "sold";

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
      className={cn(
        "bg-card border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:gap-4",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <ItemTooltip>
          <ItemTooltipTrigger asChild>
            <div className="border-border/50 bg-muted relative flex size-14 shrink-0 cursor-default items-center justify-center overflow-hidden rounded-lg border sm:size-16">
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
        <div className="flex flex-col items-stretch gap-1">
          <ItemName item={item} />
          <ListingMeta variant={variant} listing={listing} />
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5 sm:max-w-64 sm:justify-end">
        <ListingPricesForVariant variant={variant} listing={listing} />
      </div>

      {actions && <div className="flex shrink-0 justify-end">{actions}</div>}
    </div>
  );
}

const MarketListing = Object.assign(MarketListingCard, {
  Buy,
  Cancel,
});

export default MarketListing;
