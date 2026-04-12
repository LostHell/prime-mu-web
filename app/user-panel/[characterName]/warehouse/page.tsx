import { auth } from "@/auth";
import { getItemDefinition, getItemName } from "@/lib/item-database";
import { decodeWarehouseItems, EXT_WAREHOUSE_ROWS, WAREHOUSE_COLS } from "@/lib/item-decoder";
import { prisma } from "@/prisma/prisma";
import { notFound, redirect } from "next/navigation";
import { getCharacter } from "../../_lib/get-character";
import { WarehouseGrid } from "./_components";

interface WarehousePageProps {
  params: Promise<{ characterName: string }>;
}

const WarehousePage = async ({ params }: WarehousePageProps) => {
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

  const warehouse = await prisma.warehouse.findUnique({
    where: { AccountID: session.user.id },
    select: { Items: true },
  });

  const warehouseBytes = warehouse?.Items ? Buffer.from(warehouse.Items) : Buffer.alloc(1920, 0xff);

  const decodedItems = decodeWarehouseItems(warehouseBytes).map((item) => {
    const def = getItemDefinition(item.group, item.index);
    return {
      ...item,
      name: getItemName(item.group, item.index),
      width: def?.width ?? 1,
      height: def?.height ?? 1,
      defense: def?.defense,
      defRate: def?.defRate,
      dmgMin: def?.dmgMin,
      dmgMax: def?.dmgMax,
      reqStr: def?.reqStr,
      reqAgi: def?.reqAgi,
      classFlags: def?.classFlags,
    };
  });

  return (
    <WarehouseGrid
      characterName={character.name}
      cols={WAREHOUSE_COLS}
      rows={EXT_WAREHOUSE_ROWS}
      items={decodedItems}
    />
  );
};

export default WarehousePage;
