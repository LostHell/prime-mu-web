import RegisterForm from "@/app/register/_components/register-form";
import { auth } from "@/auth";
import PageLayout from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import Link from "next/link";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/user-panel");
  }

  return (
    <PageLayout variant="auth">
      <Headline className="text-center">
        <Text variant="h1">Register</Text>
        <Text variant="p">Create a new account using your email address.</Text>
      </Headline>
      <Card>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
      <p className="text-muted-foreground mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Login
        </Link>
      </p>
    </PageLayout>
  );
};

export default RegisterPage;
