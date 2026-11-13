import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { zstdCompressSync } from "node:zlib";

/** A publisher's key pair, as mu-publish makes one: the public key in hex, a signer for manifests. */
export const makePublisher = () => {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const x = publicKey.export({ format: "jwk" }).x ?? "";
  return {
    publicKeyHex: Buffer.from(x, "base64url").toString("hex"),
    sign: (bytes: Uint8Array) => sign(null, bytes, privateKey).toString("hex"),
  };
};

export const sha256Hex = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex");

/** A chunk as mu-publish makes it: its name (SHA-256 of the bytes) and the zstd-packed bytes. */
export const makeChunk = (content: string) => {
  const bytes = Buffer.from(content);
  return { name: sha256Hex(bytes), packed: zstdCompressSync(bytes), bytes };
};

/** An empty release folder as LAUNCHER_FILES_DIR for the test; `remove` it afterwards. */
export const useReleaseDir = async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "prime-mu-release-"));
  const previous = process.env.LAUNCHER_FILES_DIR;
  process.env.LAUNCHER_FILES_DIR = dir;
  return {
    dir,
    remove: async () => {
      if (previous === undefined) delete process.env.LAUNCHER_FILES_DIR;
      else process.env.LAUNCHER_FILES_DIR = previous;
      await rm(dir, { recursive: true, force: true });
    },
  };
};
