import { auth } from "@/auth";
import Navigation, { type Page } from "@/components/navigation";
import { IS_HEADER_STICKY } from "@/constants/header";
import { cn } from "@/lib/utils";

const pages: Page[] = [
  { path: "/", label: "Home" },
  { path: "/top-players", label: "Top Players" },
  { path: "/download", label: "Download" },
];

const Header = async () => {
  const session = await auth();
  const isAuthenticated = !!session?.user?.id;

  return (
    <header className={cn(IS_HEADER_STICKY && "sticky top-0 z-50")}>
      <Navigation pages={pages} isAuthenticated={isAuthenticated} />
    </header>
  );
};

export default Header;
