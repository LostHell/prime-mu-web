import { render, screen } from "@testing-library/react";
import {
  getPaginationHref,
  SearchResultsPagination,
} from "./search-results-pagination";

describe("SearchResultsPagination", () => {
  test("preserves search parameters and creates canonical page links", () => {
    render(
      <SearchResultsPagination
        page={2}
        hasNext
        pathname="/rankings"
        searchParams={{ query: "Dark Wizard", class: "1" }}
      />,
    );

    expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute(
      "href",
      "/rankings?query=Dark+Wizard&class=1",
    );
    expect(screen.getByRole("link", { name: "Page 2" })).toHaveAttribute(
      "href",
      "/rankings?query=Dark+Wizard&class=1&page=2",
    );
    expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
      "href",
      "/rankings?query=Dark+Wizard&class=1&page=3",
    );
  });

  test("makes unavailable directions non-interactive", () => {
    render(
      <SearchResultsPagination
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
      query: "Sword",
      page: "9",
    }),
  ).toBe("/user-panel/market?query=Sword");
});
