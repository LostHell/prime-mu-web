import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import {
  MACOS_CLIENT_MB,
  WINDOWS_CLIENT_UNZIPPED_MB,
  WINDOWS_CLIENT_ZIPPED_MB,
} from "@/constants/app";
import { VERSION } from "@/constants/server";
import { Download } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const clients = [
  {
    name: "Windows",
    version: VERSION,
    size: `${WINDOWS_CLIENT_ZIPPED_MB} MB zipped`,
    installed: `${WINDOWS_CLIENT_UNZIPPED_MB} MB unzipped`,
    href: "#",
  },
  {
    name: "macOS",
    version: VERSION,
    size: `${MACOS_CLIENT_MB} MB`,
    installed: null,
    href: "#",
  },
];

const steps = [
  {
    title: "Download and extract",
    body: `The Windows archive is ${WINDOWS_CLIENT_ZIPPED_MB} MB and expands to ${WINDOWS_CLIENT_UNZIPPED_MB} MB. The macOS client is ${MACOS_CLIENT_MB} MB.`,
  },
  {
    title: "Create your account",
    body: (
      <>
        Register on the{" "}
        <Link
          href="/register"
          className="text-gold underline underline-offset-4"
        >
          registration page
        </Link>{" "}
        before you sign in.
      </>
    ),
  },
  {
    title: "Launch and play",
    body: "Open the launcher from the folder you extracted, let it finish, then log in.",
  },
];

const questions = [
  {
    title: "The launcher will not open",
    body: "Extract the Windows archive first, then run the launcher from that folder. On macOS, open the downloaded client directly.",
  },
  {
    title: "Can I use another MU client?",
    body: "No. Use the Windows or macOS client from this page.",
  },
];

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <Text variant="h3" as="h2">
          {title}
        </Text>
        {description ? (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
};

const DownloadsContent = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Section title="Full client">
          <ul className="grid gap-4 md:grid-cols-2">
            {clients.map((client) => (
              <li key={client.name} className="h-full">
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col gap-4">
                    <p className="font-serif text-2xl font-semibold">
                      {client.name}
                    </p>
                    <dl>
                      {[
                        { label: "Version", value: client.version },
                        { label: "Download", value: client.size },
                        ...(client.installed
                          ? [{ label: "Unzipped", value: client.installed }]
                          : []),
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="border-border/50 flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0"
                        >
                          <dt className="text-muted-foreground text-sm">
                            {row.label}
                          </dt>
                          <dd className="text-right text-sm font-medium">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <Button className="mt-auto" decorative asChild>
                      <a href={client.href}>
                        <Download aria-hidden="true" />
                        Download {client.name}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Have an account?">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground text-sm">
                Create one before you sign in to the game.
              </p>
              <Button variant="outline" decorative asChild>
                <Link href="/register">Create account</Link>
              </Button>
            </CardContent>
          </Card>
        </Section>
      </div>

      <Section title="In-game in 3 steps">
        <Card>
          <CardContent>
            <ol className="divide-border/50 divide-y">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="text-gold w-8 shrink-0 font-serif text-lg">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </Section>

      <Section title="Need help getting started?">
        <Card>
          <CardContent>
            <div className="divide-border/50 divide-y">
              {questions.map((question) => (
                <details
                  key={question.title}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  <summary className="cursor-pointer font-medium">
                    {question.title}
                  </summary>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {question.body}
                  </p>
                </details>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
};

export default DownloadsContent;
