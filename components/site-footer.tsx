"use client";

import Footer from "@/components/footer";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/user-panel")) {
    return null;
  }

  return <Footer />;
}
