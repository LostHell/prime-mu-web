import { ItemDefinition } from "@/lib/types/item";
import fs from "fs";
import path from "path";

type ItemDb = Map<string, ItemDefinition>;

let cachedDb: ItemDb | null = null;

export function getItemDatabase(): ItemDb {
  if (cachedDb) return cachedDb;

  const filePath = path.join(process.cwd(), "lib", "game", "data", "Item.txt");
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split("\n");

  const db: ItemDb = new Map();
  let group = -1;

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("//")) continue;
    if (/^\d+$/.test(line)) {
      group = parseInt(line);
      continue;
    }
    if (line === "end") continue;

    const qStart = line.indexOf('"');
    const qEnd = line.lastIndexOf('"');
    if (qStart === -1 || qEnd === qStart) continue;

    const preParts = line.slice(0, qStart).trim().split(/\s+/);
    const name = line.slice(qStart + 1, qEnd);
    const post = line
      .slice(qEnd + 1)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const index = parseInt(preParts[0]);
    const width = parseInt(preParts[3]);
    const height = parseInt(preParts[4]);
    if (isNaN(index) || isNaN(width) || isNaN(height)) continue;

    const isWeapon = group >= 0 && group <= 5;
    const isShield = group === 6;
    const isArmor = group >= 7 && group <= 11;

    const def: ItemDefinition = { name, width, height };

    if ((isArmor || isShield) && post.length >= 10) {
      def.defense = parseInt(post[1]) || undefined;
      if (isShield) def.defRate = parseInt(post[2]) || undefined;
      def.durability = parseInt(post[3]) || undefined;
      const reqLvl = parseInt(post[4]);
      def.reqLevel = reqLvl > 0 ? reqLvl : undefined;
      const reqStr = parseInt(post[5]);
      def.reqStr = reqStr > 0 ? reqStr : undefined;
      const reqAgi = parseInt(post[6]);
      def.reqAgi = reqAgi > 0 ? reqAgi : undefined;
      if (post.length >= 14) {
        def.classFlags = {
          dw: parseInt(post[10]) || 0,
          dk: parseInt(post[11]) || 0,
          elf: parseInt(post[12]) || 0,
          mg: parseInt(post[13]) || 0,
        };
      }
    } else if (isWeapon && post.length >= 13) {
      def.dmgMin = parseInt(post[1]) || undefined;
      def.dmgMax = parseInt(post[2]) || undefined;
      def.durability = parseInt(post[4]) || undefined;
      const reqLvl = parseInt(post[7]);
      def.reqLevel = reqLvl > 0 ? reqLvl : undefined;
      const reqStr = parseInt(post[8]);
      def.reqStr = reqStr > 0 ? reqStr : undefined;
      const reqAgi = parseInt(post[9]);
      def.reqAgi = reqAgi > 0 ? reqAgi : undefined;
      if (post.length >= 17) {
        def.classFlags = {
          dw: parseInt(post[13]) || 0,
          dk: parseInt(post[14]) || 0,
          elf: parseInt(post[15]) || 0,
          mg: parseInt(post[16]) || 0,
        };
      }
    }

    db.set(`${group}-${index}`, def);
  }

  cachedDb = db;
  return db;
}

export function getItemName(group: number, index: number): string {
  const db = getItemDatabase();
  return db.get(`${group}-${index}`)?.name ?? `Item (${group}-${index})`;
}

export function getItemDefinition(
  group: number,
  index: number,
): ItemDefinition | undefined {
  const db = getItemDatabase();
  return db.get(`${group}-${index}`);
}
