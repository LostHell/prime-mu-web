import BloodCastleRanking from "@/app/_components/blood-castle-ranking";
import DevilSquareRanking from "@/app/_components/devil-square-ranking";
import LastDisconnected from "@/app/_components/last-disconnected";
import ServerInfoGrid from "@/app/_components/server-info-grid";
import Divider from "@/components/divider";
import Hero from "@/components/hero";
import ServerInfo from "@/components/server-info";
import SuspenseFallback from "@/components/suspense-fallback";
import { serverInfo } from "@/lib/mock-data";
import { Suspense } from "react";

const Home = async () => {
  return (
    <>
      <Hero />

      <ServerInfo serverInfo={serverInfo} />

      <Divider />

      <ServerInfoGrid />

      <Divider />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Suspense fallback={<SuspenseFallback />}>
              <DevilSquareRanking />
            </Suspense>

            <Suspense fallback={<SuspenseFallback />}>
              <BloodCastleRanking />
            </Suspense>
          </div>
        </div>
      </section>

      <Divider />

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-title text-center mb-8">Last Disconnected Players</h2>
          <Suspense fallback={<SuspenseFallback />}>
            <LastDisconnected />
          </Suspense>
        </div>
      </section>

      <Divider />
    </>
  );
};

export default Home;
