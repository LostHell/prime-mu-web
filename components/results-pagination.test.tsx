import { render, screen } from "@testing-library/react";
import { getPaginationHref, ResultsPagination } from "./results-pagination";

describe("ResultsPagination", () => {
  test("preserves search filters and creates canonical page links", () => {
    render(
      <ResultsPagination
        page={2}
        hasNext
        itemCount={25}
        pathname="/user-panel/market"
        query={{ q: "Jewel & Sword" }}
      />,
    );

    expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute(
      "href",
      "/user-panel/market?q=Jewel+%26+Sword",
    );
    const currentPage = screen.getByRole("link", { name: "Page 2" });
    expect(currentPage).toHaveTextContent("2");
    expect(currentPage).toHaveClass("size-8");
    expect(currentPage).toHaveAttribute(
      "href",
      "/user-panel/market?q=Jewel+%26+Sword&page=2",
    );
    expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
      "href",
      "/user-panel/market?q=Jewel+%26+Sword&page=3",
    );
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
  });

  test("makes unavailable directions non-interactive", () => {
    render(
      <ResultsPagination
        page={1}
        hasNext={false}
        itemCount={1}
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

  test("does not render for an empty result set", () => {
    render(
      <ResultsPagination
        page={1}
        hasNext={false}
        itemCount={0}
        pathname="/user-panel/market"
      />,
    );

    expect(
      screen.queryByRole("navigation", { name: "Results pages" }),
    ).not.toBeInTheDocument();
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
