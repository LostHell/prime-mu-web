import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const characters = await prisma.character.findMany({
    where: { AccountID: session.user.id },
    select: {
      Name: true,
      Class: true,
      cLevel: true,
      ResetCount: true,
      Money: true,
      PkCount: true,
      LevelUpPoint: true,
      Strength: true,
      Dexterity: true,
      Vitality: true,
      Energy: true,
    },
    orderBy: { Name: "asc" },
  });

  return NextResponse.json({
    characters: characters.map((character) => ({
      name: character.Name,
      classId: character.Class,
      level: character.cLevel,
      resets: character.ResetCount,
      zen: character.Money,
      pkCount: character.PkCount,
      freePoints: character.LevelUpPoint,
      strength: character.Strength,
      agility: character.Dexterity,
      vitality: character.Vitality,
      energy: character.Energy,
      command: 0,
    })),
  });
};
