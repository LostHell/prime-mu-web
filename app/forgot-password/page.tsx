import { auth } from "@/auth";
import { ForgotPasswordForm } from "@/app/forgot-password/_components/forgot-password-form";
import PageLayout from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { BRAND } from "@/constants/app";
import { PASSWORD_RESET_LINK_MINUTES } from "@/constants/password-reset";
import { openGraphFor } from "@/lib/utils/open-graph";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forgot password",
  description: `Get a link by email to set a new password for your ${BRAND} account.`,
  alternates: { canonical: "/forgot-password" },
  // Kept out of the sitemap and search results, but not out of robots.txt: Google must read the noindex.
  robots: { index: false, follow: true },
  openGraph: openGraphFor("/forgot-password"),
};

const ForgotPasswordPage = async () => {
  // For signed-out visitors only: a signed-in player changes the password on the account page.
  const session = await auth();

  if (session?.user?.id) {
    redirect("/user-panel");
  }

  return (
    <PageLayout variant="auth">
      <Headline className="text-center">
        <Text variant="h1">Forgot password</Text>
        <Text variant="p">
          Enter your username and the account&#39;s email. We send a link to set
          a new password, which works for {PASSWORD_RESET_LINK_MINUTES} minutes.
        </Text>
      </Headline>
      <Card>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
      <p className="text-muted-foreground mt-6 text-center text-sm">
        Remembered it?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Login
        </Link>
      </p>
    </PageLayout>
  );
};

export default ForgotPasswordPage;
