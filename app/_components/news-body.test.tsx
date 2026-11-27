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

test("gives the party experience for 2 to 5 members, and the summary its best figures", () => {
  render(<NewsBody id="party-experience" />);

  expect(screen.getAllByRole("listitem")).toHaveLength(4);
  expect(screen.getByText("2 members:").closest("li")).toHaveTextContent(
    "2 members: 25% with one class, 40% with mixed classes.",
  );
  expect(screen.getByText("5 members:").closest("li")).toHaveTextContent(
    "5 members: 100% with one class, 130% with mixed classes.",
  );
  expect(screen.getByText(/within 10 steps of it/)).toBeInTheDocument();
  expect(
    screen.getByText("Whatever your levels.").closest("p"),
  ).toHaveTextContent(
    "each member gets their own experience, as if they had killed the monster alone, plus the party's bonus.",
  );
  expect(screen.getByText(/you get only 50%/)).toHaveTextContent(
    "you get only 50% of the experience you would get alone.",
  );
});

test("gives no party figures in the summary: it cannot follow the synced config", () => {
  expect(
    NEWS.find((item) => item.id === "party-experience")?.summary,
  ).not.toMatch(/\d/);
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

test("walks a player through the password reset, with the link's limits from the site", () => {
  render(<NewsBody id="forgot-password" />);

  expect(screen.getAllByRole("listitem")).toHaveLength(4);
  expect(screen.getByText(/The link works for/)).toHaveTextContent(
    "The link works for 30 minutes and only once.",
  );
  expect(screen.getByText(/The link works for/)).toHaveTextContent(
    "you can ask for a new one every 5 minutes.",
  );
  expect(screen.getByText(/logs out every other browser/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "login page" })).toHaveAttribute(
    "href",
    "/login",
  );
  expect(
    screen.getByRole("link", { name: "Reset your password" }),
  ).toHaveAttribute("href", "/forgot-password");
});

test("shows the market announcement as the game writes it, with its fee and refund", () => {
  render(<NewsBody id="market-announcements" />);

  expect(
    screen.getByText(/\[Market\] your character sells the item/),
  ).toBeInTheDocument();
  expect(screen.getByText(/on top of the listing/)).toHaveTextContent(
    "3 credits, on top of the listing.",
  );
  expect(
    screen.getByText(/the credits come straight back/),
  ).toBeInTheDocument();
  expect(screen.getByText(/No credits yet/)).toHaveTextContent(
    "Davias town or the Arena",
  );
  expect(screen.getByRole("link", { name: "Sell an item" })).toHaveAttribute(
    "href",
    "/user-panel/market/sell",
  );
});

test("says who can join a party and that a reset takes you out of it", () => {
  render(<NewsBody id="party-experience" />);

  expect(screen.getByText("Who can join.").closest("p")).toHaveTextContent(
    "close to the level of every member already in it",
  );
  expect(screen.getByText("After a reset.").closest("p")).toHaveTextContent(
    "A reset or a grand reset always takes you out of your party",
  );
});

test("gives no figures in the new summaries: the site's limits may change", () => {
  for (const id of ["forgot-password", "market-announcements"]) {
    expect(NEWS.find((item) => item.id === id)?.summary).not.toMatch(/\d/);
  }
});

test("walks a couple through the wedding, with the price, the experience and /divorce", () => {
  render(<NewsBody id="marriage" />);

  expect(screen.getAllByRole("listitem")).toHaveLength(4);
  expect(screen.getByText(/On her yes/)).toHaveTextContent(
    "excellent Ring of Ice or Ring of Poison from the inventory and 50,000,000 zen.",
  );
  expect(screen.getByText(/seconds to answer/)).toHaveTextContent(
    "She has 60 seconds to answer with /marry yes or /marry no.",
  );
  expect(
    screen.getByText("More experience together.").closest("p"),
  ).toHaveTextContent(
    "the one who hit it gets their experience as usual plus 30% more from the marriage, and the other one gets the 30% even without hitting.",
  );
  expect(
    screen.getByText("More experience together.").closest("p"),
  ).toHaveTextContent(
    "If you both fight, each gets their own share plus the 30%.",
  );
  expect(
    screen.getByText("More experience together.").closest("p"),
  ).toHaveTextContent("the party's bonus plus another 30%.");
  expect(
    screen.getByText("If it does not work out.").closest("p"),
  ).toHaveTextContent("has to wait 7 days before marrying again");
});

test("gives no figures in the marriage summary: the server's settings may change", () => {
  expect(NEWS.find((item) => item.id === "marriage")?.summary).not.toMatch(
    /\d/,
  );
});
