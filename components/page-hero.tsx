import { JsonLd } from "@/components/json-ld";
import ServerStatus from "@/components/server-status";
import Text from "@/components/ui/text";
import { breadcrumbJsonLd } from "@/lib/utils/json-ld";
import Image from "next/image";
import Link from "next/link";

type PageHeroProps = {
  /** Current page name in the breadcrumb. */
  label: string;
  title: string;
  description: string;
  status: "online" | "offline";
  /** Short note beside the server status, such as a version or a launch date. */
  statusNote?: string;
};

const PageHero = ({
  label,
  title,
  description,
  status,
  statusNote,
}: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden">
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: label }])}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/hero-banner.jpg"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover object-right md:object-[65%_center]"
        />
      </div>
      <div
        aria-hidden="true"
        className="from-background via-background/80 to-background/40 pointer-events-none absolute inset-0 bg-linear-to-r"
      />
      <div className="relative mx-auto max-w-5xl px-4 py-12 md:py-16">
        <p className="text-muted-foreground text-sm">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-foreground">{label}</span>
        </p>
        <Text variant="h1" className="mt-4">
          {title}
        </Text>
        <Text variant="p" className="text-muted-foreground mt-2">
          {description}
        </Text>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <ServerStatus className="mb-0" status={status} />
          {statusNote ? (
            <p className="text-muted-foreground text-sm">{statusNote}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
