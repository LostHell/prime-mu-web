import OrnamentLine from "@/components/ui/ornament-line";
import { BRAND } from "@/constants/app";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <OrnamentLine className="mb-6" />
        <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} {BRAND} &mdash; Season 0.97d</p>
        <p className="text-muted-foreground/60 text-xs mt-2">
          MU Online is a registered trademark of Webzen Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
