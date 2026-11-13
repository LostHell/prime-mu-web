import { isChunkName } from "@/lib/launcher/release-paths";
import { z } from "zod";

/** A release's chunk names, to learn which the site lacks (a client of ~4,000 files has as many). */
export const missingChunksSchema = z.object({
  chunks: z.array(z.string().refine(isChunkName)).max(200_000),
});

/** manifest.json's exact bytes in base64 and manifest.sig's text. */
export const publishManifestSchema = z.object({
  manifest: z.base64().max(64 * 1024 * 1024),
  signature: z.string().max(256),
});

export type MissingChunksInput = z.infer<typeof missingChunksSchema>;
export type PublishManifestInput = z.infer<typeof publishManifestSchema>;
