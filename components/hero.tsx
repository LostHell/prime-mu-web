import { BRAND } from "@/constants/app";
import Link from "next/link";
import { FC } from "react";
import ServerStatus from "./server-status";

type HeroProps = {
  serverStatus: "online" | "offline";
};

const Hero: FC<HeroProps> = ({ serverStatus }) => {
  const subtitle = "Season 0.97d \u2014 The Classic Experience";

  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center px-4">
        <h1 className="font-serif text-5xl md:text-7xl font-bold gold-gradient-text mb-4 animate-fade-up animate-pulse-gold">
          {BRAND}
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-8 tracking-widest uppercase animate-fade-up delay-100">
          {subtitle}
        </p>

        <ServerStatus status={serverStatus} />

        <div className="flex gap-4 justify-center animate-fade-up delay-200">
          <Link href="/download" className="btn-gold">
            Play Now
          </Link>
          <Link href="/user-panel" className="btn-outline">
            Register
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
