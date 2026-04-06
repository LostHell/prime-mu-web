import BloodCastleRanking from "@/app/_components/blood-castle-ranking";
import DevilSquareRanking from "@/app/_components/devil-square-ranking";
import LastDisconnected from "@/app/_components/last-disconnected";
import ServerInfoGrid from "@/app/_components/server-info-grid";
import { getServerInfo } from "@/app/_lib/get-server-info";
import Divider from "@/components/divider";
import Hero from "@/components/hero";
import ServerInfo from "@/components/server-info";

const Home = async () => {
  const serverInfo = await getServerInfo();

  return (
    <>
      <Hero />

      <ServerInfo serverInfo={serverInfo} />

      <Divider />

      <ServerInfoGrid />

      <Divider />

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <DevilSquareRanking />
            <BloodCastleRanking />
          </div>
        </div>
      </section>

      <Divider />

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-title text-center mb-8">Last Disconnected Players</h2>
          <LastDisconnected />
        </div>
      </section>

      <Divider />
    </>
  );
};

export default Home;
