import ServerInfoGuide from "@/app/server-info/_components/server-info-guide";
import PageHero from "@/components/page-hero";
import PageLayout from "@/components/page-layout";
import { BRAND } from "@/constants/app";
import { VERSION } from "@/constants/server";
import { getServerInfo } from "@/lib/queries/get-server-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Server info",
  description: `Experience, drops, resets, and events on ${BRAND}.`,
  alternates: { canonical: "/server-info" },
};

const ServerInfoPage = async () => {
  const info = await getServerInfo();

  return (
    <>
      <PageHero
        label="Server info"
        title="Server info"
        description="Every setting. No surprises."
        status={info.status}
        statusNote={`Classic ${VERSION}`}
      />
      <PageLayout>
        <ServerInfoGuide
          online={info.online}
          registered={info.registered}
          guilds={info.guilds}
        />
      </PageLayout>
    </>
  );
};

export default ServerInfoPage;
