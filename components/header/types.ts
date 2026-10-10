export type HeaderNavItem =
  | { href: string; label: string; variant?: "button" }
  | { href: string; label: string; variant: "avatar"; initial: string };
