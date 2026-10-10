"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountAvatar({
  href,
  label,
  initial,
  onNavigate,
}: {
  href: string;
  label: string;
  initial: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={isCurrent ? "page" : undefined}
      onClick={onNavigate}
      className="rounded-full"
    >
      <Avatar>
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
    </Link>
  );
}
