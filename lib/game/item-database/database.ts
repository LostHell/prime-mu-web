import fs from "fs";
import path from "path";
import {
  ITEM_COMMENT_PREFIX,
  ITEM_GROUP_LINE_PATTERN,
  ITEM_KEY_DELIMITER,
  ITEM_SECTION_END_TOKEN,
} from "./constants";
import { isArmorGroup, isShieldGroup, isWeaponGroup } from "./guards";
import { parseClassFlags, parsePositiveRequirement } from "./parsers";
import { type ItemDatabase, type ItemDefinition } from "./types";

export const getItemKey = (group: number, index: number): string => {
  return `${group}${ITEM_KEY_DELIMITER}${index}`;
};

export const readAndParseItemDatabase = (): ItemDatabase => {
  const itemDataPath = path.join(
    process.cwd(),
    "lib",
    "game",
    "data",
    "Item.txt",
  );
  const itemDataText = fs.readFileSync(itemDataPath, "utf8");
  const lines = itemDataText.split("\n");

  const database: ItemDatabase = new Map();
  let currentGroup = -1;

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith(ITEM_COMMENT_PREFIX)) {
      continue;
    }

    if (ITEM_GROUP_LINE_PATTERN.test(line)) {
      currentGroup = parseInt(line, 10);
      continue;
    }

    if (line === ITEM_SECTION_END_TOKEN) {
      continue;
    }

    const quoteStartIndex = line.indexOf('"');
    const quoteEndIndex = line.lastIndexOf('"');
    if (quoteStartIndex === -1 || quoteEndIndex === quoteStartIndex) {
      continue;
    }

    const preNameParts = line.slice(0, quoteStartIndex).trim().split(/\s+/);
    const name = line.slice(quoteStartIndex + 1, quoteEndIndex);
    const postNameParts = line
      .slice(quoteEndIndex + 1)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const itemIndex = parseInt(preNameParts[0] ?? "", 10);
    const width = parseInt(preNameParts[3] ?? "", 10);
    const height = parseInt(preNameParts[4] ?? "", 10);
    if (isNaN(itemIndex) || isNaN(width) || isNaN(height)) {
      continue;
    }

    const definition: ItemDefinition = { name, width, height };

    if (
      (isArmorGroup(currentGroup) || isShieldGroup(currentGroup)) &&
      postNameParts.length >= 10
    ) {
      definition.defense = parseInt(postNameParts[1] ?? "", 10) || undefined;
      if (isShieldGroup(currentGroup)) {
        definition.defRate = parseInt(postNameParts[2] ?? "", 10) || undefined;
      }
      definition.durability = parseInt(postNameParts[3] ?? "", 10) || undefined;
      definition.reqLevel = parsePositiveRequirement(postNameParts[4]);
      definition.reqStr = parsePositiveRequirement(postNameParts[5]);
      definition.reqAgi = parsePositiveRequirement(postNameParts[6]);
      definition.classFlags = parseClassFlags(postNameParts, 10);
    } else if (isWeaponGroup(currentGroup) && postNameParts.length >= 13) {
      definition.dmgMin = parseInt(postNameParts[1] ?? "", 10) || undefined;
      definition.dmgMax = parseInt(postNameParts[2] ?? "", 10) || undefined;
      definition.durability = parseInt(postNameParts[4] ?? "", 10) || undefined;
      definition.reqLevel = parsePositiveRequirement(postNameParts[7]);
      definition.reqStr = parsePositiveRequirement(postNameParts[8]);
      definition.reqAgi = parsePositiveRequirement(postNameParts[9]);
      definition.classFlags = parseClassFlags(postNameParts, 13);
    }

    database.set(getItemKey(currentGroup, itemIndex), definition);
  }

  return database;
};

let cachedItemDatabase: ItemDatabase | null = null;

export const getItemDatabase = (): ItemDatabase => {
  if (cachedItemDatabase) {
    return cachedItemDatabase;
  }

  cachedItemDatabase = readAndParseItemDatabase();
  return cachedItemDatabase;
};
