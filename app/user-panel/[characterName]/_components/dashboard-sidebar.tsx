"use client";

import { BarChart3, Compass, Package, RotateCcw, ShieldOff, ShoppingBag, Swords } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = {
  BarChart3,
  Swords,
  RotateCcw,
  ShieldOff,
  Compass,
  Package,
  ShoppingBag,
} as const;

interface SidebarItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}

interface DashboardSidebarProps {
  characterName: string;
}

const DashboardSidebar = ({ characterName }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const basePath = `/user-panel/${encodeURIComponent(characterName)}`;

  const items: SidebarItem[] = [
    { href: basePath, label: "Overview", icon: "BarChart3" },
    { href: `${basePath}/warehouse`, label: "Warehouse Shop", icon: "Package" },
    { href: `${basePath}/my-listings`, label: "My Listings", icon: "ShoppingBag" },
    { href: `${basePath}/add-stats`, label: "Add Stats", icon: "Swords" },
    { href: `${basePath}/reset`, label: "Reset Character", icon: "RotateCcw" },
    { href: `${basePath}/clear-pk`, label: "Clear PK", icon: "ShieldOff" },
    { href: `${basePath}/unstuck`, label: "Unstuck", icon: "Compass" },
  ];

  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
      {items.map(({ href, label, icon }) => {
        const Icon = ICONS[icon];
        const isActive = pathname === href || (href !== basePath && pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-4 py-3 rounded text-left whitespace-nowrap transition-all duration-200 font-serif text-xs uppercase tracking-widest"
            style={{
              background: isActive ? "hsl(var(--gold) / 0.12)" : "transparent",
              color: isActive ? "hsl(var(--gold))" : "hsl(var(--muted-foreground))",
              borderLeft: isActive ? "2px solid hsl(var(--gold))" : "2px solid transparent",
            }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default DashboardSidebar;
