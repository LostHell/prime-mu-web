import {
  ADMIN_NAMES_TEXT,
  BRAND,
  SERVER_LAUNCH_DATE,
  SERVER_OPEN_DATE,
} from "@/constants/app";
import {
  MARKET_PRICE_TYPES,
  marketPriceLabel,
} from "@/constants/market-prices";
import { eventSchedules } from "@/constants/events";
import {
  MAX_RESETS,
  MIN_RESET_LEVEL,
  MIN_RESET_MONEY,
  POINTS_PER_RESET,
} from "@/constants/resets";
import {
  DROP_RATE,
  EXPERIENCE_RATE,
  MAX_LEVEL,
  MAX_STAT_POINT,
  SERVER_TIME_ZONE,
  VERSION,
} from "@/constants/server";
import { MAP_NAME_BY_ID } from "@/lib/game/constants/maps";
import { describeEvents } from "@/lib/game/events/describe-events";
import { serverConfig } from "@/lib/game/server-config";
import { formatLongDate } from "@/lib/utils/dates";
import { formatNumber } from "@/lib/utils/numbers";

export type FaqItem = {
  question: string;
  /** Plain text: it is also the FAQPage structured data and /llms.txt. */
  answer: string;
  /** Where the answer is covered in full. */
  link?: { href: string; label: string };
};

const { dw, dk, fe, mg } = serverConfig.character.levelUpPoints;

const listWithOr = (items: string[]) =>
  items.length > 1
    ? `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`
    : items.join("");

const eventSummary = describeEvents(eventSchedules.list, MAP_NAME_BY_ID)
  .map((event) => {
    const schedule =
      event.schedule.charAt(0).toLowerCase() + event.schedule.slice(1);
    const details =
      event.details.length > 0 ? ` (${event.details.join("; ")})` : "";
    return `${event.name}: ${schedule}${details}`;
  })
  .join("; ");

/**
 * The site-wide FAQ: the /faq page, its FAQPage structured data and /llms.txt. Every figure comes
 * from the synced server config, so the answers change with the server. Only facts the site
 * already shows: no prices, no promises.
 */
export const SITE_FAQ: FaqItem[] = [
  {
    question: `What is ${BRAND}?`,
    answer: `${BRAND} is a classic MU Online ${VERSION} private server with ${EXPERIENCE_RATE} experience, ${DROP_RATE} drop and a max level of ${formatNumber(MAX_LEVEL)}. It has been open since ${formatLongDate(SERVER_OPEN_DATE)}, with the official launch on ${formatLongDate(SERVER_LAUNCH_DATE)}.`,
    link: { href: "/server-info", label: "All server settings" },
  },
  {
    question: "Is my progress kept at the official launch?",
    answer:
      "The players decide: a temporary poll, which will be announced, lets them vote whether progress continues or the server is wiped at the official launch.",
  },
  {
    question: `How do I start playing ${BRAND}?`,
    answer:
      "Create an account on the website, download the launcher for Windows or macOS, then start the game from the launcher and log in with the same account.",
    link: { href: "/downloads", label: "Download the launcher" },
  },
  {
    question: `Does ${BRAND} run on macOS?`,
    answer:
      "Yes. There is a launcher for macOS as well as for Windows. It installs the game and checks its files on every start, so you always play with the right files.",
    link: { href: "/downloads", label: "Downloads and install help" },
  },
  {
    question: "Which classes can I play?",
    answer: `Dark Wizard, Dark Knight, Fairy Elf and Magic Gladiator. Dark Wizard, Dark Knight and Fairy Elf get ${dw === dk && dk === fe ? `${dw} points` : `${dw}, ${dk} and ${fe} points`} per level, Magic Gladiator gets ${mg}. A stat goes up to ${formatNumber(MAX_STAT_POINT)}.`,
  },
  {
    question: "How do resets work?",
    answer: `A character can reset at level ${formatNumber(MIN_RESET_LEVEL)}, up to ${formatNumber(MAX_RESETS)} times. Each reset gives ${formatNumber(POINTS_PER_RESET)} points and returns the character to its class starting level. The first reset costs ${formatNumber(MIN_RESET_MONEY)} zen and the cost rises with each reset. You can reset and assign the points on the website.`,
    link: { href: "/server-info#resets", label: "Reset settings" },
  },
  {
    question: "When are the events?",
    answer: `All times are ${SERVER_TIME_ZONE}. ${eventSummary}.`,
    link: { href: "/server-info#events", label: "Event schedule" },
  },
  {
    question: "Can I trade items on the website?",
    answer: `Yes. On the market you list items from your warehouse and buy items from other players. A listing can be priced in ${listWithOr(MARKET_PRICE_TYPES.map(marketPriceLabel))}.`,
  },
  {
    question: "How do I clear my PK status?",
    answer: `On the website, or with the /pkclear command in the game, for ${formatNumber(serverConfig.pkClear.moneyPerKill)} zen per kill.`,
  },
  {
    question: "Where can I see the rankings?",
    answer:
      "The rankings list players by resets and level, guilds by score, the players online now, and the Blood Castle and Devil Square scores.",
    link: { href: "/rankings", label: "Rankings" },
  },
  {
    question: `Who are the admins of ${BRAND}?`,
    answer: `Only ${ADMIN_NAMES_TEXT}. Anyone else who says they are an admin is not one, and the staff will never ask for your password.`,
    link: { href: "/rules#conduct", label: "Server rules" },
  },
];
