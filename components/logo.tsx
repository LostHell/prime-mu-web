import { BRAND } from "@/constants/app";
import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/logo-emblem.png"
      alt={`${BRAND} Logo`}
      width={48}
      height={48}
      className="h-12 w-12"
      loading="eager"
      priority
    />
  );
};

export default Logo;
