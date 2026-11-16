import { SITE_FAQ } from "@/app/_constants/site-faq";
import { JsonLd } from "@/components/json-ld";
import PageHero from "@/components/page-hero";
import PageLayout from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import { BRAND } from "@/constants/app";
import { VERSION } from "@/constants/server";
import { getServerStatus } from "@/lib/queries/get-server-status";
import { formatServerLiveNote } from "@/lib/utils/dates";
import { faqPageJsonLd } from "@/lib/utils/json-ld";
import { openGraphFor } from "@/lib/utils/open-graph";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Answers about ${BRAND}, the MU Online ${VERSION} private server: how to start on Windows or macOS, classes, resets, events, the market and PK.`,
  alternates: { canonical: "/faq" },
  openGraph: openGraphFor("/faq"),
};

const FaqPage = async () => {
  const { status } = await getServerStatus();

  return (
    <>
      <JsonLd data={faqPageJsonLd(SITE_FAQ)} />
      <PageHero
        label="FAQ"
        title="Frequently asked questions"
        description="The short answers. The details are one click away."
        status={status}
        statusNote={formatServerLiveNote()}
      />
      <PageLayout>
        <Card>
          <CardContent>
            <div className="divide-border/50 divide-y">
              {SITE_FAQ.map((item) => (
                <section
                  key={item.question}
                  className="py-5 first:pt-0 last:pb-0"
                >
                  <Text variant="h4" as="h2" className="text-lg md:text-xl">
                    {item.question}
                  </Text>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                  {item.link ? (
                    <Link
                      href={item.link.href}
                      className="text-gold mt-2 inline-block text-sm underline underline-offset-4"
                    >
                      {item.link.label}
                    </Link>
                  ) : null}
                </section>
              ))}
            </div>
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-6 text-sm">
          Trouble with the launcher? See the{" "}
          <Link
            href="/downloads"
            className="text-gold underline underline-offset-4"
          >
            install help
          </Link>
          .
        </p>
      </PageLayout>
    </>
  );
};

export default FaqPage;
