import { cookies } from "next/headers";

/** Reads one cookie from the incoming request. Decodes the value so it matches
 * what `setClientCookie` stored. */
export const getServerCookie = async (
  name: string,
): Promise<string | undefined> => {
  const value = (await cookies()).get(name)?.value;
  if (value == null) return undefined;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};
