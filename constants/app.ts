export const BRAND = "Black MU";

/** Day the server is officially live: 11 October 2026, as a UTC calendar date. */
export const SERVER_LIVE_DATE = new Date(Date.UTC(2026, 9, 11));

/** Frame rate the public site can cite for the game client. */
export const CLIENT_FPS = 165;

/**
 * Email address players write to about their account and personal data (privacy requests, account
 * deletion). While it is null, /privacy and /terms stay unlisted and noindex: a privacy policy
 * without a way to reach the team is not complete. Set it to publish them.
 */
export const LEGAL_CONTACT: string | null = null;
