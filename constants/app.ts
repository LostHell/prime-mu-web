export const BRAND = "Black MU";

/** Day the server opened for registration and play: 11 October 2026, as a UTC calendar date. */
export const SERVER_OPEN_DATE = new Date(Date.UTC(2026, 9, 11));

/** Day of the official launch: 20 December 2026, as a UTC calendar date. The server is open before it. */
export const SERVER_LAUNCH_DATE = new Date(Date.UTC(2026, 11, 20));

/** Frame rate the public site can cite for the game client. */
export const CLIENT_FPS = 165;

/**
 * Email address players write to about their account and personal data (privacy requests, account
 * deletion). While it is null, /privacy and /terms stay unlisted and noindex: a privacy policy
 * without a way to reach the team is not complete. Set it to publish them.
 */
export const LEGAL_CONTACT: string | null = null;
