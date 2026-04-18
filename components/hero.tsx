import { BRAND } from "@/constants/app";
import Link from "next/link";
import { FC } from "react";
import ServerStatus from "./server-status";
import Headline from "./ui/headline";
import Text from "./ui/text";

type HeroProps = {
  serverStatus: "online" | "offline";
};

const Hero: FC<HeroProps> = ({ serverStatus }) => {
  const subtitle = "Season 0.97d \u2014 The Classic Experience";

  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center px-4">
        <Headline>
          <Text variant="hero" className="text-center mb-3" >
            {BRAND}
          </Text>
          <Text variant="subtitle">
            {subtitle}
          </Text>
        </Headline>

        <ServerStatus status={serverStatus} />

        <div className="flex gap-4 justify-center">
          <Link href="/download" className="btn-gold w-full">
            Play Now
          </Link>
          <Link href="/register" className="btn-outline w-full">
            Register
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
