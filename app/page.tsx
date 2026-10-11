import HomeHero from "@/app/_components/home-hero";
import HomeNews from "@/app/_components/home-news";
import StartPlaying from "@/app/_components/start-playing";
import TopPlayers from "@/app/_components/top-players";
import TradeShowcase from "@/app/_components/trade-showcase";
import PageLayout from "@/components/page-layout";

const Home = () => {
  return (
    <>
      <HomeHero />
      <PageLayout className="flex flex-col gap-10 pt-8 pb-16">
        <HomeNews />
        <StartPlaying />
        <TradeShowcase />
        <TopPlayers />
      </PageLayout>
    </>
  );
};

export default Home;
