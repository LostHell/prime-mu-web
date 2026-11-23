import { render, screen } from "@testing-library/react";
import { HOME_NEWS_COUNT, NEWS } from "@/constants/news";
import HomeNews from "./home-news";

test("shows only the newest news, newest first, and links to all of them", () => {
  render(<HomeNews />);

  const articles = screen.getAllByRole("article");
  expect(HOME_NEWS_COUNT).toBe(5);
  expect(articles).toHaveLength(Math.min(HOME_NEWS_COUNT, NEWS.length));
  expect(screen.getByRole("link", { name: NEWS[0].title })).toBeInTheDocument();
  for (const older of NEWS.slice(HOME_NEWS_COUNT)) {
    expect(
      screen.queryByRole("link", { name: older.title }),
    ).not.toBeInTheDocument();
  }
  expect(screen.getByRole("link", { name: "All news" })).toHaveAttribute(
    "href",
    "/news",
  );
});
