import { missingChunks } from "@/lib/launcher/release-store";
import { refuseUpload } from "@/lib/launcher/upload-auth";
import { missingChunksSchema } from "@/lib/validation/launcher-release";

/** Upload, step 1: which of the release's chunks the site does not have yet. */
export const POST = async (request: Request) => {
  const refused = refuseUpload(request);
  if (refused) return refused;

  const parsed = missingChunksSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json({ message: "Not a chunk list." }, { status: 400 });
  }

  return Response.json({ missing: await missingChunks(parsed.data.chunks) });
};
