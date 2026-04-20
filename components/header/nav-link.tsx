import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyboardEvent } from "react";
import { HeaderNavItem } from "./types";

const base =
  "font-serif text-sm uppercase tracking-[0.1em] transition-all duration-300 ease-out";

const inactive =
  "text-muted-foreground hover:text-gold hover:[text-shadow:0_0_10px_hsl(var(--gold)/0.5)]";

const active = "text-gold [text-shadow:0_0_10px_hsl(var(--gold)/0.5)]";

function getNavLinkClass(pathname: string, href?: string) {
  const isActive = href != null && pathname === href;
  return cn(base, isActive ? active : inactive);
}

export default function NavigationItem({
  item,
  onNavigate,
}: {
  item: HeaderNavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const onAnchorButtonKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  if ("href" in item) {
    return (
      <Link
        href={item.href}
        className={getNavLinkClass(pathname, item.href)}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <a
      role="button"
      tabIndex={0}
      className={cn(getNavLinkClass(pathname), "cursor-pointer")}
      onClick={() => {
        onNavigate?.();
        item.clickHandler();
      }}
      onKeyDown={onAnchorButtonKeyDown}
    >
      {item.label}
    </a>
  );
}
