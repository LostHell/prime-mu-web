import "server-only";

import { createPublicKey, verify } from "node:crypto";

// An Ed25519 public key's DER (SubjectPublicKeyInfo) before its 32 raw bytes.
const ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");

const HEX_KEY = /^[0-9a-f]{64}$/;
const HEX_SIGNATURE = /^[0-9a-f]{128}$/;

/**
 * Whether `signatureText` (manifest.sig: 64 bytes in hex) is the Ed25519 signature of exactly
 * `manifest`'s bytes by `publicKeyHex` (the publisher's public key, 32 bytes in hex). The launchers
 * check the same and refuse a release that is not.
 */
export const isManifestSignedBy = (
  manifest: Uint8Array,
  signatureText: string,
  publicKeyHex: string,
) => {
  const key = publicKeyHex.trim().toLowerCase();
  const signature = signatureText.trim().toLowerCase();
  if (!HEX_KEY.test(key) || !HEX_SIGNATURE.test(signature)) return false;

  const publicKey = createPublicKey({
    key: Buffer.concat([ED25519_SPKI_PREFIX, Buffer.from(key, "hex")]),
    format: "der",
    type: "spki",
  });
  return verify(null, manifest, publicKey, Buffer.from(signature, "hex"));
};
