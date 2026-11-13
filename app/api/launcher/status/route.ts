import { getLauncherStatus } from "@/lib/queries/get-launcher-status";

/** The servers and the players online, for the game's launcher. */
export const GET = async () => {
  try {
    return Response.json(await getLauncherStatus(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Launcher status failed", error);
    return Response.json(
      { message: "The status is not available." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
};
