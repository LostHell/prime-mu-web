import OrnamentLine from "@/components/ui/ornament-line";
import { BRAND } from "@/constants/app";

const Footer = () => {
  return (
    <footer className="mt-auto py-8">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <OrnamentLine className="mb-6" />
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
