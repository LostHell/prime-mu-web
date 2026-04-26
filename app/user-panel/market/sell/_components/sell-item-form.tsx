"use client";

import { ItemCard } from "@/components/item-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { listMarketItemAction } from "@/lib/actions/list-market-item";
import { WarehouseItem } from "@/lib/queries/get-warehouse-items";
import { CircleDollarSign, Loader2, Package } from "lucide-react";
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
          <HoverCard key={item.slot}>
            <HoverCardTrigger asChild>
              {/* design-system exception: warehouse cell mimics the in-game grid slot, not a generic <Button>. Keep the raw <button>. */}
              <button
                type="button"
                onClick={() => onSelectSlot(item.slot)}
                style={{
                  gridRowStart: startRow + 1,
                  gridRowEnd: startRow + 1 + item.height,
                  gridColumnStart: startCol + 1,
                  gridColumnEnd: startCol + 1 + item.width,
                  zIndex: isSelected ? 10 : 5,
                }}
                className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded border p-0.5 transition-all ${
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
            </HoverCardTrigger>
            <HoverCardContent>
              <ItemCard item={item} />
            </HoverCardContent>
          </HoverCard>
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
              <HoverCard>
                <HoverCardTrigger asChild>
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
                </HoverCardTrigger>
                <HoverCardContent>
                  <ItemCard item={selectedItem} />
                </HoverCardContent>
              </HoverCard>
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
