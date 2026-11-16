import { SITE_FAQ } from "@/app/_constants/site-faq";
import { BRAND, SERVER_LIVE_DATE } from "@/constants/app";
import { eventSchedules } from "@/constants/events";
import { NEWS } from "@/constants/news";
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
  MAX_ONLINE,
  MAX_STAT_POINT,
  SERVER_TIME_ZONE,
  SITE_DESCRIPTION,
  VERSION,
} from "@/constants/server";
import { MAP_NAME_BY_ID } from "@/lib/game/constants/maps";
import { describeEvents } from "@/lib/game/events/describe-events";
import { serverConfig } from "@/lib/game/server-config";
import { formatLongDate } from "@/lib/utils/dates";
import { formatNumber } from "@/lib/utils/numbers";
import { getAbsoluteUrl } from "@/lib/utils/site-url";

const launchDate = formatLongDate(SERVER_LIVE_DATE);

/**
 * /llms.txt (llmstxt.org): what the site says about the server, in plain text with absolute links,
 * for AI assistants and crawlers. Only facts the public pages already show.
 */
export const buildLlmsText = (): string => {
  const { dw, dk, fe, mg } = serverConfig.character.levelUpPoints;
  const link = (title: string, path: string, note?: string) =>
    `- [${title}](${getAbsoluteUrl(path)})${note ? `: ${note}` : ""}`;

  return [
    `# ${BRAND}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${BRAND} is a classic MU Online ${VERSION} private server, launched on ${launchDate}. The game is installed and kept up to date by the ${BRAND} launcher for Windows and macOS. An account made on the website is the game account.`,
    "",
    "## Server settings",
    "",
    `- Version: ${VERSION} Classic`,
    `- Experience rate: ${EXPERIENCE_RATE}`,
    `- Drop rate: ${DROP_RATE}`,
    `- Max level: ${formatNumber(MAX_LEVEL)}`,
    `- Max online: ${formatNumber(MAX_ONLINE)}`,
    `- Resets: at level ${formatNumber(MIN_RESET_LEVEL)}, ${formatNumber(POINTS_PER_RESET)} points per reset, up to ${formatNumber(MAX_RESETS)} resets. The first reset costs ${formatNumber(MIN_RESET_MONEY)} zen and the cost rises with each reset.`,
    `- Points per level: Dark Wizard ${dw}, Dark Knight ${dk}, Fairy Elf ${fe}, Magic Gladiator ${mg}`,
    `- Stat cap: ${formatNumber(MAX_STAT_POINT)}`,
    "",
    `## Events (${SERVER_TIME_ZONE})`,
    "",
    ...describeEvents(eventSchedules.list, MAP_NAME_BY_ID).map(
      (event) =>
        `- ${event.name}: ${event.schedule} (${[`${event.durationMinutes} min`, ...event.details].join(", ")})`,
    ),
    "",
    "## How to start",
    "",
    link("Create an account", "/register"),
    link(
      "Download the launcher",
      "/downloads",
      "it installs the game and checks the files on every start",
    ),
    "- Start the game from the launcher and log in with the same account.",
    "",
    "## Pages",
    "",
    link(
      "Server info",
      "/server-info",
      "every server setting: rates, resets, character points, economy and the event schedule",
    ),
    link(
      "Player rankings",
      "/rankings",
      "characters ranked by resets, then level",
    ),
    link("Guild rankings", "/rankings?view=guilds"),
    link("Online players", "/rankings?view=online"),
    link(
      "Event rankings",
      "/rankings?view=events",
      "Blood Castle and Devil Square scores",
    ),
    link(
      "Downloads",
      "/downloads",
      "the launcher for Windows and macOS, with install help",
    ),
    link("FAQ", "/faq", "short answers about the server"),
    "",
    "## FAQ",
    "",
    ...SITE_FAQ.flatMap((item) => [
      `### ${item.question}`,
      "",
      item.answer,
      "",
    ]),
    "## News",
    "",
    ...NEWS.map((item) => link(item.title, `/#news-${item.id}`, item.dateTime)),
    "",
    "MU Online is a registered trademark of Webzen Inc.",
    "",
  ].join("\n");
};
