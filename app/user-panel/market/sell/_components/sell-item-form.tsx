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
      className="relative rounded-xl border border-border/50 bg-muted/10 p-2"
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
          className="border border-border/20 bg-muted/5 rounded-sm"
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
              className={`
                h-full w-full rounded border transition-all overflow-hidden flex items-center justify-center p-0.5
                ${isSelected
                  ? "border-gold bg-gold/30 ring-2 ring-gold z-10"
                  : "border-gold-dim/50 bg-card hover:border-gold/50 hover:bg-gold/10 cursor-pointer"
                }
                ${item.excellent > 0 ? "text-sky-400" : "text-gold/90"}
              `}
              title={`${item.name} +${item.level}`}
            >
              <span className="text-[9px] font-medium leading-tight text-center line-clamp-2">
                {item.name.length > 12 ? item.name.split(" ").slice(0, 2).join(" ") : item.name}
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

  const selectedItem = selectedSlot !== null
    ? warehouseItems.find((item) => item.slot === selectedSlot)
    : null;

  const canSubmit = selectedItem && zenPrice && parseInt(zenPrice) > 0;

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Select Item from Warehouse ({warehouseItems.length} items)
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
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
          <div className="rounded-xl border border-border/50 p-4 bg-muted/20 overflow-visible">
            {selectedItem ? (
              <ItemHoverCard item={selectedItem}>
                <div className="cursor-default rounded-lg px-1 py-0.5 -mx-1">
                  <p className="text-sm text-muted-foreground mb-1">Selected item</p>
                  <p className={`font-semibold ${selectedItem.excellent > 0 ? "text-sky-400" : "text-gold"}`}>
                    {selectedItem.excellent > 0 ? "Excellent " : ""}{selectedItem.name} +{selectedItem.level}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Size: {selectedItem.width}x{selectedItem.height} • Slot #{selectedItem.slot}
                  </p>
                </div>
              </ItemHoverCard>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                  <Package className="size-8 text-muted-foreground/50" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">No item selected</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Click on an item in your warehouse to select it
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Price Input */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Set Price
            </h3>
            <div className="rounded-xl border border-border/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CircleDollarSign className="size-4 text-gold" />
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
              className={`rounded-lg p-3 text-sm ${state.success
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
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
            <p className="text-xs text-muted-foreground">
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
