import RegisterForm from "@/app/register/_components/register-form";
import { auth } from "@/auth";
import PageLayout from "@/components/page-layout";
import Link from "next/link";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/user-panel");
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-md px-4">
        <h1 className="mb-3 text-center font-serif text-4xl font-bold gold-gradient-text">
          Register
        </h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Create a new account using legacy-compatible fields.
        </p>
        <div className="card-dark p-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </PageLayout>
  );
};

export default RegisterPage;
