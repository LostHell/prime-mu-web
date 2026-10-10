import { auth } from "@/auth";
import Navigation from "@/components/header/navigation";
import type { HeaderNavItem } from "@/components/header/types";
import { HEADER_NAV, IS_HEADER_STICKY } from "@/constants/header";
import { cn } from "@/lib/utils";

export default async function Header() {
  const session = await auth();
  const accountId = session?.user?.id;

  const accountItems: HeaderNavItem[] = accountId
    ? [
        {
          href: "/user-panel",
          label: "User Panel",
          variant: "avatar",
          initial: accountId.charAt(0).toUpperCase(),
        },
      ]
    : [
        { href: "/login", label: "Log in" },
        { href: "/register", label: "Create account", variant: "button" },
      ];

  return (
    <header className={cn(IS_HEADER_STICKY && "sticky top-0 z-50")}>
      <Navigation navItems={HEADER_NAV} accountItems={accountItems} />
    </header>
  );
}
