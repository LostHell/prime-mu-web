import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import { DEPOSITABLE_ITEMS } from "@/constants/depositable-items";
import Link from "next/link";

const currencies = Object.values(DEPOSITABLE_ITEMS).map((item) => item.label);

const TradeShowcase = () => {
  return (
    <section>
      <Text variant="h3" as="h2" className="mb-4">
        Trade on the site
      </Text>
      <div className="border-border relative overflow-hidden rounded-xl border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-position-[75%_center]"
          style={{ backgroundImage: "url(/hero-banner.jpg)" }}
        />
        <div
          aria-hidden="true"
          className="from-background via-background/85 to-background/35 pointer-events-none absolute inset-0 bg-linear-to-r"
        />
        <div className="relative max-w-xl px-6 py-8">
          <p className="text-muted-foreground text-sm">
            Deposit currencies from your warehouse, then buy and sell items on
            the market.
          </p>
          <p className="mt-3 text-sm">{currencies.join(" · ")}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" decorative asChild>
              <Link href="/user-panel/market">Browse the market</Link>
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              decorative
              asChild
            >
              <Link href="/user-panel/deposits">Open deposits</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeShowcase;
