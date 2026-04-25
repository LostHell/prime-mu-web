"use client";

import { ItemHoverCard } from "@/components/item-hover-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listMarketItemAction } from "@/lib/actions/list-market-item";
import { WarehouseItem } from "@/lib/queries/get-warehouse-items";
import { ArrowRight, CircleDollarSign, Loader2, Package } from "lucide-react";
import { useActionState, useState } from "react";

interface SellItemFormProps {
  warehouseItems: WarehouseItem[];
}

const WAREHOUSE_COLS = 8;
const WAREHOUSE_ROWS = 15;

function WarehouseGrid({
  items,
  selectedSlot,
  onSelectSlot,
}: {
  items: WarehouseItem[];
  selectedSlot: number | null;
  onSelectSlot: (slot: number) => void;
}) {
  return (
    <div
      className="border-border/50 bg-muted/10 relative rounded-xl border p-2"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${WAREHOUSE_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${WAREHOUSE_ROWS}, 1fr)`,
        gap: "2px",
        aspectRatio: `${WAREHOUSE_COLS} / ${WAREHOUSE_ROWS}`,
      }}
    >
      {/* Empty grid cells as background */}
      {Array.from({ length: WAREHOUSE_ROWS * WAREHOUSE_COLS }).map((_, i) => (
        <div
          key={`bg-${i}`}
          className="border-border/20 bg-muted/5 rounded-sm border"
          style={{
            gridRow: Math.floor(i / WAREHOUSE_COLS) + 1,
            gridColumn: (i % WAREHOUSE_COLS) + 1,
          }}
        />
      ))}

      {/* Items overlaid on grid */}
      {items.map((item) => {
        const startRow = Math.floor(item.slot / WAREHOUSE_COLS);
        const startCol = item.slot % WAREHOUSE_COLS;
        const isSelected = selectedSlot === item.slot;

        return (
          <ItemHoverCard
            key={item.slot}
            item={item}
            style={{
              gridRowStart: startRow + 1,
              gridRowEnd: startRow + 1 + item.height,
              gridColumnStart: startCol + 1,
              gridColumnEnd: startCol + 1 + item.width,
              position: "relative",
              zIndex: isSelected ? 10 : 5,
            }}
          >
            <button
              type="button"
              onClick={() => onSelectSlot(item.slot)}
              className={`flex h-full w-full items-center justify-center overflow-hidden rounded border p-0.5 transition-all ${
                isSelected
                  ? "border-gold bg-gold/30 ring-gold z-10 ring-2"
                  : "border-gold-dim/50 bg-card hover:border-gold/50 hover:bg-gold/10 cursor-pointer"
              } ${item.excellent > 0 ? "text-sky-400" : "text-gold/90"} `}
              title={`${item.name} +${item.level}`}
            >
              <span className="line-clamp-2 text-center text-[9px] leading-tight font-medium">
                {item.name.length > 12
                  ? item.name.split(" ").slice(0, 2).join(" ")
                  : item.name}
              </span>
            </button>
          </ItemHoverCard>
        );
      })}
    </div>
  );
}

export function SellItemForm({ warehouseItems }: SellItemFormProps) {
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
        <div className="max-w-sm">
          <WarehouseGrid
            items={warehouseItems}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />
        </div>

        <div className="max-w-sm space-y-6">
          {/* Selected Item Info */}
          <div className="border-border/50 bg-muted/20 overflow-visible rounded-xl border p-4">
            {selectedItem ? (
              <ItemHoverCard item={selectedItem}>
                <div className="-mx-1 cursor-default rounded-lg px-1 py-0.5">
                  <p className="text-muted-foreground mb-1 text-sm">
                    Selected item
                  </p>
                  <p
                    className={`font-semibold ${selectedItem.excellent > 0 ? "text-sky-400" : "text-gold"}`}
                  >
                    {selectedItem.excellent > 0 ? "Excellent " : ""}
                    {selectedItem.name} +{selectedItem.level}
                  </p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    Size: {selectedItem.width}x{selectedItem.height} • Slot #
                    {selectedItem.slot}
                  </p>
                </div>
              </ItemHoverCard>
            ) : (
              <div className="flex items-center gap-4">
                <div className="bg-muted/50 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg">
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
            <div
              className={`rounded-lg p-3 text-sm ${
                state.success
                  ? "border border-green-500/20 bg-green-500/10 text-green-400"
                  : "border border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {state.message}
            </div>
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
