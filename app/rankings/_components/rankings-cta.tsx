import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui/text";
import Link from "next/link";

const RankingsCta = () => {
  return (
    <section>
      <Text variant="h3" as="h2" className="mb-4">
        Your name belongs here.
      </Text>
      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-sm">
            Create an account, then climb the rankings.
          </p>
          <Button decorative asChild>
            <Link href="/register">Create account</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default RankingsCta;
