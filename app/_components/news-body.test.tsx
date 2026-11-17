import { render, screen } from "@testing-library/react";
import { NewsBody } from "./news-body";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);

test("explains resets with the figures from the server config", () => {
  render(<NewsBody id="resets" />);

  expect(
    screen.getByText(/reaches level 300 can now reset on the website/),
  ).toHaveTextContent("up to 3 times");
  expect(screen.getByText(/The first reset costs/)).toHaveTextContent(
    "The first reset costs 1,000 zen, and the cost rises with each reset, up to 3,000 for the last one.",
  );
  expect(screen.getByText(/100 for each reset so far/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Add stats" })).toHaveAttribute(
    "href",
    "/user-panel/add-stats",
  );
});

test("gives the market's price limits and says to log out first", () => {
  render(<NewsBody id="marketplace" />);

  expect(screen.getByText(/A price can combine Zen/)).toHaveTextContent(
    "up to 2,000,000,000",
  );
  expect(screen.getByText(/A price can combine Zen/)).toHaveTextContent(
    "up to 10,000 of each",
  );
  expect(
    screen.getByText(/Log out of the game before you list/),
  ).toBeInTheDocument();
});

test("describes the four ranking tabs", () => {
  render(<NewsBody id="rankings" />);

  expect(screen.getAllByRole("listitem")).toHaveLength(4);
  expect(screen.getByText(/20 per page/)).toBeInTheDocument();
});
