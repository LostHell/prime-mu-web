import AccountAvatar from "@/components/header/account-avatar";
import NavigationItem from "@/components/header/nav-link";
import type { HeaderNavItem } from "@/components/header/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const getItemKey = (item: HeaderNavItem) => item.href;

export default function AccountActions({
  items,
  className,
  onNavigate,
}: {
  items: readonly HeaderNavItem[];
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <div className={cn("flex items-center justify-end gap-3 sm:gap-5", className)}>
      {items.map((item) => {
        const key = getItemKey(item);

        if ("href" in item && item.variant === "avatar") {
          return (
            <AccountAvatar
              key={key}
              href={item.href}
              label={item.label}
              initial={item.initial}
              onNavigate={onNavigate}
            />
          );
        }

        if ("href" in item && item.variant === "button") {
          return (
            <Button key={key} variant="outline" size="sm" decorative asChild>
              <Link href={item.href} onClick={onNavigate}>
                {item.label}
              </Link>
            </Button>
          );
        }

        return <NavigationItem key={key} item={item} onNavigate={onNavigate} />;
      })}
    </div>
  );
}
