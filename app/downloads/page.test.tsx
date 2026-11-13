import { render, screen } from "@testing-library/react";
import DownloadsContent from "./_components/downloads-content";
import type { DownloadClient } from "./_types/clients";

const clients = (
  hrefs: { windows?: string | null; macos?: string | null } = {},
): DownloadClient[] => [
  {
    name: "Windows",
    version: "0.97d",
    size: "5.0 MB",
    installed: "About 380.2 MB",
    href: hrefs.windows ?? null,
  },
  {
    name: "macOS",
    version: "0.97d",
    size: null,
    installed: null,
    href: hrefs.macos ?? null,
  },
];

test("points account creation at registration and lists both launchers", () => {
  render(<DownloadsContent clients={clients()} />);

  expect(
    screen.getByRole("link", { name: "registration page" }),
  ).toHaveAttribute("href", "/register");
  expect(screen.getByText("5.0 MB")).toBeInTheDocument();
  expect(screen.getByText("About 380.2 MB")).toBeInTheDocument();
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

test("links a published launcher", () => {
  render(
    <DownloadsContent
      clients={clients({
        windows: "/downloads/launcher/windows/launcher.exe",
        macos: "/downloads/launcher/macos/MU.zip",
      })}
    />,
  );

  expect(
    screen.getByRole("link", { name: "Download Windows" }),
  ).toHaveAttribute("href", "/downloads/launcher/windows/launcher.exe");
  expect(screen.getByRole("link", { name: "Download macOS" })).toHaveAttribute(
    "href",
    "/downloads/launcher/macos/MU.zip",
  );
  expect(
    screen.queryByText("Download link is not published yet."),
  ).not.toBeInTheDocument();
});
