/** Credits every market listing costs. Taken when the item is listed; a cancelled listing keeps them. */
export const LISTING_FEE_CREDITS = 0;

/**
 * Credits for announcing a listing in the game: a blue line in every online player's chat,
 * "[Market] <seller> sells <item>". On top of LISTING_FEE_CREDITS; given back when the notice
 * cannot be sent.
 */
export const ANNOUNCEMENT_FEE_CREDITS = 3;

/** The announcement's text: who sells what, never the price. */
export const listingNotice = (seller: string, item: string): string =>
  `[Market] ${seller} sells ${item}`;

/** What listing one item costs, with or without the announcement. */
export const listingFeeCredits = (announce: boolean): number =>
  LISTING_FEE_CREDITS + (announce ? ANNOUNCEMENT_FEE_CREDITS : 0);
