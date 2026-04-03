import LoginForm from "@/app/login/_components/login-form";
import { auth } from "@/auth";
import PageLayout from "@/components/page-layout";
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
        <h1 className="mb-3 text-center font-serif text-4xl font-bold gold-gradient-text">Login</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Sign in with your existing game account credentials.
        </p>
        <div className="card-dark p-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No account yet?{" "}
          <Link href="/register" className="text-gold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
