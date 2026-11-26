import { auth } from "@/auth";
import { ResetPasswordForm } from "@/app/reset-password/_components/reset-password-form";
import PageLayout from "@/components/page-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { getPasswordResetAccount } from "@/lib/queries/get-password-reset-account";
import type { SearchParams } from "@/lib/utils/pagination";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Set a new password",
  // A reset link's page: never in search results, and its links are not followed.
  robots: { index: false, follow: false },
};

interface ResetPasswordPageProps {
  searchParams: SearchParams;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  // For signed-out visitors only: a signed-in player changes the password on the account page.
  const session = await auth();

  if (session?.user?.id) {
    redirect("/user-panel");
  }

  const { token } = await searchParams;
  const resetToken = typeof token === "string" ? token : "";
  const account = resetToken ? await getPasswordResetAccount(resetToken) : null;

  return (
    <PageLayout variant="auth">
      <Headline className="text-center">
        <Text variant="h1">Set a new password</Text>
        {account && (
          <Text variant="p">For the account {account.username}.</Text>
        )}
      </Headline>
      <Card>
        <CardContent>
          {account ? (
            <ResetPasswordForm token={resetToken} />
          ) : (
            <Alert variant="destructive">
              <AlertDescription>
                This link has run out or was already used.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <p className="text-muted-foreground mt-6 text-center text-sm">
        Need a new link?{" "}
        <Link href="/forgot-password" className="text-gold hover:underline">
          Forgot password
        </Link>
      </p>
    </PageLayout>
  );
};

export default ResetPasswordPage;
