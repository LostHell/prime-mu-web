import { LEGAL_CONTACT } from "./app";

/** /privacy and /terms are linked and indexed only once there is a contact for them. */
export const LEGAL_PAGES_PUBLISHED = LEGAL_CONTACT !== null;

/** The legal pages to link (footer, registration, sitemap, /llms.txt). */
export const LEGAL_LINKS: { href: string; label: string }[] = [
  { href: "/rules", label: "Rules" },
  ...(LEGAL_PAGES_PUBLISHED
    ? [
        { href: "/terms", label: "Terms of use" },
        { href: "/privacy", label: "Privacy policy" },
      ]
    : []),
];
