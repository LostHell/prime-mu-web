import { render, screen } from "@testing-library/react";
import DownloadsContent, {
  type DownloadClient,
} from "./_components/downloads-content";

const clients = (
  hrefs: { windows?: string | null; macos?: string | null } = {},
): DownloadClient[] => [
  {
    name: "Windows",
    version: "0.97d",
    size: "150 MB zipped",
    installed: "210 MB unzipped",
    href: hrefs.windows ?? null,
  },
  {
    name: "macOS",
    version: "0.97d",
    size: "170 MB",
    installed: null,
    href: hrefs.macos ?? null,
  },
];

test("points account creation at registration and lists both clients", () => {
  render(<DownloadsContent clients={clients()} />);

  expect(
    screen.getByRole("link", { name: "registration page" }),
  ).toHaveAttribute("href", "/register");
  expect(screen.getByText("150 MB zipped")).toBeInTheDocument();
  expect(screen.getByText("210 MB unzipped")).toBeInTheDocument();
  expect(screen.getByText("170 MB")).toBeInTheDocument();
  expect(screen.queryByText(/User Panel/)).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Download Windows" }),
  ).toBeDisabled();
  expect(
    screen.queryByRole("link", { name: "Download Windows" }),
  ).not.toBeInTheDocument();
  expect(
    document.querySelector('script[type="application/ld+json"]')?.textContent,
  ).toContain("The launcher will not open");
});

test("links a hosted client file", () => {
  render(
    <DownloadsContent
      clients={clients({
        windows: "https://files.example/windows.zip",
        macos: "https://files.example/macos.zip",
      })}
    />,
  );

  expect(
    screen.getByRole("link", { name: "Download Windows" }),
  ).toHaveAttribute("href", "https://files.example/windows.zip");
  expect(screen.getByRole("link", { name: "Download macOS" })).toHaveAttribute(
    "href",
    "https://files.example/macos.zip",
  );
  expect(
    screen.queryByText("Download link is not published yet."),
  ).not.toBeInTheDocument();
});
