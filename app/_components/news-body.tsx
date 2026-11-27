import {
  BRAND,
  CLIENT_FPS,
  SERVER_LAUNCH_DATE,
  SERVER_OPEN_DATE,
} from "@/constants/app";
import { DEPOSITABLE_ITEMS } from "@/constants/depositable-items";
import {
  ANNOUNCEMENT_FEE_CREDITS,
  listingNotice,
} from "@/constants/market-fees";
import {
  PASSWORD_RESET_EMAIL_INTERVAL_MINUTES,
  PASSWORD_RESET_LINK_MINUTES,
} from "@/constants/password-reset";
import type { NewsId } from "@/constants/news";
import { RANKING_PAGE_SIZE } from "@/constants/pagination";
import {
  MAX_RESETS,
  MIN_RESET_LEVEL,
  POINTS_PER_RESET,
} from "@/constants/resets";
import { VERSION } from "@/constants/server";
import { AFK_CREDIT_ZONES } from "@/lib/game/constants/afk-credits";
import { MARRIAGE } from "@/lib/game/constants/marriage";
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

const party = serverConfig.party;
// 2 members and up: index 0 is a member with the rest of the party far away. The server's rates are
// in % of the experience alone (125 = a quarter more); the news gives what is added to it (25%).
const partyRows = (party?.experience.oneClass ?? [])
  .map((oneClass, index) => ({
    members: index + 1,
    oneClass: oneClass - 100,
    mixedClasses: (party?.experience.mixedClasses[index] ?? 100) - 100,
  }))
  .slice(1);
const partyAlone = party?.experience.oneClass[0];

const everyHours = (hours: number) =>
  hours === 1 ? "every hour" : `every ${formatNumber(hours)} hours`;

