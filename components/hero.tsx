import { BRAND } from "@/constants/app";
import Link from "next/link";
import { FC } from "react";
import ServerStatus from "./server-status";
import { Button } from "./ui/button";
import Headline from "./ui/headline";
import Text from "./ui/text";

type HeroProps = {
  serverStatus: "online" | "offline";
};

const Hero: FC<HeroProps> = ({ serverStatus }) => {
  const subtitle = "Season 0.97d \u2014 The Classic Experience";

  return (
    <section className="relative flex h-[80vh] items-center justify-center overflow-hidden">
      <div className="relative z-10 px-4 text-center">
        <Headline>
          <Text variant="hero" className="mb-3 text-center">
            {BRAND}
          </Text>
          <Text variant="subtitle">{subtitle}</Text>
        </Headline>

        <ServerStatus status={serverStatus} />

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
