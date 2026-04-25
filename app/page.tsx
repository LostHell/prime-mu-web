import BloodCastleRanking from "@/components/blood-castle-ranking";
import DevilSquareRanking from "@/components/devil-square-ranking";
import Divider from "@/components/divider";
import Hero from "@/components/hero";
import LastDisconnected from "@/components/last-disconnected";
import ServerInfo from "@/components/server-info";
import ServerInfoGrid from "@/components/server-info-grid";
import { getServerInfo } from "@/lib/queries/get-server-info";

const Home = async () => {
  const serverInfo = await getServerInfo();

  return (
    <>
      <Hero serverStatus={serverInfo.status} />

      <ServerInfo serverInfo={serverInfo} />

      <Divider />

      <ServerInfoGrid />

      <Divider />

      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <DevilSquareRanking />
            <BloodCastleRanking />
          </div>
        </div>
      </section>

      <Divider />

      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="section-title mb-8 text-center">
            Last Disconnected Players
          </h2>
          <LastDisconnected />
        </div>
      </section>

      <Divider />
    </>
  );
};

export default Home;
