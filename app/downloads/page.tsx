import DownloadsContent from "@/app/downloads/_components/downloads-content";
import { toDownloadClients } from "@/app/downloads/_utils/download-clients";
import PageHero from "@/components/page-hero";
import PageLayout from "@/components/page-layout";
import { BRAND } from "@/constants/app";
import { getLauncherDownloads } from "@/lib/queries/get-launcher-downloads";
import { getServerStatus } from "@/lib/queries/get-server-status";
import { formatServerLiveNote } from "@/lib/utils/dates";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Downloads",
  description: `Download the ${BRAND} launcher for Windows or macOS.`,
  alternates: { canonical: "/downloads" },
};

const DownloadPage = async () => {
  // The launchers change with every release: read them per request, not at build time.
  await connection();
  const { status } = await getServerStatus();
  const clients = toDownloadClients(await getLauncherDownloads());

  return (
    <>
      <PageHero
        label="Downloads"
        title="Download the launcher"
        description="It installs the game and keeps it up to date. Join the fight."
        status={status}
        statusNote={formatServerLiveNote()}
      />
      <PageLayout>
        <DownloadsContent clients={clients} />
      </PageLayout>
    </>
  );
};

export default DownloadPage;
