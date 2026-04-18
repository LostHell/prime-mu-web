"use client";

import { ArrowRight, CircleDollarSign, Package } from "lucide-react";
import { MarketLayout } from "../_components/market-layout";

function SellItemForm() {
  const mockWarehouseItems = [
    { id: "1", name: "Lighting Sword +9", slot: "1-1" },
    { id: "2", name: "Dragon Shield +7", slot: "1-2" },
    { id: "3", name: "Black Dragon Pants +11", slot: "2-1" },
  ];

  return (
    <div className="space-y-6">
      {/* Warehouse Grid */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Select Item from Warehouse
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {mockWarehouseItems.map((item) => (
            <button
              key={item.id}
              className="aspect-square rounded-lg border border-border/50 bg-muted/30 hover:border-gold/50 hover:bg-gold/5 transition-colors flex items-center justify-center group"
              title={item.name}
            >
              <div className="w-3/4 h-3/4 bg-gradient-to-br from-gold/20 to-transparent rounded-md group-hover:from-gold/30" />
            </button>
          ))}
          {Array.from({ length: 16 - mockWarehouseItems.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square rounded-lg border border-border/30 bg-muted/10"
            />
          ))}
        </div>
      </div>

      {/* Selected Item Info */}
      <div className="rounded-xl border border-border/50 p-4 bg-muted/20">
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
      </div>

      {/* Price Input */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Set Price
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CircleDollarSign className="size-4 text-gold" />
              <span className="text-sm font-medium">Zen</span>
            </div>
            <input
              type="number"
              placeholder="0"
              className="w-full bg-transparent text-2xl font-bold tabular-nums text-gold focus:outline-none"
            />
          </div>
          <div className="rounded-xl border border-border/30 p-4 opacity-50">
            <div className="flex items-center gap-2 mb-3">
              <CircleDollarSign className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Credits
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground ml-auto">
                Soon
              </span>
            </div>
            <input
              type="number"
              placeholder="0"
              disabled
              className="w-full bg-transparent text-2xl font-bold tabular-nums text-muted-foreground focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* List Button */}
      <button
        disabled
        className="w-full py-4 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gold text-background"
      >
        <span>List Item for Sale</span>
        <ArrowRight className="size-4" />
      </button>

      {/* Info */}
      <div className="text-center py-2">
        <p className="text-xs text-muted-foreground">
          Items are listed from your character&apos;s warehouse.
          <br />
          A 5% fee is charged on successful sales.
        </p>
      </div>
    </div>
  );
}

export default function SellItemPage() {
  return (
    <MarketLayout>
      <SellItemForm />
    </MarketLayout>
  );
}
