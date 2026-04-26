import { BRAND } from "@/constants/app";
import { getServerStatus } from "@/lib/queries/get-server-status";
import Link from "next/link";
import ServerStatus from "./server-status";
import { Button } from "./ui/button";
import Headline from "./ui/headline";
import Text from "./ui/text";

const Hero = async () => {
  const serverStatus = await getServerStatus();
  const subtitle = "Season 0.97d - The Classic Experience";

  return (
    <section className="flex items-center justify-center">
      <div>
        <Headline className="text-center">
          <Text variant="hero" className="mb-3">
            {BRAND}
          </Text>
          <Text variant="subtitle">{subtitle}</Text>
        </Headline>

        <ServerStatus status={serverStatus.status} />

        <div className="mx-auto flex max-w-md justify-center gap-4">
          <Button className="flex-1" variant="default" asChild>
            <Link href="/download">Play Now</Link>
          </Button>

          <Button className="flex-1" variant="outline" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
