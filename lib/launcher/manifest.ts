import { z } from "zod";
import { isChunkName } from "./release-paths";

/**
 * The launcher's manifest.json (format 1), as far as the site reads it. The game client's
 * `update/Manifest` is the full definition; unknown fields are ignored here as the launchers do.
 */

const chunkSchema = z.object({
  sha256: z.string().refine(isChunkName),
  size: z.number().int().nonnegative(),
  packed: z.number().int().nonnegative(),
});

const launcherReleaseSchema = z.object({
  version: z.string(),
  file: z.string(),
  size: z.number().int().nonnegative(),
  sha256: z.string().refine(isChunkName),
  chunks: z.array(chunkSchema),
});

const fileSchema = z.object({
  path: z.string(),
  platform: z.string().optional(),
  size: z.number().int().nonnegative(),
  sha256: z.string().refine(isChunkName),
  chunks: z.array(chunkSchema),
});

const manifestSchema = z.object({
  format: z.literal(1),
  version: z.string(),
  launcher: z.record(z.string(), launcherReleaseSchema).optional(),
  files: z.array(fileSchema),
});

export type Manifest = z.infer<typeof manifestSchema>;

/** The manifest in `text`; null when it is not one. */
export const parseManifest = (text: string): Manifest | null => {
  try {
    const parsed = manifestSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

/** Every chunk the release needs: its files' and its launchers'. */
export const referencedChunks = (manifest: Manifest) => {
  const chunks = new Set<string>();
  for (const file of manifest.files) {
    for (const chunk of file.chunks) chunks.add(chunk.sha256);
  }
  for (const release of Object.values(manifest.launcher ?? {})) {
    for (const chunk of release.chunks) chunks.add(chunk.sha256);
  }
  return chunks;
};

/** The bytes the launcher installs on `platform` ("windows-x64", "macos"): the shared files and that system's own. */
export const installBytes = (manifest: Manifest, platform: string) =>
  manifest.files
    .filter((file) => !file.platform || file.platform === platform)
    .reduce((total, file) => total + file.size, 0);
