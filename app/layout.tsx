import Footer from "@/components/footer";
import Header from "@/components/header";
import { BRAND } from "@/constants/app";
import type { Metadata } from "next";
import { Cinzel, Raleway } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${BRAND} - Season 0.97d`,
  description: `Welcome to ${BRAND} - The ultimate MU Online 0.97d private server experience. Join the adventure today!`,
  keywords: ["mu online", "private server", "0.97d", "mmorpg", BRAND],
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
        <div className="page-background" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
