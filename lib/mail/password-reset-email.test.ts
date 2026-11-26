import { passwordResetEmail } from "./password-reset-email";

const link = "https://example.com/reset-password?token=Knight.1.abc";

test("names the account and gives the link as a button and as text, with its time", () => {
  const mail = passwordResetEmail({ username: "Knight", link, minutes: 30 });

  expect(mail.subject).toBe("Black MU: set a new password");
  expect(mail.text).toContain("Knight");
  expect(mail.text).toContain(link);
  expect(mail.text).toContain("30 minutes");
  expect(mail.html).toContain(`href="${link}"`);
  expect(mail.html).toContain(`>${link}</a>`);
  expect(mail.html).toContain("30 minutes");
});

test("escapes the link in the HTML", () => {
  const mail = passwordResetEmail({
    username: "Knight",
    link: 'https://example.com/?a=1&b="x"',
    minutes: 30,
  });

  expect(mail.html).toContain("a=1&amp;b=&quot;x&quot;");
  expect(mail.html).not.toContain('b="x"');
});
