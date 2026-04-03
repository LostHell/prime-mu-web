import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getCharacter } from "../../_lib/get-character";
import { AddStatsForm } from "./_components/add-stats-form";

interface AddStatsPageProps {
  params: Promise<{ characterName: string }>;
}

export default async function AddStatsPage({ params }: AddStatsPageProps) {
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

  return <AddStatsForm character={character} />;
}
