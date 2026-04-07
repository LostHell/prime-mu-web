import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getCharacter } from "../../_lib/get-character";
import UnstuckForm from "./_components/unstuck-form";

interface UnstuckPageProps {
  params: Promise<{ characterName: string }>;
}

const UnstuckPage = async ({ params }: UnstuckPageProps) => {
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

  return <UnstuckForm character={character} />;
};

export default UnstuckPage;
