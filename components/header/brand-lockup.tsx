import Logo from "@/components/logo";
import { BRAND } from "@/constants/app";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Link href="/" className="flex min-w-0 items-center gap-3">
        <Logo />
        <span className="flex min-w-0 flex-col gap-1 leading-none">
          <span className="gold-gradient-text truncate font-serif text-xl font-bold">
            {BRAND}
          </span>
        </span>
      </Link>
    </div>
  );
}
