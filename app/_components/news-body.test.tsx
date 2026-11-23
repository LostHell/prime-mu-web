import { render, screen } from "@testing-library/react";
import { SERVER_LAUNCH_DATE } from "@/constants/app";
import { NEWS } from "@/constants/news";
import { formatLongDate } from "@/lib/utils/dates";
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

test("walks a Mac player from the account to the game, with the pages they need", () => {
  render(<NewsBody id="play-mu-online-on-mac" />);

  expect(screen.getAllByRole("listitem")).toHaveLength(6);
  expect(screen.getByText(/Unzip MU.zip and move MU/)).toBeInTheDocument();
  expect(screen.getByText(/Apple Silicon \(M1 to M4\)/)).toBeInTheDocument();
  expect(screen.getByText(/Right-click \(or/)).toHaveTextContent(
    "System Settings → Privacy & Security, scroll down to the message about MU, click Open Anyway and confirm.",
  );
  expect(screen.getByText(/the game reaches/)).toHaveTextContent(
    "the game reaches 165+ FPS on a Mac too, but its default FPS limit is lower",
  );
  for (const href of ["/register", "/downloads", "/server-info", "/faq"]) {
    expect(
      screen
        .getAllByRole("link")
        .some((link) => link.getAttribute("href") === href),
    ).toBe(true);
  }
});

test("dates the official launch the same in the text and in the summary", () => {
  render(<NewsBody id="official-launch" />);
  const launchDate = formatLongDate(SERVER_LAUNCH_DATE);

  expect(screen.getByText(launchDate)).toBeInTheDocument();
  expect(
    screen.getByText(/has been open since 11 October 2026/),
  ).toBeInTheDocument();
  expect(NEWS.find((item) => item.id === "official-launch")?.summary).toContain(
    launchDate,
  );
});

test("says a players' poll decides whether progress continues at the launch", () => {
  render(<NewsBody id="official-launch" />);

  expect(
    screen.getByText(/a temporary poll will let you vote/),
  ).toHaveTextContent(
    "whether progress continues after the official launch or the server is wiped",
  );
});

test("lists the new window keys and F9 to F12, with the Fn note for laptops and Macs", () => {
  render(<NewsBody id="game-keys" />);

  for (const key of [
    "T:",
    "M:",
    "H:",
    "Tab:",
    "F9:",
    "F10:",
    "F11:",
    "F12:",
    "Alt+Enter:",
  ]) {
    expect(screen.getByText(key)).toBeInTheDocument();
  }
  expect(screen.getAllByRole("listitem")).toHaveLength(9);
  expect(screen.getByText(/the F keys often change/)).toHaveTextContent(
    "hold Fn while you press them, for example Fn+F9.",
  );
});

test("counts the quests and their level-up points from the synced quest window", () => {
  render(<NewsBody id="quests" />);

  expect(screen.getByText(/to open the quest window/)).toHaveTextContent(
    "It holds 2 quests that open one after another",
  );
  expect(screen.getByText(/level-up points in all/)).toHaveTextContent(
    "zen and 5 level-up points in all",
  );
  expect(
    screen.getByRole("link", {
      name: "Every quest with its monsters, their maps and its rewards",
    }),
  ).toHaveAttribute("href", "/server-info#quests");
});

test("gives each AFK zone's credits and links the market and the balance", () => {
  render(<NewsBody id="afk-credits" />);

  expect(screen.getByText(/1 credit every hour/)).toHaveTextContent(
    "Davias town: 1 credit every hour.",
  );
  expect(screen.getByText(/1 credit every 6 hours/)).toHaveTextContent(
    "the Arena: 1 credit every 6 hours.",
  );
  expect(
    screen.getByRole("link", { name: "Browse the market" }),
  ).toHaveAttribute("href", "/user-panel/market");
  expect(
    screen.getByRole("link", { name: "See your credits" }),
  ).toHaveAttribute("href", "/user-panel/deposits");
});
