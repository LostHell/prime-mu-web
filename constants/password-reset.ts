/** How long a password reset link works. */
export const PASSWORD_RESET_LINK_MINUTES = 30;

/** One reset email per account in this time, so nobody can flood a player's mailbox. */
export const PASSWORD_RESET_EMAIL_INTERVAL_MINUTES = 5;

/** Reset requests one address may send in an hour. */
export const PASSWORD_RESET_REQUESTS_PER_HOUR = 10;

/** The answer to every reset request: the same whether or not the account and email match. */
export const PASSWORD_RESET_SENT_MESSAGE =
  "If the username and email match an account, we sent it a link to set a new password. Check your inbox and spam folder.";
