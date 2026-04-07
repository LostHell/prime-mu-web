import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getCharacter } from "../../_lib/get-character";
import ResetForm from "./_components/reset-form";

interface ResetPageProps {
  params: Promise<{ characterName: string }>;
}

const ResetPage = async ({ params }: ResetPageProps) => {
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

  return <ResetForm character={character} />;
};

export default ResetPage;
