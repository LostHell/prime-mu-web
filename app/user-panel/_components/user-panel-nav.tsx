"use client";

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
    label: "Character",
    items: [
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
      { label: "My Listings", href: "/user-panel/market/listed" },
      { label: "Sell", href: "/user-panel/market/sell" },
    ],
  },
  {
    label: "Wallet",
    items: [
      { label: "Deposits", href: "/user-panel/deposits" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Change Password", href: "/user-panel/change-password" },
      { label: "Change Email", href: "/user-panel/change-email" },
    ],
  },
];

export function UserPanelNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/user-panel") return pathname === "/user-panel";
    if (href === "/user-panel/market") return pathname === "/user-panel/market";
    return pathname.startsWith(href);
  };

  return (
    <nav className="border-b border-gold-dim/30 bg-card/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4">
          <div className="py-4 border-t border-border/50 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="mb-2 text-xs text-muted-foreground uppercase tracking-wider">
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? "text-gold bg-gold/10"
                            : "text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <ChevronRight
                          className={`w-4 h-4 flex-shrink-0 ${
                            isActive(item.href) ? "text-gold" : "text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    </nav>
  );
}
