import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import Link from "next/link";

const steps = [
  {
    title: "Create an account",
    href: "/register",
    description: "Register on the site. The game uses that same account.",
  },
  {
    title: "Download the client",
    href: "/downloads",
    description: "Get the client, extract it, and run the launcher.",
  },
  {
    title: "Log in and make a character",
    href: "/login",
    description: "Sign in through the launcher and create your character.",
  },
];

const StartPlaying = () => {
  return (
    <section>
      <Text variant="h3" as="h2" className="mb-4">
        How to start
      </Text>
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.href}>
            <Link
              href={step.href}
              className="focus-visible:outline-ring block h-full rounded-xl focus-visible:outline-2"
            >
              <Card className="card-hover h-full">
                <CardContent>
                  <span className="text-gold font-serif text-lg">
                    {index + 1}
                  </span>
                  <p className="mt-2 font-medium">{step.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default StartPlaying;
