export type HeaderNavItem =
  | { href: string; label: string }
  | { label: string; clickHandler: () => void };
