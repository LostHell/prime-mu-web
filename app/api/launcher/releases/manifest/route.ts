import { storeManifest } from "@/lib/launcher/release-store";
import {
  getPublisherKey,
  refuseUpload,
  storeResponse,
} from "@/lib/launcher/upload-auth";
import { publishManifestSchema } from "@/lib/validation/launcher-release";

/**
 * Upload, step 3: the release's manifest and signature. From here every launcher updates to it, so
 * it is taken only when the publisher's key signed it and all its chunks are on the site.
 */
export const PUT = async (request: Request) => {
  const refused = refuseUpload(request);
  if (refused) return refused;

  const publicKey = getPublisherKey();
  if (!publicKey) {
    return Response.json(
      { message: "LAUNCHER_PUBLIC_KEY is not set on the site." },
      { status: 503 },
    );
  }

  const parsed = publishManifestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json(
      { message: "Not a manifest upload." },
      { status: 400 },
    );
  }

  return storeResponse(
    await storeManifest(
      Buffer.from(parsed.data.manifest, "base64"),
      parsed.data.signature,
      publicKey,
    ),
  );
};
