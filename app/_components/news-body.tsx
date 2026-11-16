import { DEPOSITABLE_ITEMS } from "@/constants/depositable-items";
import type { NewsId } from "@/constants/news";
import { RANKING_PAGE_SIZE } from "@/constants/pagination";
import {
  MAX_RESETS,
  MIN_RESET_LEVEL,
  POINTS_PER_RESET,
} from "@/constants/resets";
import { serverConfig } from "@/lib/game/server-config";
import { cn } from "@/lib/utils";
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

// The text of each news item; its date, title and summary are in constants/news.ts. Every figure
// comes from the server config or the site's limits, so the text follows them.
const bodies: Record<NewsId, ReactNode> = {
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
