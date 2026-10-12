/**
 * MakeAccountKey from the JoinServer's Util.cpp.
 * Webzen password encryption uses this as an index into MD5_KEYVAL (0-255).
 */
export const makeAccountKey = (account: string): number => {
  const name = Buffer.from(account, "utf8");
  let key = 0;
  for (const byte of name) {
    // The JoinServer adds signed chars.
    key += ((byte << 24) >> 24) + 17;
  }
  key += (10 - name.length) * 17;
  return ((key % 256) + 256) % 256;
};
