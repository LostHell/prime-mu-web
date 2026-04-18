"use client";

import { CircleDollarSign } from "lucide-react";

interface MarketItem {
  id: string;
  name: string;
  category: string;
  options: string;
  price: number;
  priceType: "zen" | "credits";
  seller: string;
  listedAt: string;
}

interface MarketItemCardProps {
  item: MarketItem;
  showSeller?: boolean;
  showBuyButton?: boolean;
}

export function MarketItemCard({
  item,
  showSeller = true,
  showBuyButton = true,
}: MarketItemCardProps) {
  return (
    <div className="rounded-xl border border-border/50 p-4 hover:border-gold/30 transition-colors group">
      <div className="flex gap-4">
        {/* Item Icon Placeholder */}
        <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-transparent rounded-md" />
        </div>

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground">{item.options}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex-shrink-0">
              {item.category}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <CircleDollarSign className="size-4 text-gold" />
              <span className="font-bold text-gold">
                {item.price.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.priceType}
              </span>
            </div>
            {showSeller && (
              <span className="text-xs text-muted-foreground">
                by {item.seller}
              </span>
            )}
          </div>
        </div>

        {/* Buy Button */}
        {showBuyButton && (
          <button className="self-center px-4 py-2 rounded-lg bg-gold/10 text-gold text-sm font-medium hover:bg-gold/20 transition-colors flex-shrink-0">
            Buy
          </button>
        )}
      </div>
    </div>
  );
}

export const MOCK_ITEMS: MarketItem[] = [
  {
    id: "1",
    name: "Lighting Sword +13",
    category: "Swords",
    options: "+28 Additional Damage, Luck, Excellent",
    price: 50000000,
    priceType: "zen",
    seller: "KotMuse",
    listedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "Dragon Axe +11",
    category: "Axes",
    options: "+20 Additional Damage, Luck",
    price: 25000000,
    priceType: "zen",
    seller: "TopKot",
    listedAt: "5 hours ago",
  },
  {
    id: "3",
    name: "Silver Bow +12",
    category: "Bows",
    options: "+24 Additional Damage, Excellent",
    price: 150,
    priceType: "credits",
    seller: "FORCE",
    listedAt: "1 day ago",
  },
];
