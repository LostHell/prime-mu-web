import { BRAND } from "@/app/constants/app";
import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/logo-emblem.png"
      alt={`${BRAND} Logo`}
      width={48}
      height={48}
      className="w-12 h-12"
      loading="eager"
      priority
    />
  );
};

export default Logo;
