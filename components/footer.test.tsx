import { render, screen } from "@testing-library/react";
import Footer from "./footer";

test("links the public pages", () => {
  render(<Footer />);

  expect(screen.getByRole("link", { name: "Server info" })).toHaveAttribute(
    "href",
    "/server-info",
  );
  expect(screen.getByRole("link", { name: "Rankings" })).toHaveAttribute(
    "href",
    "/rankings",
  );
  expect(screen.getByRole("link", { name: "Downloads" })).toHaveAttribute(
    "href",
    "/downloads",
  );
  expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
    "href",
    "/login",
  );
  expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
    "href",
    "/register",
  );
});

test("links the FAQ and the rules in the same row as the site's pages", () => {
  render(<Footer />);

  expect(screen.getAllByRole("navigation")).toHaveLength(1);
  expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute(
    "href",
    "/faq",
  );
  expect(screen.getByRole("link", { name: "Rules" })).toHaveAttribute(
    "href",
    "/rules",
  );
});
