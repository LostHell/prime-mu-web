import { render, screen } from "@testing-library/react";
import ServerInfoGuide from "./server-info-guide";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);

test("shows the public server settings and live counts", () => {
  render(<ServerInfoGuide online={12} registered={340} guilds={9} />);

  expect(screen.getByRole("heading", { name: "Server" })).toBeInTheDocument();
  expect(screen.getByText("12")).toBeInTheDocument();
  expect(screen.getByText("340")).toBeInTheDocument();
  expect(screen.getByText("9")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View rankings" })).toHaveAttribute(
    "href",
    "/rankings",
  );
  expect(screen.getByRole("link", { name: "Download client" })).toHaveAttribute(
    "href",
    "/downloads",
  );
  expect(screen.queryByText(/Donations/)).not.toBeInTheDocument();
});

test("lists every enabled event with its schedule, length and bonus", () => {
  render(<ServerInfoGuide online={0} registered={0} guilds={0} />);

  expect(screen.getByText("Happy Hour")).toBeInTheDocument();
  expect(screen.getByText("20:00")).toBeInTheDocument();
  expect(screen.getByText("60 min · +150% experience")).toBeInTheDocument();
});
