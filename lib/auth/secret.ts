import "server-only";

/** Auth.js's AUTH_SECRET, which also signs the password reset links and the session's password stamp. */
export const getAuthSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
};
