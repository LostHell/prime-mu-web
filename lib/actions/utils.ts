import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";

export async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session.user.id;
}

export async function verifyCharacterOwnership(characterName: string) {
  const accountId = await getAuthenticatedUser();

  if (!accountId) {
    return null;
  }

  const character = await prisma.character.findFirst({
    where: {
      Name: characterName,
      AccountID: accountId,
    },
  });

  return character;
}

export async function isAccountOffline(accountId: string): Promise<boolean> {
  const stat = await prisma.mEMB_STAT.findUnique({
    where: { memb___id: accountId },
    select: { ConnectStat: true },
  });

  return (stat?.ConnectStat ?? 0) === 0;
}
