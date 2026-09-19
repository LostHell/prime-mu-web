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
import { Input } from "@/components/ui/input";
import { WarehouseGrid } from "@/components/warehouse-grid";
import {
  DEPOSIT_ITEM_TYPES,
  DEPOSITABLE_ITEMS,
  EMPTY_DEPOSIT_AMOUNTS,
  type DepositAmounts,
  type DepositItemType,
} from "@/constants/depositable-items";
import { listMarketItemAction } from "@/lib/actions/list-market-item";
import { formatItemName } from "@/lib/game/item-database/formatters";
import { type WarehouseItem } from "@/lib/types/warehouse";
import { hasAnyPositiveDepositAmounts } from "@/lib/utils/deposits";
import { clampAmount, parseAmountInput } from "@/lib/utils/numbers";
import { listingPriceLimit } from "@/lib/validation/listing-price-limits";
import { Coins, Loader2, Package } from "lucide-react";
import { useActionState, useState } from "react";

interface SellItemFormProps {
  warehouseItems: WarehouseItem[];
}

const emptyPriceInputs = (): Record<DepositItemType, string> =>
  Object.fromEntries(DEPOSIT_ITEM_TYPES.map((type) => [type, ""])) as Record<
    DepositItemType,
    string
  >;

const toListingPrices = (
  inputs: Record<DepositItemType, string>,
): DepositAmounts => {
  const prices = { ...EMPTY_DEPOSIT_AMOUNTS };
  for (const type of DEPOSIT_ITEM_TYPES) {
    prices[type] = Number(inputs[type] || 0);
  }
  return prices;
};

export function SellItemForm({ warehouseItems }: SellItemFormProps) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [priceInputs, setPriceInputs] = useState(emptyPriceInputs);

  const [state, formAction, isPending] = useActionState(listMarketItemAction, {
    success: false,
    message: "",
  });

  const selectedItem =
    selectedSlot !== null
      ? (warehouseItems.find((item) => item.slot === selectedSlot) ?? null)
      : null;

  const canSubmit =
    Boolean(selectedItem) &&
    hasAnyPositiveDepositAmounts(toListingPrices(priceInputs));

  const setPrice = (type: DepositItemType, value: string) => {
    const parsed = parseAmountInput(value);
    if (parsed === null) return;
    const amount = clampAmount(parsed, 0, listingPriceLimit(type));
    setPriceInputs((current) => ({
      ...current,
      [type]: amount === 0 ? "" : String(amount),
    }));
  };

  return (
    <div>
      <h3 className="text-muted-foreground mb-4 text-sm font-medium tracking-wider uppercase">
        Select Item from Warehouse ({warehouseItems.length} items)
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <WarehouseGrid
            warehouseItems={warehouseItems}
            selectedSlot={selectedItem?.slot ?? null}
            onSelectSlot={setSelectedSlot}
          />
        </div>

        <div className="space-y-6">
          <div className="border-border/50 bg-muted/20 overflow-visible rounded-xl border p-4">
            {selectedItem ? (
              <ItemTooltip>
                <ItemTooltipTrigger asChild>
                  <div className="-mx-1 flex cursor-default items-start gap-3 rounded-lg px-1 py-0.5">
                    <div className="border-border/50 bg-muted/50 flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
                      <ItemIcon
                        group={selectedItem.group}
                        index={selectedItem.index}
                        level={selectedItem.level}
                        className="size-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground mb-1 text-sm">
                        Selected item
                      </p>
                      <p
                        className={`font-semibold ${selectedItem.excellent > 0 ? "text-mu-tooltip-exc" : "text-gold"}`}
                      >
                        {formatItemName({
                          item: {
                            name: selectedItem.name,
                            group: selectedItem.group,
                            index: selectedItem.index,
                            level: selectedItem.level,
                            excellent: selectedItem.excellent,
                          },
                        })}
                      </p>
                    </div>
                  </div>
                </ItemTooltipTrigger>
                <ItemTooltipContent>
                  <ItemCard item={selectedItem} />
                </ItemTooltipContent>
              </ItemTooltip>
            ) : (
              <div className="flex items-center gap-4">
                <div className="bg-muted/50 flex h-16 w-16 shrink-0 items-center justify-center rounded-lg">
                  <Package className="text-muted-foreground/50 size-8" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    No item selected
                  </p>
                  <p className="text-muted-foreground/70 mt-1 text-xs">
                    Click on an item in your warehouse to select it
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-muted-foreground mb-3 text-sm font-medium tracking-wider uppercase">
              Set Price
            </h3>
            <p className="text-muted-foreground mb-3 text-xs">
              Paid from the buyer&apos;s deposits. You can mix currencies.
            </p>
            <div className="border-border/50 flex flex-col gap-3 rounded-xl border p-4">
              {DEPOSIT_ITEM_TYPES.map((type) => {
                const config = DEPOSITABLE_ITEMS[type];
                return (
                  <label
                    key={type}
                    className="flex items-center gap-3"
                    htmlFor={`price-${type}`}
                  >
                    {config.icon ? (
                      <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden">
                        <ItemIcon
                          group={config.icon.group}
                          index={config.icon.index}
                          className="size-full"
                        />
                      </div>
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center">
                        <Coins className="text-gold-dim size-5" />
                      </div>
                    )}
                    <span className="w-32 shrink-0 text-sm font-medium">
                      {config.label}
                    </span>
                    <Input
                      id={`price-${type}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="0"
                      value={priceInputs[type]}
                      onChange={(event) => setPrice(type, event.target.value)}
                      className="h-10 text-right tabular-nums"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {state.message && (
            <Alert variant={state.success ? "success" : "destructive"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <form action={formAction}>
            <input
              type="hidden"
              name="slotIndex"
              value={selectedItem?.slot ?? ""}
            />
            {DEPOSIT_ITEM_TYPES.map((type) => (
              <input
                key={type}
                type="hidden"
                name={type}
                value={priceInputs[type]}
              />
            ))}

            <Button
              disabled={!canSubmit || isPending}
              className="w-full font-sans"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Listing...</span>
                </>
              ) : (
                <span>List for Sale</span>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-muted-foreground text-xs">
              Items are listed from your account warehouse.
              <br />
              You must be disconnected from the game to list items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
