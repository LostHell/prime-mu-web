import { auth } from "@/auth";
import Navigation from "@/components/navigation";
import { navigation } from "@/lib/navigation-data";

const Header = async () => {
  const session = await auth();
  const isAuthenticated = !!session?.user?.id;

  return (
    <header>
      <Navigation pages={navigation} isAuthenticated={isAuthenticated} />
    </header>
  );
};

export default Header;
