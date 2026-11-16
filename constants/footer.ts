import { LEGAL_LINKS } from "./legal";
import { NAVIGATION_ITEMS } from "./navigation";

/** One row: the header's pages, then the FAQ and the legal pages, which only the footer links. */
export const FOOTER_NAV = [
  ...NAVIGATION_ITEMS,
  { href: "/faq", label: "FAQ" },
  ...LEGAL_LINKS,
];
