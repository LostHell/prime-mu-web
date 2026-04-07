import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getCharacter } from "../../_lib/get-character";
import ClearPkForm from "./_components/clear-pk-form";

interface ClearPkPageProps {
  params: Promise<{ characterName: string }>;
}

const ClearPkPage = async ({ params }: ClearPkPageProps) => {
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

  return <ClearPkForm character={character} />;
};

export default ClearPkPage;
