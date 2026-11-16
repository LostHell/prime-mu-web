import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import Headline from "@/components/ui/headline";
import Text from "@/components/ui/text";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

const NotFound = () => {
  return (
    <PageLayout variant="auth" className="text-center">
      <Headline>
        <Text variant="h1">Page not found</Text>
        <Text variant="p" className="text-muted-foreground">
          This page does not exist or has moved.
        </Text>
      </Headline>
      <nav aria-label="Pages">
        <ul className="flex flex-col gap-3">
          <li>
            <Button className="w-full" decorative asChild>
              <Link href="/">Home</Link>
            </Button>
          </li>
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.href}>
              <Button className="w-full" variant="outline" decorative asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </PageLayout>
  );
};

export default NotFound;
