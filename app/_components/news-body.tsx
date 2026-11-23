import {
  BRAND,
  CLIENT_FPS,
  SERVER_LAUNCH_DATE,
  SERVER_OPEN_DATE,
} from "@/constants/app";
import { DEPOSITABLE_ITEMS } from "@/constants/depositable-items";
import type { NewsId } from "@/constants/news";
import { RANKING_PAGE_SIZE } from "@/constants/pagination";
import {
  MAX_RESETS,
  MIN_RESET_LEVEL,
  POINTS_PER_RESET,
} from "@/constants/resets";
import { VERSION } from "@/constants/server";
import { AFK_CREDIT_ZONES } from "@/lib/game/constants/afk-credits";
import { serverConfig } from "@/lib/game/server-config";
import { cn } from "@/lib/utils";
import { formatLongDate } from "@/lib/utils/dates";
import { formatNumber } from "@/lib/utils/numbers";
import {
  MAX_LISTING_ITEM_PRICE,
  MAX_LISTING_ZEN_PRICE,
} from "@/lib/validation/listing-price-limits";
import Link from "next/link";
import type { ReactNode } from "react";

const bodyClassName =
  "text-muted-foreground space-y-3 leading-relaxed [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5";

const resetTable = serverConfig.reset.table;
const firstResetCost = resetTable[0]?.money ?? 0;
const lastResetCost = resetTable[resetTable.length - 1]?.money ?? 0;
const itemCurrencies = Object.values(DEPOSITABLE_ITEMS)
  .map((item) => item.label)
  .filter((label) => label !== "Zen");
const itemCurrencyList =
  itemCurrencies.length > 1
    ? `${itemCurrencies.slice(0, -1).join(", ")} or ${itemCurrencies[itemCurrencies.length - 1]}`
    : itemCurrencies.join("");

const questWindow = serverConfig.questWindow ?? [];
const questPoints = questWindow
  .flatMap((quest) => quest.rewards)
  .filter((reward) => reward.kind === "points")
  .reduce((sum, reward) => sum + reward.value, 0);

const everyHours = (hours: number) =>
  hours === 1 ? "every hour" : `every ${formatNumber(hours)} hours`;

