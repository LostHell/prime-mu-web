import { render, screen } from "@testing-library/react";
import DownloadsContent from "./_components/downloads-content";

test("points account creation at registration and lists both clients", () => {
  render(<DownloadsContent />);

  expect(
    screen.getByRole("link", { name: "registration page" }),
  ).toHaveAttribute("href", "/register");
  expect(screen.getByText("150 MB zipped")).toBeInTheDocument();
  expect(screen.getByText("210 MB unzipped")).toBeInTheDocument();
  expect(screen.getByText("170 MB")).toBeInTheDocument();
  expect(screen.queryByText(/User Panel/)).not.toBeInTheDocument();
});
