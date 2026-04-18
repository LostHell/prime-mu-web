import LoginForm from "@/app/login/_components/login-form";
import { auth } from "@/auth";
import PageLayout from "@/components/page-layout";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import Link from "next/link";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/user-panel");
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-md px-4">
        <Headline className="text-center">
          <Text variant="h1">Login</Text>
          <Text variant="p">Use your existing game account credentials.</Text>
        </Headline>
        <div className="card-dark p-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&#39;t have an account yet?{" "}
          <Link href="/register" className="text-gold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
