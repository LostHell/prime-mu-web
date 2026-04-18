"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, Package, PlusCircle, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MARKET_TABS = [
  {
    label: "Browse",
    href: "/user-panel/market",
    icon: Store,
  },
  {
    label: "Sell Item",
    href: "/user-panel/market/sell",
    icon: PlusCircle,
  },
  {
    label: "My Listings",
    href: "/user-panel/market/listed",
    icon: ShoppingBag,
  },
  {
    label: "Sold",
    href: "/user-panel/market/sold",
    icon: CircleDollarSign,
  },
  {
    label: "Purchased",
    href: "/user-panel/market/bought",
    icon: Package,
  },
];

interface MarketLayoutProps {
  children: React.ReactNode;
}

export function MarketLayout({ children }: MarketLayoutProps) {
  const pathname = usePathname();

  const getCurrentTab = () => {
    if (pathname === "/user-panel/market") return "/user-panel/market";
    const tab = MARKET_TABS.find((t) => pathname.startsWith(t.href) && t.href !== "/user-panel/market");
    return tab?.href ?? "/user-panel/market";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
          <Store className="size-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold gold-gradient-text">
            Market
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Buy and sell items with other players
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="overflow-x-auto -mx-4 px-4 pb-2">
        <Tabs value={getCurrentTab()} className="w-full">
          <TabsList variant="line" className="w-full justify-start gap-0 bg-transparent">
            {MARKET_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = getCurrentTab() === tab.href;
              return (
                <TabsTrigger
                  key={tab.href}
                  value={tab.href}
                  asChild
                  className="data-[state=active]:text-gold data-[state=active]:after:bg-gold"
                >
                  <Link
                    href={tab.href}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-gold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="card-dark p-6">{children}</div>
    </div>
  );
}
