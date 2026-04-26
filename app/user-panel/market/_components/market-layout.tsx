"use client";

import { Card, CardContent } from "@/components/ui/card";
import Headline from "@/components/ui/headline";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Text from "@/components/ui/text";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MARKET_TABS = [
  {
    label: "Browse",
    href: "/user-panel/market",
  },
  {
    label: "Sell Item",
    href: "/user-panel/market/sell",
  },
  {
    label: "My Listings",
    href: "/user-panel/market/listed",
  },
  {
    label: "Sold",
    href: "/user-panel/market/sold",
  },
  {
    label: "Purchased",
    href: "/user-panel/market/bought",
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
      <Card className="pt-0">
        <CardContent>
          {/* Tabs Navigation */}
          <Tabs value={getCurrentTab()} className="w-full mb-6">
            <TabsList
              variant="line"
              className="w-full justify-start gap-0 bg-transparent"
            >
              {MARKET_TABS.map((tab) => {
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
                      className={cn(
                        "text-center gap-2 text-sm font-medium transition-colors",
                        isActive ? "text-gold" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span>{tab.label}</span>
                    </Link>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {/* Content */}
          {children}
        </CardContent>
      </Card>
    </>
  );
}
