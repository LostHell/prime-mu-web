import { auth } from "@/auth";
import Divider from "@/components/divider";
import PageLayout from "@/components/page-layout";
import { redirect } from "next/navigation";
import AccountSettings from "./_components/account-settings";
import CharacterGrid from "./_components/character-grid";
import { getCharacters } from "./_lib/get-characters";

const UserPanelPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const characters = await getCharacters(session.user.id);

  return (
    <PageLayout>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold gold-gradient-text">
              Select Character
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Choose a character to manage
            </p>
          </div>
        </div>

        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
        >
          <CharacterGrid characters={characters} />
        </div>

        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
        >
          <Divider />
          <AccountSettings />
        </div>
      </div>
    </PageLayout>
  );
};

export default UserPanelPage;
