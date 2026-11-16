import { NewsBody } from "@/app/_components/news-body";
import { NEWS_FEED_ALTERNATE } from "@/app/_constants/news-feed";
import { getNewsArticleJsonLd } from "@/app/news/_json-ld/article";
import { JsonLd } from "@/components/json-ld";
import PageLayout from "@/components/page-layout";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { NEWS } from "@/constants/news";
import { breadcrumbJsonLd } from "@/lib/utils/json-ld";
import { SITE_OPEN_GRAPH } from "@/lib/utils/open-graph";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type NewsPageProps = { params: Promise<{ id: string }> };

const findNews = (id: string) => NEWS.find((item) => item.id === id);

// Only the items in constants/news.ts exist; any other id is a 404.
export const dynamicParams = false;

export const generateStaticParams = () => NEWS.map((item) => ({ id: item.id }));

export const generateMetadata = async ({
  params,
}: NewsPageProps): Promise<Metadata> => {
  const item = findNews((await params).id);
  if (!item) return {};

  const path = `/news/${item.id}`;
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: path, types: NEWS_FEED_ALTERNATE },
    openGraph: {
      ...SITE_OPEN_GRAPH,
      type: "article",
      url: path,
      publishedTime: item.dateTime,
    },
  };
};

const NewsArticlePage = async ({ params }: NewsPageProps) => {
  const item = findNews((await params).id);
  if (!item) notFound();

  return (
    <PageLayout className="max-w-3xl">
      <JsonLd data={getNewsArticleJsonLd(item)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
          { name: item.title },
        ])}
      />
      <p className="text-muted-foreground mb-6 text-sm">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href="/news" className="hover:text-gold">
          News
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">{item.title}</span>
      </p>
      <article>
        <Headline>
          <time
            dateTime={item.dateTime}
            className="text-muted-foreground text-xs tracking-widest uppercase"
          >
            {item.date}
          </time>
          <Text variant="h1">{item.title}</Text>
        </Headline>
        <NewsBody id={item.id} className="text-base" />
      </article>
      <p className="mt-10 text-sm">
        <Link href="/news" className="text-gold underline underline-offset-4">
          All news
        </Link>
      </p>
    </PageLayout>
  );
};

export default NewsArticlePage;
