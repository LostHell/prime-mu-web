import { JsonLd } from "@/components/json-ld";
import PageLayout from "@/components/page-layout";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { LEGAL_CONTACT } from "@/constants/app";
import { breadcrumbJsonLd } from "@/lib/utils/json-ld";
import Link from "next/link";
import type { ReactNode } from "react";

const bodyClassName =
  "text-muted-foreground flex flex-col gap-10 text-sm leading-relaxed md:text-base [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_p+p]:mt-3 [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5";

/** A text page such as the rules or the privacy policy: its breadcrumb (shown and as BreadcrumbList), one h1, its date, then sections. */
export const LegalDocument = ({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  /** "16 November 2026": when the text last changed. */
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) => {
  return (
    <PageLayout className="max-w-3xl">
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: title }])}
      />
      <p className="text-muted-foreground mb-6 text-sm">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">{title}</span>
      </p>
      <Headline>
        <Text variant="h1">{title}</Text>
        <Text variant="small">Last updated: {updated}</Text>
      </Headline>
      <div className={bodyClassName}>
        <div>{intro}</div>
        {children}
      </div>
    </PageLayout>
  );
};

export const LegalSection = ({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) => {
  return (
    <section id={id} className="scroll-mt-8">
      <Text variant="h3" as="h2" className="mb-3 text-xl md:text-2xl">
        {title}
      </Text>
      {children}
    </section>
  );
};

/** How to reach the team, or a plain notice while LEGAL_CONTACT is not set. */
export const LegalContact = () => {
  if (LEGAL_CONTACT === null) {
    return <>Contact details are not published yet.</>;
  }
  return (
    <>
      Write to <a href={`mailto:${LEGAL_CONTACT}`}>{LEGAL_CONTACT}</a>.
    </>
  );
};
