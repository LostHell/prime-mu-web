import { auth } from "@/auth";
import PageLayout from "@/components/page-layout";
import { notFound, redirect } from "next/navigation";
import { getCharacter } from "../_lib/get-character";
import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardSidebar } from "./_components/dashboard-sidebar";

interface CharacterLayoutProps {
  children: React.ReactNode;
  params: Promise<{ characterName: string }>;
}

export default async function CharacterLayout({
  children,
  params,
}: CharacterLayoutProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { characterName } = await params;
  const decodedName = decodeURIComponent(characterName);
  const character = await getCharacter(session.user.id, decodedName);

  if (!character) {
    notFound();
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4">
        <DashboardHeader character={character} />

        <div
          className="grid md:grid-cols-[220px_1fr] gap-6 animate-fade-up"
          style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
        >
          <DashboardSidebar characterName={character.name} />
          <div className="card-dark p-6 min-h-100">{children}</div>
        </div>
      </div>
    </PageLayout>
  );
}
