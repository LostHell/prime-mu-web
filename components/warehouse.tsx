import { WarehouseItem } from "@/lib/queries/get-warehouse-items";
import { ItemCard } from "./item-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const WAREHOUSE_COLS = 8;
const WAREHOUSE_ROWS = 15;

export function WarehouseGrid({
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
          <Tooltip key={item.slot}>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent
              className="bg-transparent p-0 shadow-none"
            >
              <ItemCard item={item} />
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
