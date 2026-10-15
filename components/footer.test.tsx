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
