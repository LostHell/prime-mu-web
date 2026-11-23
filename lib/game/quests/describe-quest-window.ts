import type {
  QuestWindowObjective,
  QuestWindowQuest,
  QuestWindowRequirement,
  QuestWindowReward,
} from "@/lib/game/server-config";
import { formatNumber } from "@/lib/utils/numbers";

/** A quest of the in-game quest window as the public pages describe it. */
export type PublicQuest = {
  /** Its place in the window, as the game shows it ("Quest 1 / 50"). */
  number: number;
  name: string;
  /** "After quest 1", "After the class change (Dark Wizard, ...) or with 1 reset (Magic Gladiator)". */
  requirement: string;
  /** "50 × Spider" and where it lives ("Lorencia"). */
  objectives: { text: string; where: string | null }[];
  /** "10,000,000 zen", "3 × Jewel of Bless", "5 level-up points". */
  rewards: string[];
};

/** The quests of the window in blocks ("Quests 1–10"). */
export type PublicQuestGroup = {
  title: string;
  quests: PublicQuest[];
};

/** Names an item of a reward or an objective: 32 * category + index, and its level. */
export type QuestItemName = (item: { index: number; level: number }) => string;

const CLASS_LABELS: Record<string, string> = {
  dw: "Dark Wizard",
  dk: "Dark Knight",
  fe: "Fairy Elf",
  mg: "Magic Gladiator",
};

/** " (Magic Gladiator)" when only some classes, "" for all of them. */
const forClasses = (classes: string[]): string => {
  const labels = Object.keys(CLASS_LABELS)
    .filter((key) => classes.includes(key))
    .map((key) => CLASS_LABELS[key]);
  return labels.length > 0 && labels.length < Object.keys(CLASS_LABELS).length
    ? ` (${labels.join(", ")})`
    : "";
};

const plural = (count: number, one: string, many: string) =>
  `${formatNumber(count)} ${count === 1 ? one : many}`;

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const describeRequirement = (
  requirement: QuestWindowRequirement,
  numberOf: (questIndex: number) => number | undefined,
): string => {
  const conditions: string[] = [];
  if (requirement.classChange) conditions.push("after the class change");
  if (requirement.quest !== null) {
    conditions.push(
      `after quest ${numberOf(requirement.quest) ?? requirement.quest}`,
    );
  }
  if (requirement.resets !== null) {
    conditions.push(`with ${plural(requirement.resets, "reset", "resets")}`);
  }
  if (requirement.minLevel !== null) {
    conditions.push(`from level ${formatNumber(requirement.minLevel)}`);
  }
  if (requirement.maxLevel !== null) {
    conditions.push(`up to level ${formatNumber(requirement.maxLevel)}`);
  }
  const text =
    conditions.length > 0 ? conditions.join(", ") : "open from the start";
  return `${text}${forClasses(requirement.classes)}`;
};

const describeObjective = (
  objective: QuestWindowObjective,
  mapNames: Record<number, string>,
  itemName: QuestItemName,
): PublicQuest["objectives"][number] => {
  if (objective.kind === "zen") {
    return { text: `${formatNumber(objective.value ?? 0)} zen`, where: null };
  }
  const count = formatNumber(objective.count ?? 0);
  if (objective.kind === "item") {
    const name = itemName({
      index: objective.item ?? 0,
      level: objective.level ?? 0,
    });
    return { text: `${count} × ${name}`, where: null };
  }
  const maps = (objective.maps ?? [])
    .map((map) => mapNames[map])
    .filter((name): name is string => Boolean(name));
  return {
    text: `${count} × ${objective.name ?? "Unknown monster"}`,
    where: maps.length > 0 ? maps.join(", ") : null,
  };
};

const describeItemOptions = (item: NonNullable<QuestWindowReward["item"]>) => {
  const options = [
    ...(item.skill ? ["Skill"] : []),
    ...(item.luck ? ["Luck"] : []),
    ...(item.option > 0 ? [`+${item.option * 4} option`] : []),
    ...(item.excellent > 0 ? ["Excellent"] : []),
  ];
  return options.length > 0 ? ` (${options.join(", ")})` : "";
};

const describeReward = (
  reward: QuestWindowReward,
  itemName: QuestItemName,
): string => {
  if (reward.kind === "points") {
    return plural(reward.value, "level-up point", "level-up points");
  }
  if (reward.kind === "zen") return `${formatNumber(reward.value)} zen`;
  if (!reward.item) return "Unknown reward";
  const name = `${itemName(reward.item)}${describeItemOptions(reward.item)}`;
  return reward.value > 1 ? `${formatNumber(reward.value)} × ${name}` : name;
};

const describeRewards = (
  rewards: QuestWindowReward[],
  itemName: QuestItemName,
): string[] => {
  // A group stands where its first reward is, with all of its rewards.
  const entries: (string | string[])[] = [];
  const groups = new Map<number, string[]>();
  for (const reward of rewards) {
    const text = `${describeReward(reward, itemName)}${forClasses(reward.classes)}`;
    if (reward.group === undefined) {
      entries.push(text);
      continue;
    }
    let group = groups.get(reward.group);
    if (!group) {
      group = [];
      groups.set(reward.group, group);
      entries.push(group);
    }
    group.push(text);
  }
  return entries.map((entry) =>
    typeof entry === "string" ? entry : `One of: ${entry.join(", ")}`,
  );
};

/**
 * The quests of the in-game quest window, in the window's order, numbered as
 * the game numbers them, in blocks of `groupSize`.
 */
export const describeQuestWindow = (
  quests: QuestWindowQuest[],
  mapNames: Record<number, string>,
  itemName: QuestItemName,
  groupSize = 10,
): PublicQuestGroup[] => {
  const numbers = new Map(quests.map((quest, i) => [quest.index, i + 1]));
  const numberOf = (questIndex: number) => numbers.get(questIndex);

  const described: PublicQuest[] = quests.map((quest, i) => {
    const requirements = new Map<string, string[]>();
    for (const requirement of quest.requirements) {
      // Rows that differ only by class read the same: one text, their classes together.
      const text = describeRequirement(
        { ...requirement, classes: [] },
        numberOf,
      );
      requirements.set(text, [
        ...(requirements.get(text) ?? []),
        ...requirement.classes,
      ]);
    }
    return {
      number: i + 1,
      name: quest.name,
      requirement: capitalize(
        [...requirements]
          .map(([text, classes]) => `${text}${forClasses(classes)}`)
          .join(" or ") || "open from the start",
      ),
      objectives: quest.objectives.map((objective) =>
        describeObjective(objective, mapNames, itemName),
      ),
      rewards: describeRewards(quest.rewards, itemName),
    };
  });

  const groups: PublicQuestGroup[] = [];
  for (let start = 0; start < described.length; start += groupSize) {
    const block = described.slice(start, start + groupSize);
    const first = block[0].number;
    const last = block[block.length - 1].number;
    groups.push({
      title: first === last ? `Quest ${first}` : `Quests ${first}–${last}`,
      quests: block,
    });
  }
  return groups;
};
