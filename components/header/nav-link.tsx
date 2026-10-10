import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderNavItem } from "./types";

const base =
  "relative font-serif text-sm whitespace-nowrap tracking-wide transition-all duration-300 ease-out";

const inactive =
  "text-muted-foreground hover:text-gold hover:[text-shadow:0_0_10px_hsl(var(--gold)/0.5)]";

const active = "text-gold [text-shadow:0_0_10px_hsl(var(--gold)/0.5)]";

const getNavLinkClass = (isActive: boolean) => {
  return cn(base, isActive ? active : inactive);
};

export default function NavigationItem({
  item,
  onNavigate,
  className,
}: {
  item: HeaderNavItem;
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(getNavLinkClass(isActive), className)}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}