// The text of each news item; its date, title and summary are in constants/news.ts. Every figure
// comes from the server config or the site's limits, so the text follows them.
const bodies: Record<NewsId, ReactNode> = {
  "afk-credits": (
    <>
      <p>
        Credits are a new currency of {BRAND}. You earn them in the game just by
        staying online in the right place, and spend them on the market.
      </p>
      <p>
        <strong>Earning.</strong> Keep your character online in one of these
        zones:
      </p>
      <ul>
        {AFK_CREDIT_ZONES.map((zone) => (
          <li key={zone.column}>
            <strong>{zone.name}:</strong> 1 credit{" "}
            {everyHours(zone.hoursPerCredit)}.
          </li>
        ))}
      </ul>
      <p>
        The character has to stay inside the zone: leaving it or logging out
        starts the count again. In Davias the zone is the town, where the Move
        list takes you. Credits belong to your account, not to one character.
      </p>
      <p>
        <strong>Spending.</strong> On the market a price can ask for credits
        alone, or together with zen and jewels: the seller decides, and credits
        have no price limit of their own. When you buy, the credits go from your
        account straight to the seller&apos;s.
      </p>
      <p>
        <strong>Your balance</strong> is at the top of Deposits. Credits stay on
        your account: they are not deposited or withdrawn like zen and jewels.
      </p>
      <p>Log out of the game before you list or buy on the market.</p>
      <p>
        <Link href="/user-panel/market">Browse the market</Link> ·{" "}
        <Link href="/user-panel/deposits">See your credits</Link>
      </p>
    </>
  ),
  quests: (
    <>
      <p>
        Press <strong>T</strong> in the game to open the quest window. It holds{" "}
        {formatNumber(questWindow.length)} quests that open one after another:
        finish one and the next is ready.
      </p>
      <p>
        <strong>Starting.</strong> The first quest opens after your class change
        at Sebina the Priest in Davias; a Magic Gladiator needs one reset
        instead.
      </p>
      <p>
        <strong>Playing.</strong> Accept the quest in the window and slay the
        monsters it asks for. In a party, the kills near you count for you too.
        When the quest is done the game tells you: open the window again and
        press Claim reward.
      </p>
      <p>
        <strong>Rewards.</strong> Jewels of Bless, Soul, Life and Chaos, Boxes
        of Kundun, zen and {formatNumber(questPoints)} level-up points in all.
        The points stay with your character after every reset, in the game and
        on the website. Items go to your inventory, so make room before you
        claim them.
      </p>
      <p>
        <Link href="/server-info#quests">
          Every quest with its monsters, their maps and its rewards
        </Link>
      </p>
    </>
  ),
  "game-keys": (
    <>
      <p>Update the game through the launcher, then try these keys.</p>
      <p>
        <strong>Windows</strong>
      </p>
      <ul>
        <li>
          <strong>T:</strong> the quest window.
        </li>
        <li>
          <strong>M:</strong> the Move list. Pick a map to travel there.
        </li>
        <li>
          <strong>H:</strong> the Event Timer, with the next events and how long
          until they start.
        </li>
        <li>
          <strong>Tab:</strong> the map of the area you are in.
        </li>
      </ul>
      <p>M, H and Tab close the windows on the right side to make room.</p>
      <p>
        <strong>Playing</strong>
      </p>
      <ul>
        <li>
          <strong>F9:</strong> autoclick. Your character keeps using the skill
          you have chosen where the cursor points, until you press F9 again.
        </li>
        <li>
          <strong>F10:</strong> the 3D camera. Hold the middle mouse button to
          turn it; the mouse wheel zooms in and out.
        </li>
        <li>
          <strong>F11:</strong> the camera back to normal.
        </li>
        <li>
          <strong>F12:</strong> hides the game. On Windows it goes to an icon
          next to the clock: click the icon to bring it back. On a Mac it goes
          to the Dock.
        </li>
        <li>
          <strong>Alt+Enter:</strong> full screen or a window.
        </li>
      </ul>
      <p>
        <strong>On a laptop or a Mac</strong> the F keys often change the
        brightness or the sound instead: hold <strong>Fn</strong> while you
        press them, for example Fn+F9.
      </p>
    </>
  ),
  "official-launch": (
    <>
      <p>
        {BRAND} has been open since {formatLongDate(SERVER_OPEN_DATE)}: you can
        register and play right now. The official launch of the server is on{" "}
        <strong>{formatLongDate(SERVER_LAUNCH_DATE)}</strong>.
      </p>
      <p>
        <strong>What you can do today:</strong>
      </p>
      <ul>
        <li>
          <Link href="/register">Create your account</Link>. The account you
          make on the website is your game account.
        </li>
        <li>
          Download the launcher for Windows or macOS from{" "}
          <Link href="/downloads">Downloads</Link>. It installs the game and
          checks its files on every start.
        </li>
        <li>
          Play the four classes, reset your characters and take part in Blood
          Castle and Devil Square.
        </li>
        <li>
          In the user panel: reset, add stats, clear PK, deposit zen and jewels,
          and buy or sell items on the market.
        </li>
        <li>
          Follow the <Link href="/rankings">rankings</Link>: players, guilds,
          who is online and the event scores.
        </li>
      </ul>
      <p>
        <strong>Your progress at the launch.</strong> The players decide whether
        progress continues after the official launch or the server is wiped: a
        temporary poll will let you vote. It will be announced.
      </p>
      <p>
        The rates, resets and the event schedule are on{" "}
        <Link href="/server-info">Server info</Link>.
      </p>
    </>
  ),
  "play-mu-online-on-mac": (
    <>
      <p>
        {BRAND} runs on macOS with its own launcher, just like on Windows. The
        launcher installs the MU Online {VERSION} client and keeps it up to
        date, so there are no patches to download by hand. It is tested on Macs
        with Apple Silicon (M1 to M4). Here is how to get from zero to in-game
        on a Mac.
      </p>
      <ol>
        <li>
          <strong>Create your account.</strong> Register on the{" "}
          <Link href="/register">registration page</Link>. The account you make
          on the website is your game account.
        </li>
        <li>
          <strong>Download the launcher.</strong> On{" "}
          <Link href="/downloads">Downloads</Link>, press Download macOS. You
          get MU.zip; the page shows its size and how much the game takes once
          installed.
        </li>
        <li>
          <strong>Install it.</strong> Unzip MU.zip and move MU to your
          Applications folder.
        </li>
        <li>
          <strong>Open it the first time.</strong> Right-click (or
          Control-click) MU in Applications, choose Open, then Open again. If
          macOS still refuses (&ldquo;cannot be opened&rdquo; or &ldquo;Apple
          could not verify&hellip;&rdquo;), go to System Settings &rarr; Privacy
          &amp; Security, scroll down to the message about MU, click Open Anyway
          and confirm. After that, open it as any other app.
        </li>
        <li>
          <strong>Let it install the game.</strong> The launcher puts the game
          in your user&apos;s Application Support folder. It checks the files on
          every start and downloads only what is missing or changed.
        </li>
        <li>
          <strong>Play.</strong> When the launcher says it is ready, press Start
          game, then log in with the account from step 1.
        </li>
      </ol>
      <p>
        <strong>Tip:</strong> the game reaches {CLIENT_FPS}+ FPS on a Mac too,
        but its default FPS limit is lower: raise it in the game options.
      </p>
      <p>
        The rates, resets and events are on{" "}
        <Link href="/server-info">Server info</Link>, and short answers to
        common questions are in the <Link href="/faq">FAQ</Link>.
      </p>
    </>
  ),
  marketplace: (
    <>
      <p>
        The market is open in the user panel. Put gear from your warehouse up
        for sale and buy what other players list, without having to meet in the
        game.
      </p>
      <p>
        <strong>Selling.</strong> On Sell, pick an item from your warehouse and
        set its price. A price can combine Zen (up to{" "}
        {formatNumber(MAX_LISTING_ZEN_PRICE)}) with {itemCurrencyList} (up to{" "}
        {formatNumber(MAX_LISTING_ITEM_PRICE)} of each). The item leaves your
        warehouse while it is listed; cancel the listing under Listed and it
        comes back.
      </p>
      <p>
        <strong>Buying.</strong> Purchases are paid from your deposits: on
        Deposits, move zen, Rena and jewels from your warehouse to your balance
        on the site; Withdraw moves them back. When you buy, the item goes
        straight to your warehouse and the payment to the seller&apos;s
        deposits. You cannot buy your own listing.
      </p>
      <p>
        <strong>History.</strong> Bought and Sold list every trade you made.
      </p>
      <p>
        Log out of the game before you list, buy, cancel, deposit or withdraw:
        the site changes your warehouse only while your account is offline.
      </p>
      <p>
        <Link href="/user-panel/market">Browse the market</Link>
      </p>
    </>
  ),
  resets: (
    <>
      <p>
        A character that reaches level {formatNumber(MIN_RESET_LEVEL)} can now
        reset on the website, under Reset in the user panel, up to{" "}
        {formatNumber(MAX_RESETS)} times.
      </p>
      <p>
        <strong>What a reset does.</strong> The character goes back to its class
        starting level and map, and its stats return to the class defaults.
        Every point it has earned comes back free to assign:{" "}
        {formatNumber(POINTS_PER_RESET)} for each reset so far, plus the points
        from quests and fruits.
      </p>
      <p>
        <strong>The cost.</strong> The zen is taken from the character. The
        first reset costs {formatNumber(firstResetCost)} zen, and the cost rises
        with each reset, up to {formatNumber(lastResetCost)} for the last one.
      </p>
      <p>
        <strong>Before you reset,</strong> log out of the game and take off all
        equipped items: move them to the inventory.
      </p>
      <p>
        Then assign the free points to strength, agility, vitality and energy on{" "}
        <Link href="/user-panel/add-stats">Add stats</Link>, also while logged
        out of the game.
      </p>
    </>
  ),
  rankings: (
    <>
      <p>
        The <Link href="/rankings">rankings</Link> show who leads the server.
        They have four tabs:
      </p>
      <ul>
        <li>
          <strong>Players:</strong> every character ranked by resets, then
          level, {RANKING_PAGE_SIZE} per page, with the top three on the podium.
          Search by name or filter by class; the status column shows who is
          online.
        </li>
        <li>
          <strong>Guilds:</strong> ranked by score, with each guild&apos;s
          master and member count.
        </li>
        <li>
          <strong>Online players:</strong> who is in the game right now, in the
          same order.
        </li>
        <li>
          <strong>Events:</strong> the best Blood Castle and Devil Square
          scores, with a countdown to the next event.
        </li>
      </ul>
    </>
  ),
};

/** The full text of a news item, for its own page. */
export const NewsBody = ({
  id,
  className,
}: {
  id: NewsId;
  className?: string;
}) => {
  return <div className={cn(bodyClassName, className)}>{bodies[id]}</div>;
};
