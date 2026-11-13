import { openReleaseFile } from "@/lib/launcher/release-files";
import { MANIFEST_FILE, patchFileParts } from "@/lib/launcher/release-paths";

type Context = { params: Promise<{ path: string[] }> };

/**
 * The launcher's update files: the manifest, its signature and the chunks. A chunk never changes
 * under its name (its SHA-256), so it is cached for good; the manifest and the signature never.
 */
export const GET = async (_request: Request, { params }: Context) => {
  const parts = patchFileParts((await params).path);
  const file = parts ? await openReleaseFile(parts) : null;
  if (!parts || !file) return new Response("Not found", { status: 404 });

  const isChunk = parts[1] === "chunks";
  return new Response(file.body, {
    headers: {
      "Content-Type":
        parts[1] === MANIFEST_FILE
          ? "application/json"
          : isChunk
            ? "application/octet-stream"
            : "text/plain; charset=utf-8",
      "Content-Length": String(file.size),
      "Cache-Control": isChunk
        ? "public, max-age=31536000, immutable"
        : "no-cache",
    },
  });
};
