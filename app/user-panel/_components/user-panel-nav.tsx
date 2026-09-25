"use client";

import EmptyState from "@/components/empty-state";
import { useUserPanel } from "../_context/user-panel-context";
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
    label: "Market",
    items: [
      { label: "Browse", href: "/user-panel/market" },
      { label: "Sell an item", href: "/user-panel/market/sell" },
      { label: "My listings", href: "/user-panel/market/listed" },
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
      { label: "Change password", href: "/user-panel/account/change-password" },
      { label: "Change email", href: "/user-panel/account/change-email" },
    ],
  },
];

interface UserPanelNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function UserPanelNav({ onNavigate, className }: UserPanelNavProps) {
  const pathname = usePathname();
  const { characters, selectedCharacter, setSelectedCharacter } =
    useUserPanel();
  const isCharacterPage = [
    "/user-panel",
    "/user-panel/add-stats",
    "/user-panel/reset",
    "/user-panel/clear-pk",
  ].includes(pathname);

  const isActive = (href: string) => {
    if (href === "/user-panel") return pathname === "/user-panel";
    if (href === "/user-panel/market") return pathname === "/user-panel/market";
    return pathname.startsWith(href);
  };

  return (
    <nav className={cn("animate-fade-in h-full", className)}>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="text-muted-foreground mb-2 text-xs tracking-wider uppercase">
            Characters
          </div>
          <div className="flex flex-col gap-1">
            {characters.map((character) => {
              const active =
                isCharacterPage && selectedCharacter?.name === character.name;
              return (
                <Link
                  key={character.name}
                  href={isCharacterPage ? pathname : "/user-panel"}
                  aria-current={active ? "true" : undefined}
                  onClick={() => {
                    setSelectedCharacter(character);
                    onNavigate?.();
                  }}
                  className={cn(
                    "focus-visible:outline-ring flex min-w-0 items-center gap-3 rounded-lg px-3 py-3 transition-colors focus-visible:outline-2",
                    active
                      ? "text-gold bg-gold/10"
                      : "text-foreground hover:bg-muted/50",
                  )}
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-sm font-semibold">
                      {character.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {character.class} · Lv. {character.level}
                    </span>
                  </span>
                  <ChevronRight
                    className="size-icon-sm shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
            {characters.length === 0 && (
              <EmptyState
                variant="compact"
                description="No characters yet. Create one in-game to get started."
                className="px-3 py-2 text-left"
              />
            )}
          </div>
        </div>
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
