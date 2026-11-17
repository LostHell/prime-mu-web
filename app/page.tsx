import HomeHero from "@/app/_components/home-hero";
import { NEWS_FEED_ALTERNATE } from "@/app/_constants/news-feed";
import { getSiteJsonLd } from "@/app/_json-ld/site";
import HomeNews from "@/app/_components/home-news";
import StartPlaying from "@/app/_components/start-playing";
import TopPlayers from "@/app/_components/top-players";
import TradeShowcase from "@/app/_components/trade-showcase";
import { JsonLd } from "@/components/json-ld";
import PageLayout from "@/components/page-layout";
import { openGraphFor } from "@/lib/utils/open-graph";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/", types: NEWS_FEED_ALTERNATE },
  openGraph: openGraphFor("/"),
};

const Home = () => {
  return (
    <>
      <JsonLd data={getSiteJsonLd()} />
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
