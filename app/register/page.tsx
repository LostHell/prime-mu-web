import RegisterForm from "@/app/register/_components/register-form";
import { auth } from "@/auth";
import PageLayout from "@/components/page-layout";
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
    <PageLayout>
      <div className="mx-auto max-w-md px-4">
        <Headline className="text-center">
          <Text variant="h1">Register</Text>
          <Text variant="p">Create a new account using your email address.</Text>
        </Headline>
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
