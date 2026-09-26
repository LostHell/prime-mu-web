import { render, screen } from "@testing-library/react";
import { getPaginationHref, MarketPagination } from "./market-pagination";

describe("MarketPagination", () => {
  test("preserves search filters and creates canonical page links", () => {
    render(
      <MarketPagination
        page={2}
        hasNext
        pathname="/user-panel/market"
        query={{ query: "Jewel & Sword" }}
      />,
    );

    expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute(
      "href",
      "/user-panel/market?query=Jewel+%26+Sword",
    );
    const currentPage = screen.getByRole("link", { name: "Page 2" });
    expect(currentPage).toHaveTextContent("2");
    expect(currentPage).toHaveClass("size-8");
    expect(currentPage).toHaveAttribute(
      "href",
      "/user-panel/market?query=Jewel+%26+Sword&page=2",
    );
    expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
      "href",
      "/user-panel/market?query=Jewel+%26+Sword&page=3",
    );
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
  });

  test("makes unavailable directions non-interactive", () => {
    render(
      <MarketPagination
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
