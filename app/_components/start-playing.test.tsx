import { render, screen } from "@testing-library/react";
import StartPlaying from "./start-playing";

test("links the three steps a new player takes to get in", () => {
  render(<StartPlaying />);

  expect(
    screen.getByRole("link", { name: /Create an account/ }),
  ).toHaveAttribute("href", "/register");
  expect(
    screen.getByRole("link", { name: /Download the client/ }),
  ).toHaveAttribute("href", "/downloads");
  expect(
    screen.getByRole("link", { name: /Log in and make a character/ }),
  ).toHaveAttribute("href", "/login");
});
