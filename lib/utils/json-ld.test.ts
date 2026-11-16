import { breadcrumbJsonLd, faqPageJsonLd, serializeJsonLd } from "./json-ld";

const original = process.env.SITE_URL;

afterEach(() => {
  if (original === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = original;
  }
});

test("escapes < so a value cannot close the script tag", () => {
  const text = serializeJsonLd({ name: "</script><script>alert(1)</script>" });

  expect(text).not.toContain("<");
  expect(JSON.parse(text)).toEqual({
    name: "</script><script>alert(1)</script>",
  });
});

test("lists the crumbs in order with absolute links, leaving the current page without one", () => {
  process.env.SITE_URL = "https://blackmu.example";

  expect(
    breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Rankings" }]),
  ).toEqual({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://blackmu.example/",
      },
      { "@type": "ListItem", position: 2, name: "Rankings" },
    ],
  });
});

test("turns questions and answers into an FAQPage", () => {
  expect(
    faqPageJsonLd([{ question: "Does it run on macOS?", answer: "Yes." }]),
  ).toEqual({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does it run on macOS?",
        acceptedAnswer: { "@type": "Answer", text: "Yes." },
      },
    ],
  });
});
