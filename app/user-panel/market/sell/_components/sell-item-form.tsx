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
import { listMarketItemAction } from "@/lib/actions/list-market-item";
import { type WarehouseItem } from "@/lib/types/warehouse";
import { CircleDollarSign, Loader2, Package } from "lucide-react";
import { useActionState, useState } from "react";

interface SellItemFormProps {
  warehouseItems: WarehouseItem[];
}

export function SellItemForm({
  warehouseItems,
}: SellItemFormProps) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [zenPrice, setZenPrice] = useState("");

  const [state, formAction, isPending] = useActionState(listMarketItemAction, {
    success: false,
    message: "",
  });

  const selectedItem =
    selectedSlot !== null
      ? warehouseItems.find((item) => item.slot === selectedSlot)
      : null;

  const canSubmit = selectedItem && zenPrice && parseInt(zenPrice) > 0;

  return (
    <div>
      <h3 className="text-muted-foreground mb-4 text-sm font-medium tracking-wider uppercase">
        Select Item from Warehouse ({warehouseItems.length} items)
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Warehouse Grid */}
        <div>
          <WarehouseGrid
            warehouseItems={warehouseItems}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />
        </div>

        <div className="space-y-6">
          {/* Selected Item Info */}
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
                        {selectedItem.excellent > 0 ? "Excellent " : ""}
                        {selectedItem.name} +{selectedItem.level}
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

          {/* Price Input */}
          <div>
            <h3 className="text-muted-foreground mb-3 text-sm font-medium tracking-wider uppercase">
              Set Price
            </h3>
            <div className="border-border/50 rounded-xl border p-4">
              <div className="mb-3 flex items-center gap-2">
                <CircleDollarSign className="text-gold size-4" />
                <span className="text-sm font-medium">Zen</span>
              </div>
              <Input
                type="number"
                placeholder="0"
                value={zenPrice}
                onChange={(e) => setZenPrice(e.target.value)}
                min={1}
                max={2000000000}
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Status Messages */}
          {state.message && (
            <Alert variant={state.success ? "success" : "destructive"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {/* Submit Form */}
          <form action={formAction}>
            <input type="hidden" name="slotIndex" value={selectedSlot ?? ""} />
            <input type="hidden" name="zenPrice" value={zenPrice} />

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
                <>
                  <span>List for Sale</span>
                </>
              )}
            </Button>
          </form>

          {/* Info */}
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
