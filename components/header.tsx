import { auth } from "@/auth";
import Navigation, { type Page } from "@/components/navigation";

const pages: Page[] = [
  { path: "/", label: "Home" },
  { path: "/top-players", label: "Top Players" },
  { path: "/download", label: "Download" },
];

const Header = async () => {
  const session = await auth();
  const isAuthenticated = !!session?.user?.id;

  return (
    <header>
      <Navigation pages={pages} isAuthenticated={isAuthenticated} />
    </header>
  );
};

export default Header;
