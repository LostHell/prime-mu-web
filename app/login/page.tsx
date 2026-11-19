import { LoginForm } from "@/app/login/_components/login-form";
import { auth } from "@/auth";
import PageLayout from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { BRAND } from "@/constants/app";
import { openGraphFor } from "@/lib/utils/open-graph";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
  description: `Log in to ${BRAND} with your game account to reset characters, add stats, clear PK, and buy or sell items on the market.`,
  alternates: { canonical: "/login" },
  // Kept out of the sitemap and search results, but not out of robots.txt: Google must read the noindex.
  robots: { index: false, follow: true },
  openGraph: openGraphFor("/login"),
};

const LoginPage = async () => {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/user-panel");
  }

  return (
    <PageLayout variant="auth">
      <Headline className="text-center">
        <Text variant="h1">Login</Text>
        <Text variant="p">Use your existing game account credentials.</Text>
      </Headline>
      <Card>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="text-muted-foreground mt-6 text-center text-sm">
        Don&#39;t have an account yet?{" "}
        <Link href="/register" className="text-gold hover:underline">
          Register
        </Link>
      </p>
    </PageLayout>
  );
};

export default LoginPage;
