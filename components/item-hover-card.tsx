"use client";

import { ItemCard, type ItemCardItem } from "@/components/item-card";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

type ItemHoverCardProps = {
  item: ItemCardItem;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ItemHoverCard({
  item,
  children,
  className,
  style,
}: ItemHoverCardProps) {
  return (
    <div className={cn("group/item-tooltip relative", className)} style={style}>
      {children}
      <div
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-100 -translate-x-1/2",
          "opacity-0 transition-opacity duration-150 ease-out",
          "group-hover/item-tooltip:pointer-events-auto group-hover/item-tooltip:opacity-100",
        )}
      >
        <div className="ring-gold-dim/40 rounded-lg shadow-2xl ring-1 shadow-black/40">
          <ItemCard item={item} />
        </div>
      </div>
    </div>
  );
}
