import { openReleaseFile } from "@/lib/launcher/release-files";
import {
  isLauncherSystem,
  LAUNCHER_FILES,
  launcherFileParts,
} from "@/lib/launcher/release-paths";

type Context = { params: Promise<{ system: string; file: string }> };

/** The published launcher of a system, for the downloads page's buttons. */
export const GET = async (_request: Request, { params }: Context) => {
  const { system, file } = await params;
  if (!isLauncherSystem(system) || file !== LAUNCHER_FILES[system]) {
    return new Response("Not found", { status: 404 });
  }

  const launcher = await openReleaseFile(launcherFileParts(system));
  if (!launcher) return new Response("Not found", { status: 404 });

  return new Response(launcher.body, {
    headers: {
      "Content-Type":
        system === "macos" ? "application/zip" : "application/octet-stream",
      "Content-Length": String(launcher.size),
      "Content-Disposition": `attachment; filename="${file}"`,
      // A new release replaces it under the same address.
      "Cache-Control": "no-cache",
    },
  });
};
