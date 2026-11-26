/**
 * @jest-environment node
 */
import { sendMail } from "./send-mail";

const mail = {
  to: "knight@example.com",
  subject: "Subject",
  html: "<p>Hi</p>",
  text: "Hi",
};

const fetchMock = jest.fn();
const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = fetchMock;
  process.env.RESEND_API_KEY = "re_key";
  process.env.MAIL_FROM = "Black MU <no-reply@example.com>";
});

test("sends the mail to Resend with the key and the sender", async () => {
  fetchMock.mockResolvedValue({ ok: true, status: 200 });

  await expect(sendMail(mail)).resolves.toBe(true);

  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toBe("https://api.resend.com/emails");
  expect(init.headers.Authorization).toBe("Bearer re_key");
  expect(JSON.parse(init.body)).toEqual({
    from: "Black MU <no-reply@example.com>",
    to: ["knight@example.com"],
    subject: "Subject",
    html: "<p>Hi</p>",
    text: "Hi",
  });
});

test("sends nothing without the key or the sender", async () => {
  delete process.env.RESEND_API_KEY;

  await expect(sendMail(mail)).resolves.toBe(false);
  expect(fetchMock).not.toHaveBeenCalled();

  process.env.RESEND_API_KEY = "re_key";
  process.env.MAIL_FROM = " ";

  await expect(sendMail(mail)).resolves.toBe(false);
  expect(fetchMock).not.toHaveBeenCalled();
});

test("says it failed, without the address, when Resend refuses or cannot be reached", async () => {
  fetchMock.mockResolvedValueOnce({ ok: false, status: 422 });

  await expect(sendMail(mail)).resolves.toBe(false);

  fetchMock.mockRejectedValueOnce(new Error("offline"));

  await expect(sendMail(mail)).resolves.toBe(false);
  expect(JSON.stringify(errorLog.mock.calls)).not.toContain(
    "knight@example.com",
  );
});
