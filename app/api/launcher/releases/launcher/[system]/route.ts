import { isLauncherSystem } from "@/lib/launcher/release-paths";
import { storeLauncher } from "@/lib/launcher/release-store";
import {
  readBody,
  refuseUpload,
  storeResponse,
} from "@/lib/launcher/upload-auth";

type Context = { params: Promise<{ system: string }> };

const MAX_LAUNCHER_BYTES = 200 * 1024 * 1024;

/** Upload, step 4: the launcher for the downloads page, when it is the published release's. */
export const PUT = async (request: Request, { params }: Context) => {
  const refused = refuseUpload(request);
  if (refused) return refused;

  const { system } = await params;
  if (!isLauncherSystem(system)) {
    return new Response("Not found", { status: 404 });
  }

  const body = await readBody(request, MAX_LAUNCHER_BYTES);
  if (!body) {
    return Response.json(
      { message: "The launcher is too big." },
      { status: 413 },
    );
  }

  return storeResponse(await storeLauncher(system, body));
};
