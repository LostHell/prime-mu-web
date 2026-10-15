import DownloadsContent from "@/app/downloads/_components/downloads-content";
import { CLIENTS } from "@/app/downloads/_constants/clients";
import PageHero from "@/components/page-hero";
import PageLayout from "@/components/page-layout";
import { BRAND } from "@/constants/app";
import { getServerStatus } from "@/lib/queries/get-server-status";
import { formatServerLiveNote } from "@/lib/utils/dates";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Downloads",
  description: `Download the ${BRAND} client for Windows or macOS.`,
  alternates: { canonical: "/downloads" },
};

const DownloadPage = async () => {
  const { status } = await getServerStatus();
  const clients = CLIENTS;

  return (
    <>
      <PageHero
        label="Downloads"
        title="Download the client"
        description="Get the client. Join the fight."
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
