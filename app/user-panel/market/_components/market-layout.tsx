"use client";

import Headline from "@/components/ui/headline";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Text from "@/components/ui/text";
import {
  CircleDollarSign,
  Package,
  PlusCircle,
  ShoppingBag,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MARKET_TABS = [
  {
    label: "Browse",
    href: "/user-panel/market",
    icon: Store,
  },
  {
    label: "My Listings",
    href: "/user-panel/market/listed",
    icon: ShoppingBag,
  },
  {
    label: "Sell Item",
    href: "/user-panel/market/sell",
    icon: PlusCircle,
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
    const tab = MARKET_TABS.find(
      (t) => pathname.startsWith(t.href) && t.href !== "/user-panel/market",
    );
    return tab?.href ?? "/user-panel/market";
  };

  return (
    <>
      <Headline>
        <Text as="h1" variant="h4">
          Market
        </Text>
        <Text variant="small">Buy and sell items with other players</Text>
      </Headline>

      {/* Tabs Navigation */}
      <div className="-mx-4 overflow-x-auto px-4 pb-2">
        <Tabs value={getCurrentTab()} className="w-full">
          <TabsList
            variant="line"
            className="w-full justify-start gap-0 bg-transparent"
          >
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
      <div className="card-dark overflow-visible p-6">{children}</div>
    </>
  );
}
