import { createHash, timingSafeEqual } from "node:crypto";
import { serverConfig } from "@/lib/game/server-config";
import { MD5_KEYVAL } from "./md5-keyval";

/**
 * How MEMB_INFO.memb__pwd is stored, matching JoinServer.ini MD5Encryption
 * (synced as serverConfig.account.md5Encryption). The kayitoEditor uses the
 * same encodings.
 */
export const PASSWORD_ENCRYPTION = {
  /** The password bytes themselves. */
  none: 0,
  /** MD5 started from an initial state picked by the account name. */
  webzen: 1,
  /** Standard MD5. */
  default: 2,
} as const;

/** MakeAccountKey from the JoinServer's Util.cpp: the Webzen key index (0-255). */
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

const SHIFT = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
  9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
  16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15,
  21,
];
const SINE = Array.from(
  { length: 64 },
  (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0,
);

/** MD5 started from the JoinServer's MD5_KEYVAL state for keyIndex. */
const webzenDigest = (input: Buffer, keyIndex: number): Buffer => {
  let a0 = MD5_KEYVAL[keyIndex * 4];
  let b0 = MD5_KEYVAL[keyIndex * 4 + 1];
  let c0 = MD5_KEYVAL[keyIndex * 4 + 2];
  let d0 = MD5_KEYVAL[keyIndex * 4 + 3];

  const length = (Math.floor((input.length + 8) / 64) + 1) * 64;
  const message = Buffer.alloc(length);
  input.copy(message);
  message[input.length] = 0x80;
  message.writeBigUInt64LE(BigInt(input.length * 8), length - 8);

  for (let block = 0; block < length; block += 64) {
    const words = Array.from({ length: 16 }, (_, i) =>
      message.readUInt32LE(block + i * 4),
    );
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;
    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }
      f = (f + a + SINE[i] + words[g]) >>> 0;
      a = d;
      d = c;
      c = b;
      b = (b + ((f << SHIFT[i]) | (f >>> (32 - SHIFT[i])))) >>> 0;
    }
    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const digest = Buffer.alloc(16);
  [a0, b0, c0, d0].forEach((word, i) => digest.writeUInt32LE(word, i * 4));
  return digest;
};

/** The memb__pwd value for a password, in the server's encryption mode. */
export const encodePassword = (
  account: string,
  password: string,
  mode: number = serverConfig.account.md5Encryption,
): Uint8Array<ArrayBuffer> => {
  const input = Buffer.from(password, "utf8");
  let encoded: Buffer;
  switch (mode) {
    case PASSWORD_ENCRYPTION.none:
      encoded = input;
      break;
    case PASSWORD_ENCRYPTION.webzen:
      encoded = webzenDigest(input, makeAccountKey(account));
      break;
    case PASSWORD_ENCRYPTION.default:
      encoded = createHash("md5").update(input).digest();
      break;
    default:
      throw new Error(`Unsupported MD5Encryption mode: ${mode}`);
  }
  return new Uint8Array(encoded);
};

/** Whether password matches the stored memb__pwd, in constant time. */
export const verifyPassword = (
  account: string,
  password: string,
  stored: Uint8Array,
  mode: number = serverConfig.account.md5Encryption,
): boolean => {
  const expected = encodePassword(account, password, mode);
  return stored.length === expected.length && timingSafeEqual(stored, expected);
};
