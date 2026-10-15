import EventTimersBar from "@/components/event-timers-bar";
import Header from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { BRAND, CLIENT_FPS } from "@/constants/app";
import { DROP_RATE, EXPERIENCE_RATE, VERSION } from "@/constants/server";
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

const description = `${BRAND} is a MU Online ${VERSION} private server with ${EXPERIENCE_RATE} experience and ${DROP_RATE} drop. Windows and macOS. ${CLIENT_FPS}+ FPS.`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${BRAND} | ${VERSION} MU Online private server`,
    template: `%s | ${BRAND}`,
  },
  description,
  keywords: ["mu online", "private server", "0.97d", "mmorpg", BRAND],
  openGraph: {
    type: "website",
    siteName: BRAND,
    locale: "en_US",
    images: [
      {
        url: "/hero-banner.jpg",
        width: 1920,
        height: 1080,
        alt: `${BRAND} castle`,
      },
    ],
  },
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
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