// The text of each news item; its date, title and summary are in constants/news.ts. Every figure
// comes from the server config or the site's limits, so the text follows them.
const bodies: Record<NewsId, ReactNode> = {
  marriage: (
    <>
      <p>
        Wedding bells are ringing in {BRAND}! A Dark Knight, Dark Wizard or
        Magic Gladiator can now marry a Fairy Elf, and the whole server gets to
        hear about it.
      </p>
      <p>
        <strong>How to get married.</strong>
      </p>
      <ol>
        <li>
          Stand together, fewer than {formatNumber(MARRIAGE.maxDistance)} steps
          apart. Neither of you may be married already, and the two characters
          have to be on different accounts.
        </li>
        <li>
          He writes <code>/marry</code> and her name, for example{" "}
          <code>/marry Elfina</code>.
        </li>
        <li>
          She has {formatNumber(MARRIAGE.answerSeconds)} seconds to answer with{" "}
          <code>/marry yes</code> or <code>/marry no</code>.
        </li>
        <li>
          On her yes, each of you pays for the wedding: an{" "}
          <strong>excellent Ring of Ice or Ring of Poison</strong> from the
          inventory and {formatNumber(MARRIAGE.money)} zen. A ring you wear is
          never taken, only one in the inventory. Then a golden message tells
          everyone online that you are married.
        </li>
      </ol>
      <p>
        <strong>More experience together.</strong> When you hunt as a couple
        outside a party and both of you are within{" "}
        {formatNumber(MARRIAGE.maxDistance)} steps of the monster, each of you
        gets {MARRIAGE.experiencePercent - 100}% more experience than alone,
        even the one who did not hit it. In a party together, the two of you get
        the party&apos;s bonus plus another {MARRIAGE.partyBonusPercent}%.
      </p>
      <p>
        <strong>Never far apart.</strong> <code>/tracemarry</code> takes you
        straight to your wife or husband. It goes only to maps you could reach
        with /move, with the same level and other conditions, and never into or
        out of Blood Castle or Devil Square. You also see in the chat when your
        partner comes online or leaves the game.
      </p>
      <p>
        <strong>If it does not work out.</strong> Either of you can end the
        marriage at any time with <code>/divorce</code>, for free. The one who
        uses it has to wait {formatNumber(MARRIAGE.divorceWaitDays)} days before
        marrying again; the other can marry right away.
      </p>
      <p>
        <strong>Good to know.</strong> If a character is deleted and made again
        with the same name but another class, the marriage ends at its next
        login.
      </p>
    </>
  ),
  "forgot-password": (
    <>
      <p>
        It happens to everyone: you come back after a break and the password is
        gone from your head. No need to write to us any more, you can now set a
        new one yourself.
      </p>
      <ol>
        <li>
          On the <Link href="/login">login page</Link>, under the form, click{" "}
          <strong>Forgot your password? Reset it</strong>.
        </li>
        <li>
          Enter your username and the email of your account, the one you gave
          when you registered.
        </li>
        <li>
          Open the email from {BRAND} and click{" "}
          <strong>Set a new password</strong>. If the button does not work, the
          same link is right below it.
        </li>
        <li>Choose your new password, and you are ready to log in.</li>
      </ol>
      <p>
        <strong>Good to know.</strong> The link works for{" "}
        {formatNumber(PASSWORD_RESET_LINK_MINUTES)} minutes and only once. If
        the email is not in your inbox, take a look in the spam folder; you can
        ask for a new one every{" "}
        {formatNumber(PASSWORD_RESET_EMAIL_INTERVAL_MINUTES)} minutes.
      </p>
      <p>
        <strong>Safer account.</strong> A new password, set this way or on the
        account page, logs out every other browser where your account was signed
        in. So if someone else knew your old password, they are out.
      </p>
      <p>
        <Link href="/forgot-password">Reset your password</Link>
      </p>
    </>
  ),
  "market-announcements": (
    <>
      <p>Got something good to sell? Now the whole server can hear about it.</p>
      <p>
        When you list an item on the market, tick{" "}
        <strong>Announce in game</strong>. Every player online at that moment
        sees a blue line in the chat: &ldquo;
        {listingNotice("your character", "the item")}&rdquo;. The price stays on
        the market, so curious buyers come to have a look.
      </p>
      <p>
        <strong>What it costs.</strong> {formatNumber(ANNOUNCEMENT_FEE_CREDITS)}{" "}
        credits, on top of the listing. If the game cannot be reached at that
        moment, your item is still listed and the credits come straight back to
        you.
      </p>
      <p>
        No credits yet? You earn them just by staying online in{" "}
        {AFK_CREDIT_ZONES.map((zone) => zone.name).join(" or ")}, see{" "}
        <Link href="/news/afk-credits">AFK credits</Link>.
      </p>
      <p>
        <Link href="/user-panel/market/sell">Sell an item</Link>
      </p>
    </>
  ),
  "party-experience": (
    <>
      <p>
        Hunting in a party gives more experience than hunting alone. Every
        monster the party kills gives experience to each member on the same map
        {party ? ` within ${formatNumber(party.maxDistance)} steps of it` : ""}.
      </p>
      {partyRows.length > 0 && (
        <>
          <p>
            <strong>How much.</strong> Each member gets this much more
            experience than the monster gives them alone, by how many members
            are near it:
          </p>
          <ul>
            {partyRows.map((row) => (
              <li key={row.members}>
                <strong>{row.members} members:</strong> {row.oneClass}% with one
                class, {row.mixedClasses}% with mixed classes.
              </li>
            ))}
          </ul>
        </>
      )}
      <p>
        <strong>Mixed classes</strong> means the party has more than one class,
        for example a Dark Knight and a Fairy Elf.
      </p>
      <p>
        <strong>Whatever your levels.</strong> Nothing is shared: each member
        gets their own experience, as if they had killed the monster alone, plus
        the party&apos;s bonus. A low level loses nothing by hunting with a high
        level, and the other way round.
      </p>
      {partyAlone !== undefined && (
        <p>
          <strong>Stay close.</strong> If the rest of the party is far from the
          monster, you get only {partyAlone}% of the experience you would get
          alone.
        </p>
      )}
      <p>Happy Hour counts for every member too.</p>
      <p>
        <strong>Who can join.</strong> A party is for players of about the same
        level: to join, your level has to be close to the level of every member
        already in it, not just the leader&apos;s. If it is too far from one of
        them, the game tells you so.
      </p>
      <p>
        <strong>After a reset.</strong> A reset or a grand reset always takes
        you out of your party, so you come back fresh. Your friends just invite
        you again.
      </p>
    </>
  ),
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
