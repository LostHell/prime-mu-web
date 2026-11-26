import { BRAND } from "@/constants/app";

// The site's colours (app/globals.css --background, --card, --foreground, --gold), as hex: mail
// clients do not read CSS variables.
const BACKGROUND = "#0d0f16";
const CARD = "#161822";
const TEXT = "#dedbd3";
const GOLD = "#f2b90d";

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** The email with an account's reset link: a button, and the same link as text under it. */
export const passwordResetEmail = ({
  username,
  link,
  minutes,
}: {
  username: string;
  link: string;
  minutes: number;
}) => {
  const subject = `${BRAND}: set a new password`;
  const text = [
    `Someone asked to set a new password for the ${BRAND} account ${username}.`,
    "",
    `Open this link to choose the new password. It works once, for ${minutes} minutes:`,
    link,
    "",
    "If it was not you, ignore this email: your password stays as it is.",
  ].join("\n");

  const name = escapeHtml(username);
  const href = escapeHtml(link);
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:${BACKGROUND};color:${TEXT};font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;padding:24px;background:${CARD};border-radius:8px;">
      <h1 style="margin:0 0 16px;font-size:20px;color:${GOLD};">${escapeHtml(BRAND)}</h1>
      <p style="margin:0 0 16px;line-height:1.5;">Someone asked to set a new password for the account <strong>${name}</strong>.</p>
      <p style="margin:0 0 24px;line-height:1.5;">The link works once, for ${minutes} minutes.</p>
      <p style="margin:0 0 24px;"><a href="${href}" style="display:inline-block;padding:12px 20px;background:${GOLD};color:${BACKGROUND};text-decoration:none;font-weight:bold;border-radius:6px;">Set a new password</a></p>
      <p style="margin:0 0 8px;font-size:13px;line-height:1.5;">If the button does not work, copy this link into your browser:</p>
      <p style="margin:0 0 24px;font-size:13px;word-break:break-all;"><a href="${href}" style="color:${GOLD};">${href}</a></p>
      <p style="margin:0;font-size:13px;line-height:1.5;">If it was not you, ignore this email: your password stays as it is.</p>
    </div>
  </body>
</html>`;

  return { subject, text, html };
};
