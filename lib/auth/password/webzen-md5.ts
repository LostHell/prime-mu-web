import { MD5_KEYVAL } from "./md5-keyval";

/** Per-round rotate counts from MD5.cpp (S11–S44), each repeated across its 16 steps. */
const SHIFT = [
  ...Array(4).fill([7, 12, 17, 22]).flat(),
  ...Array(4).fill([5, 9, 14, 20]).flat(),
  ...Array(4).fill([4, 11, 16, 23]).flat(),
  ...Array(4).fill([6, 10, 15, 21]).flat(),
];

/** T[i] = floor(2^32 * abs(sin(i))), i = 1..64. Same constants MD5.cpp inlines. */
const SINE = Array.from(
  { length: 64 },
  (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0,
);

/** MD5.cpp F/G/H/I, each called as F(b, c, d). */
const F = (b: number, c: number, d: number) => (b & c) | (~b & d);
const G = (b: number, c: number, d: number) => (d & b) | (~d & c);
const H = (b: number, c: number, d: number) => b ^ c ^ d;
const I = (b: number, c: number, d: number) => c ^ (b | ~d);

const round = (step: number, b: number, c: number, d: number) => {
  if (step < 16) return { f: F(b, c, d), g: step };
  if (step < 32) return { f: G(b, c, d), g: (5 * step + 1) % 16 };
  if (step < 48) return { f: H(b, c, d), g: (3 * step + 5) % 16 };
  return { f: I(b, c, d), g: (7 * step) % 16 };
};

const rotateLeft = (value: number, bits: number) =>
  ((value << bits) | (value >>> (32 - bits))) >>> 0;

const pad = (input: Buffer) => {
  const length = (Math.floor((input.length + 8) / 64) + 1) * 64;
  const message = Buffer.alloc(length);
  input.copy(message);
  message[input.length] = 0x80;
  message.writeBigUInt64LE(BigInt(input.length * 8), length - 8);
  return message;
};

/** MD5_EncodeKeyVal: MD5 started from MD5_KEYVAL[keyIndex], not the standard IV. */
export const webzenDigest = (input: Buffer, keyIndex: number): Buffer => {
  let a0 = MD5_KEYVAL[keyIndex * 4];
  let b0 = MD5_KEYVAL[keyIndex * 4 + 1];
  let c0 = MD5_KEYVAL[keyIndex * 4 + 2];
  let d0 = MD5_KEYVAL[keyIndex * 4 + 3];

  const message = pad(input);
  for (let offset = 0; offset < message.length; offset += 64) {
    const words = Array.from({ length: 16 }, (_, i) =>
      message.readUInt32LE(offset + i * 4),
    );
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;
    for (let step = 0; step < 64; step++) {
      const { f, g } = round(step, b, c, d);
      const mixed = (f + a + SINE[step] + words[g]) >>> 0;
      a = d;
      d = c;
      c = b;
      b = (b + rotateLeft(mixed, SHIFT[step])) >>> 0;
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
