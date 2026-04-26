import BloodCastleRanking from "@/components/blood-castle-ranking";
import DevilSquareRanking from "@/components/devil-square-ranking";
import Divider from "@/components/divider";
import Hero from "@/components/hero";
import LastDisconnected from "@/components/last-disconnected";
import PageLayout from "@/components/page-layout";
import ServerInfo from "@/components/server-info";
import ServerInfoGrid from "@/components/server-info-grid";

const Home = async () => {
  return ( 
    <PageLayout>
      <Hero />
      <ServerInfo />
      <Divider />
      <ServerInfoGrid />
      <Divider />
      <div className="grid gap-6 md:grid-cols-2">
        <DevilSquareRanking />
        <BloodCastleRanking />
      </div>
      <Divider />
      <LastDisconnected />
    </PageLayout>
  );
};

export default Home;
