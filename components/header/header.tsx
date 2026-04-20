import { logoutAction } from "@/actions/logout";
import { auth } from "@/auth";
import Navigation from "@/components/header/navigation";
import type { HeaderNavItem } from "@/components/header/types";
import { IS_HEADER_STICKY } from "@/constants/header";
import { cn } from "@/lib/utils";

const HEADER_NAV_PUBLIC: HeaderNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/top-players", label: "Top Players" },
  { href: "/download", label: "Download" },
];

export default async function Header() {
  const session = await auth();
  const isAuthenticated = !!session?.user?.id;

  const items = [
    ...HEADER_NAV_PUBLIC,
    ...(isAuthenticated
      ? [
          { href: "/user-panel", label: "User Panel" },
          { label: "Logout", clickHandler: logoutAction },
        ]
      : [
          { href: "/login", label: "Login" },
          { href: "/register", label: "Register" },
        ]),
  ];

  return (
    <header className={cn(IS_HEADER_STICKY && "sticky top-0 z-50")}>
      <Navigation items={items} />
    </header>
  );
}
