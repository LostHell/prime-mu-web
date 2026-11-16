import EventTimersBar from "@/components/event-timers-bar";
import Header from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { BRAND } from "@/constants/app";
import { SITE_DESCRIPTION, VERSION } from "@/constants/server";
import { SITE_OPEN_GRAPH } from "@/lib/utils/open-graph";
import { getSiteUrl } from "@/lib/utils/site-url";
import type { Metadata } from "next";
import { Cinzel, Raleway } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["600", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${BRAND} | ${VERSION} MU Online private server`,
    template: `%s | ${BRAND}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["mu online", "private server", "0.97d", "mmorpg", BRAND],
  openGraph: SITE_OPEN_GRAPH,
  twitter: {
    card: "summary_large_image",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${raleway.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-screen font-sans antialiased">
        <Header />
        <EventTimersBar />
        <main>{children}</main>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
