import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";

const renderContact = (contact: string | null) => {
  let element: ReactElement | undefined;
  jest.isolateModules(() => {
    jest.doMock("@/constants/app", () => ({
      ...jest.requireActual("@/constants/app"),
      LEGAL_CONTACT: contact,
    }));
    const { LegalContact } =
      jest.requireActual<typeof import("./legal-document")>("./legal-document");
    element = <LegalContact />;
  });
  return render(<p>{element}</p>);
};

const originalSiteUrl = process.env.SITE_URL;

afterEach(() => {
  jest.dontMock("@/constants/app");
  if (originalSiteUrl === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = originalSiteUrl;
  }
});

test("links the contact address as an email", () => {
  renderContact("staff@blackmu.example");

  expect(
    screen.getByRole("link", { name: "staff@blackmu.example" }),
  ).toHaveAttribute("href", "mailto:staff@blackmu.example");
});

test("says the contact is not published while there is none", () => {
  renderContact(null);

  expect(
    screen.getByText("Contact details are not published yet."),
  ).toBeInTheDocument();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});

test("shows the way back home and describes it as a BreadcrumbList", () => {
  process.env.SITE_URL = "https://blackmu.example";
  const { LegalDocument } =
    jest.requireActual<typeof import("./legal-document")>("./legal-document");
  const { container } = render(
    <LegalDocument title="Server rules" updated="16 November 2026" intro="">
      <p>Text</p>
    </LegalDocument>,
  );

  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  );
  const jsonLd = container.querySelector('script[type="application/ld+json"]');
  expect(JSON.parse(jsonLd?.textContent ?? "{}")).toEqual({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://blackmu.example/",
      },
      { "@type": "ListItem", position: 2, name: "Server rules" },
    ],
  });
});
