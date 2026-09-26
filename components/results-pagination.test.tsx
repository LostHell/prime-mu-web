import { render, screen } from "@testing-library/react";
import { getPaginationHref, ResultsPagination } from "./results-pagination";

describe("ResultsPagination", () => {
  test("preserves search filters and creates canonical page links", () => {
    render(
      <ResultsPagination
        page={2}
        hasNext
        pathname="/user-panel/market"
        query={{ q: "Jewel & Sword" }}
      />,
    );

    expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute(
      "href",
      "/user-panel/market?q=Jewel+%26+Sword",
    );
    expect(screen.getByRole("link", { name: "Page 2" })).toHaveAttribute(
      "href",
      "/user-panel/market?q=Jewel+%26+Sword&page=2",
    );
    expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
      "href",
      "/user-panel/market?q=Jewel+%26+Sword&page=3",
    );
  });

  test("makes unavailable directions non-interactive", () => {
    render(
      <ResultsPagination
        page={1}
        hasNext={false}
        pathname="/user-panel/market/listed"
      />,
    );

    expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

test("removes an existing page parameter when linking to page one", () => {
  expect(
    getPaginationHref("/user-panel/market", 1, {
      q: "Sword",
      page: "9",
    }),
  ).toBe("/user-panel/market?q=Sword");
});
