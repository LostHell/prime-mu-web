"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MarketLayout } from "./_components/market-layout";
import { MarketItemCard, MOCK_ITEMS } from "./_components/market-item-card";
import { useState } from "react";

const CATEGORIES = ["All", "Swords", "Axes", "Bows"];

export default function MarketPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = MOCK_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MarketLayout>
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-gold text-background"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <MarketItemCard key={item.id} item={item} />
            ))
          ) : (
            <div className="text-center py-12">
              <Filter className="size-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">No items found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="flex justify-center pt-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-gold text-background text-sm font-medium">
              1
            </button>
            <button className="px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">
              2
            </button>
            <button className="px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">
              3
            </button>
          </div>
        </div>
      </div>
    </MarketLayout>
  );
}
