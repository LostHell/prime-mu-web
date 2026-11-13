/** @jest-environment node */
import { makePublisher } from "@/lib/test-utils/launcher-release";
import { isManifestSignedBy } from "./signature";

const manifest = Buffer.from('{"format":1}');

test("accepts the manifest's signature by the publisher's key, in either case and with a line end", () => {
  const publisher = makePublisher();
  const signature = publisher.sign(manifest);

  expect(isManifestSignedBy(manifest, signature, publisher.publicKeyHex)).toBe(
    true,
  );
  expect(
    isManifestSignedBy(
      manifest,
      `${signature.toUpperCase()}\n`,
      publisher.publicKeyHex,
    ),
  ).toBe(true);
});

test("refuses a changed manifest, another key and text that is not a signature", () => {
  const publisher = makePublisher();
  const signature = publisher.sign(manifest);

  expect(
    isManifestSignedBy(
      Buffer.from('{"format":2}'),
      signature,
      publisher.publicKeyHex,
    ),
  ).toBe(false);
  expect(
    isManifestSignedBy(manifest, signature, makePublisher().publicKeyHex),
  ).toBe(false);
  expect(isManifestSignedBy(manifest, "zz", publisher.publicKeyHex)).toBe(
    false,
  );
  expect(isManifestSignedBy(manifest, signature, "abc")).toBe(false);
});
