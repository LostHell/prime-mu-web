import DownloadsContent from "@/app/downloads/_components/downloads-content";
import { getGameJsonLd } from "@/app/downloads/_json-ld/game";
import { toDownloadClients } from "@/app/downloads/_utils/download-clients";
import { JsonLd } from "@/components/json-ld";
import PageHero from "@/components/page-hero";
import PageLayout from "@/components/page-layout";
import { BRAND } from "@/constants/app";
import { VERSION } from "@/constants/server";
import { getLauncherDownloads } from "@/lib/queries/get-launcher-downloads";
import { getServerStatus } from "@/lib/queries/get-server-status";
import { formatServerLiveNote } from "@/lib/utils/dates";
import { openGraphFor } from "@/lib/utils/open-graph";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Downloads",
  description: `Download the ${BRAND} launcher for Windows or macOS. It installs the MU Online ${VERSION} client, keeps it up to date and checks the files on every start.`,
  alternates: { canonical: "/downloads" },
  openGraph: openGraphFor("/downloads"),
};

const DownloadPage = async () => {
  // The launchers change with every release: read them per request, not at build time.
  await connection();
  const { status } = await getServerStatus();
  const clients = toDownloadClients(await getLauncherDownloads());

  return (
    <>
      <JsonLd data={getGameJsonLd()} />
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
