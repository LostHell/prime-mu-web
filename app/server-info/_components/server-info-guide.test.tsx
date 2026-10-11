import { render, screen } from "@testing-library/react";
import ServerInfoGuide from "./server-info-guide";

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
