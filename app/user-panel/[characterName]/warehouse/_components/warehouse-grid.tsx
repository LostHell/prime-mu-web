"use client";

import ItemCard from "@/components/item-card";
import { DecodedItem, ItemClassFlags } from "@/types/item";
import React, { useEffect, useRef, useState } from "react";
import ListItemForm from "./list-item-form";

type EnrichedItem = DecodedItem & {
  name: string;
  width: number;
  height: number;
  defense?: number;
  defRate?: number;
  dmgMin?: number;
  dmgMax?: number;
  reqStr?: number;
  reqAgi?: number;
  classFlags?: ItemClassFlags;
};

type WarehouseGridProps = {
  characterName: string;
  cols: number;
  rows: number;
  items: EnrichedItem[];
};

type PopoverPosition = {
  top: number;
  left: number;
};

const WarehouseGrid = ({ characterName, cols, rows, items }: WarehouseGridProps) => {
  const totalSlots = cols * rows;
  const visibleItems = items.filter((item) => item.slot < totalSlots);
  const itemBySlot = new Map(visibleItems.map((item) => [item.slot, item]));
  const [selectedItem, setSelectedItem] = useState<EnrichedItem | null>(null);
  const [popoverPos, setPopoverPos] = useState<PopoverPosition>({ top: 0, left: 0 });
  const selectedButtonRef = useRef<HTMLButtonElement>(null);
  const occupiedSlots = new Set<number>();
  const gridCells: React.ReactElement[] = [];

  useEffect(() => {
    if (selectedItem && selectedButtonRef.current) {
      const rect = selectedButtonRef.current.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2,
      });
    }
  }, [selectedItem]);

  for (let slot = 0; slot < totalSlots; slot++) {
    if (occupiedSlots.has(slot)) {
      continue;
    }

    const item = itemBySlot.get(slot);

    if (!item) {
      gridCells.push(
        <div
          key={slot}
          className="h-14 rounded border border-border/50 bg-black/20 flex items-center justify-center text-[10px] text-muted-foreground/40"
        >
          {slot}
        </div>,
      );
      continue;
    }

    const col = slot % cols;
    const row = Math.floor(slot / cols);
    const width = Math.max(1, Math.min(item.width, cols - col));
    const height = Math.max(1, Math.min(item.height, rows - row));

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        occupiedSlots.add((row + r) * cols + (col + c));
      }
    }

    gridCells.push(
      <button
        key={slot}
        ref={selectedItem?.slot === item.slot ? selectedButtonRef : null}
        type="button"
        onClick={() => {
          setSelectedItem(item);
        }}
        className="rounded border border-gold/30 bg-gold/10 flex flex-col justify-center px-1 overflow-hidden text-left hover:bg-gold/20 transition-colors"
        style={{
          gridColumn: `span ${width}`,
          gridRow: `span ${height}`,
          minHeight: "56px",
        }}
        title={`${item.name} (+${item.level})`}
      >
        <span className="text-[10px] font-semibold text-gold leading-tight truncate">{item.name}</span>
        <span className="text-[9px] text-muted-foreground leading-tight">
          +{item.level} | {item.width}x{item.height}
        </span>
      </button>,
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Warehouse Shop</h2>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {visibleItems.length} / {totalSlots} slots used
        </span>
      </div>

      <div className="card-dark p-4 overflow-auto">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(56px, 1fr))`,
            gridAutoRows: "56px",
          }}
        >
          {gridCells}
        </div>
      </div>

      {selectedItem ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setSelectedItem(null)} />
          <div
            className="fixed z-50 -translate-x-1/2 max-h-screen overflow-y-auto"
            style={{
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
            }}
          >
            <ItemCard item={selectedItem} />
            <div className="card-dark p-4 space-y-4 border border-gold/30 border-t-0 rounded-b">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-lg text-gold">List on Market</h3>
                <button type="button" className="btn-outline h-8 px-3 text-xs" onClick={() => setSelectedItem(null)}>
                  Close
                </button>
              </div>
              <ListItemForm characterName={characterName} item={selectedItem} onClose={() => setSelectedItem(null)} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WarehouseGrid;
