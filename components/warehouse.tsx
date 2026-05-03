import {
  EMPTY_SLOT_BG,
  FILLED_SLOT_BG,
  WAREHOUSE_COLS,
  WAREHOUSE_ROWS,
  WAREHOUSE_SLOTS,
} from "@/lib/game/constants/warehouse";
import { getOccupiedSlots } from "@/lib/game/warehouse";
import { WarehouseItem } from "@/lib/queries/get-warehouse-items";
import { cn } from "@/lib/utils";
import { ItemCard } from "./item-card";
import { ItemIcon } from "./item-icon";
import {
  ItemTooltip,
  ItemTooltipContent,
  ItemTooltipTrigger,
} from "./item-tooltip";

export function WarehouseGrid({
  items,
  selectedSlot,
  onSelectSlot,
}: {
  items: WarehouseItem[];
  selectedSlot: number | null;
  onSelectSlot: (slot: number) => void;
}) {
  const takenSlots = getOccupiedSlots(items);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${WAREHOUSE_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${WAREHOUSE_ROWS}, 1fr)`,
        aspectRatio: `${WAREHOUSE_COLS} / ${WAREHOUSE_ROWS}`,
      }}
    >
      {/* Empty grid cells as background */}
      {Array.from({ length: WAREHOUSE_SLOTS }).map((_, i) => {
        const bgUrl = takenSlots.has(i) ? FILLED_SLOT_BG : EMPTY_SLOT_BG;
        return (
          <div
            key={`cell-${i}`}
            aria-hidden
            style={{
              gridRow: Math.floor(i / WAREHOUSE_COLS) + 1,
              gridColumn: (i % WAREHOUSE_COLS) + 1,
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        );
      })}

      {/* Items overlaid on grid */}
      {items.map((item) => {
        const startRow = Math.floor(item.slot / WAREHOUSE_COLS);
        const startCol = item.slot % WAREHOUSE_COLS;
        const isSelected = selectedSlot === item.slot;

        return (
          <ItemTooltip key={item.slot}>
            <ItemTooltipTrigger asChild>
              {/* design-system exception: warehouse cell mimics the in-game grid slot, not a generic <Button>. Keep the raw <button>. */}
              <button
                type="button"
                onClick={() => onSelectSlot(item.slot)}
                style={{
                  gridRowStart: startRow + 1,
                  gridRowEnd: startRow + 1 + item.height,
                  gridColumnStart: startCol + 1,
                  gridColumnEnd: startCol + 1 + item.width,
                }}
                className={cn(
                  "focus-visible:ring-gold hover:bg-black/20 relative flex h-full w-full flex-col items-stretch justify-between overflow-hidden rounded-md border-0 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset",
                  isSelected
                    ? "bg-black/20 ring-gold z-10 ring-2 ring-inset"
                    : "cursor-pointer",
                )}
                aria-label={`Select item ${item.name} +${item.level}`}
              >
                <ItemIcon
                  group={item.group}
                  index={item.index}
                  level={item.level}
                  className="flex-1"
                />
              </button>
            </ItemTooltipTrigger>
            <ItemTooltipContent>
              <ItemCard item={item} />
            </ItemTooltipContent>
          </ItemTooltip>
        );
      })}
    </div>
  );
}
