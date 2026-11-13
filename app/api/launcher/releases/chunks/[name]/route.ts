import { MAX_CHUNK_BYTES, storeChunk } from "@/lib/launcher/release-store";
import {
  readBody,
  refuseUpload,
  storeResponse,
} from "@/lib/launcher/upload-auth";

type Context = { params: Promise<{ name: string }> };

// zstd adds a little to a chunk that does not pack.
const MAX_PACKED_BYTES = MAX_CHUNK_BYTES + 64 * 1024;

/** Upload, step 2: one chunk (zstd-packed), under the SHA-256 of its unpacked bytes. */
export const PUT = async (request: Request, { params }: Context) => {
  const refused = refuseUpload(request);
  if (refused) return refused;

  const body = await readBody(request, MAX_PACKED_BYTES);
  if (!body) {
    return Response.json({ message: "The chunk is too big." }, { status: 413 });
  }

  return storeResponse(await storeChunk((await params).name, body));
};
