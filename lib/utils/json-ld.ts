import { getAbsoluteUrl } from "./site-url";

export type JsonLdData = Record<string, unknown>;

export type BreadcrumbItem = {
  name: string;
  /** Site path of the crumb. The current page, the last crumb, may leave it out. */
  path?: string;
};

/** Structured data as the text of a `<script type="application/ld+json">`. `<` is escaped so a value cannot close the tag. */
export const serializeJsonLd = (data: JsonLdData): string =>
  JSON.stringify(data).replaceAll("<", "\\u003c");

/** schema.org BreadcrumbList for the crumbs a page shows, in order. */
export const breadcrumbJsonLd = (items: BreadcrumbItem[]): JsonLdData => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.path ? { item: getAbsoluteUrl(item.path) } : {}),
  })),
});

/** schema.org FAQPage for questions and answers the page shows as text. */
export const faqPageJsonLd = (
  items: { question: string; answer: string }[],
): JsonLdData => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});
