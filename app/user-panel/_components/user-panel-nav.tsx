"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Characters",
    items: [
      { label: "Overview", href: "/user-panel" },
      { label: "Add Stats", href: "/user-panel/add-stats" },
      { label: "Reset", href: "/user-panel/reset" },
      { label: "Unstuck", href: "/user-panel/unstuck" },
      { label: "Clear PK", href: "/user-panel/clear-pk" },
    ],
  },
  {
    label: "Market",
    items: [
      { label: "Browse", href: "/user-panel/market" },
      { label: "Sell an item", href: "/user-panel/market/sell" },
      { label: "My Listings", href: "/user-panel/market/listed" },
      { label: "Sold items", href: "/user-panel/market/sold" },
      { label: "Purchased items", href: "/user-panel/market/bought" },
    ],
  },
  {
    label: "Wallet",
    items: [{ label: "Deposits", href: "/user-panel/deposits" }],
  },
  {
    label: "Account",
    items: [
      { label: "Change Password", href: "/user-panel/change-password" },
      { label: "Change Email", href: "/user-panel/change-email" },
    ],
  },
];

interface UserPanelNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function UserPanelNav({ onNavigate, className }: UserPanelNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/user-panel") return pathname === "/user-panel";
    if (href === "/user-panel/market") return pathname === "/user-panel/market";
    return pathname.startsWith(href);
  };

  return (
    <nav className={cn("animate-fade-in h-full px-4", className)}>
      <div className="grid grid-cols-1 gap-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="text-muted-foreground mb-2 text-xs tracking-wider uppercase">
              {group.label}
            </div>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                      active
                        ? "text-gold bg-gold/10"
                        : "text-foreground hover:bg-muted/50",
                    )}
                  >
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-gold" : "text-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
