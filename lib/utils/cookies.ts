export type ClientCookieOptions = {
  path?: string;
  maxAge?: number;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
};

const DEFAULT_PATH = "/";
const DEFAULT_SAME_SITE: NonNullable<ClientCookieOptions["sameSite"]> = "Lax";

/** Builds a `document.cookie` assignment. Values are encoded so names with
 * spaces or reserved characters round-trip. */
export const serializeClientCookie = (
  name: string,
  value: string,
  options: ClientCookieOptions = {},
): string => {
  const segments = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `Path=${options.path ?? DEFAULT_PATH}`,
    `SameSite=${options.sameSite ?? DEFAULT_SAME_SITE}`,
  ];

  if (options.maxAge != null) {
    segments.push(`Max-Age=${options.maxAge}`);
  }

  const secure =
    options.secure ??
    (typeof window !== "undefined" && window.location.protocol === "https:");

  if (secure) {
    segments.push("Secure");
  }

  return segments.join("; ");
};

export const setClientCookie = (
  name: string,
  value: string,
  options?: ClientCookieOptions,
): void => {
  document.cookie = serializeClientCookie(name, value, options);
};

export const deleteClientCookie = (
  name: string,
  options?: Pick<ClientCookieOptions, "path" | "secure" | "sameSite">,
): void => {
  setClientCookie(name, "", { ...options, maxAge: 0 });
};

export const getClientCookie = (name: string): string | undefined => {
  const encodedName = `${encodeURIComponent(name)}=`;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(encodedName));

  if (!match) return undefined;

  const raw = match.slice(encodedName.length);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};
