import OrnamentLine from "@/components/ui/ornament-line";
import { BRAND } from "@/constants/app";
import { FOOTER_NAV } from "@/constants/footer";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto py-8">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <OrnamentLine className="mb-6" />
        <nav aria-label="Footer" className="mb-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-gold text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} {BRAND} &mdash; Season 0.97d
        </p>
        <p className="text-muted-foreground/60 mt-2 text-xs">
          MU Online is a registered trademark of Webzen Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
