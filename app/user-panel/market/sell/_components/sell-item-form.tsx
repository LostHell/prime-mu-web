"use client";

import { ItemCard } from "@/components/item-card";
import { ItemIcon } from "@/components/item-icon";
import {
  ItemTooltip,
  ItemTooltipContent,
  ItemTooltipTrigger,
} from "@/components/item-tooltip";
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
import { withActionToast } from "@/hooks/use-action-toast";
import { listMarketItemAction } from "@/lib/actions/list-market-item";
import { formatItemName } from "@/lib/game/item-database/formatters";
import { type WarehouseItem } from "@/lib/types/warehouse";
import { cn } from "@/lib/utils";
import { hasAnyPositiveDepositAmounts } from "@/lib/utils/deposits";
import { clampAmount, parseAmountInput } from "@/lib/utils/numbers";
import { listingPriceLimit } from "@/lib/validation/listing-price-limits";
import { Coins, Loader2, Package } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

interface SellItemFormProps {
  warehouseItems: WarehouseItem[];
}

const emptyPriceInputs = (): Record<DepositItemType, string> =>
  Object.fromEntries(DEPOSIT_ITEM_TYPES.map((type) => [type, ""])) as Record<
    DepositItemType,
    string
  >;

const selectionIconFrameClass =
  "border-border/50 bg-muted/50 flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border";

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

  const [listState, formAction, isPending] = useActionState(
    withActionToast(listMarketItemAction),
    {
      success: false,
      message: "",
    },
  );

  useEffect(() => {
    if (!listState.success) return;
    setSelectedSlot(null);
    setPriceInputs(emptyPriceInputs());
  }, [listState]);

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

  const sectionHeadingClass =
    "text-muted-foreground text-sm font-medium tracking-wider uppercase";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h3 className={sectionHeadingClass}>Select Item from Warehouse</h3>
        <WarehouseGrid
          warehouseItems={warehouseItems}
          selectedSlot={selectedItem?.slot ?? null}
          onSelectSlot={setSelectedSlot}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className={sectionHeadingClass}>Set Price</h3>
        <div className="flex flex-col gap-5">
          <div className="border-border/50 bg-muted/20 relative overflow-visible rounded-xl border p-4">
            <div
              className={cn(
                "flex flex-col gap-4",
                !selectedItem && "pointer-events-none select-none",
              )}
            >
              <div className="flex min-h-16 items-center gap-4">
                {selectedItem ? (
                  <ItemTooltip>
                    <ItemTooltipTrigger asChild>
                      <div className="flex min-h-16 min-w-0 flex-1 cursor-default gap-4">
                        <div className={selectionIconFrameClass}>
                          <ItemIcon
                            group={selectedItem.group}
                            index={selectedItem.index}
                            level={selectedItem.level}
                            className="size-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "mt-1 min-h-5 truncate text-sm leading-5 font-semibold",
                              selectedItem.excellent > 0
                                ? "text-mu-tooltip-exc"
                                : "text-gold",
                            )}
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
                          <p className="text-muted-foreground text-sm leading-5">
                            Selected item
                          </p>
                        </div>
                      </div>
                    </ItemTooltipTrigger>
                    <ItemTooltipContent>
                      <ItemCard item={selectedItem} />
                    </ItemTooltipContent>
                  </ItemTooltip>
                ) : (
                  <>
                    <div className={selectionIconFrameClass}>
                      <Package className="text-muted-foreground/50 size-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground text-sm leading-5">
                        No item selected
                      </p>
                      <p className="text-muted-foreground/70 mt-1 min-h-5 text-xs leading-5">
                        Click on an item in your warehouse to select it
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {DEPOSIT_ITEM_TYPES.map((type) => {
                  const config = DEPOSITABLE_ITEMS[type];
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-2"
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
                        disabled={!selectedItem}
                        className="h-10 text-right tabular-nums"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {!selectedItem && (
              <div
                className="bg-background/45 absolute inset-0 z-10 rounded-xl"
                aria-hidden
              />
            )}
          </div>

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

            <Button disabled={!canSubmit || isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Listing...</span>
                </>
              ) : (
                <span>List for sale</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
