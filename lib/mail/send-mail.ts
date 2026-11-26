import "server-only";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * Sends one email through Resend (RESEND_API_KEY, from MAIL_FROM). Never throws: says whether it
 * went, and logs why not, without the address.
 */
export const sendMail = async (mail: Mail): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.MAIL_FROM?.trim();
  if (!apiKey || !from) {
    console.error("Mail: RESEND_API_KEY or MAIL_FROM is not set");
    return false;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(`Mail: Resend answered HTTP ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Mail: sending failed", error);
    return false;
  }
};
