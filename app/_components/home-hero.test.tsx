import { render, screen } from "@testing-library/react";
import { getServerInfo } from "@/lib/queries/get-server-info";
import { formatServerLiveNote } from "@/lib/utils/dates";
import HomeHero from "./home-hero";

jest.mock("@/lib/queries/get-server-info", () => ({
  getServerInfo: jest.fn(),
}));

test("shows the official launch date beside the server status, as the other pages do", async () => {
  (getServerInfo as jest.Mock).mockResolvedValue({
    status: "online",
    online: 12,
    maxOnline: 100,
    registered: 340,
    guilds: 9,
  });

  render(await HomeHero());

  expect(screen.getByText("Server Online")).toBeInTheDocument();
  expect(screen.getByText(formatServerLiveNote())).toBeInTheDocument();
  expect(formatServerLiveNote(new Date(Date.UTC(2026, 10, 23)))).toBe(
    "Official Launch: 20.12.2026",
  );
});
