import { cn } from "@/lib/utils";
import { DecodedItem, ItemClassFlags, ItemDefinition } from "@/types/item";

/** Tooltip palette (legacy MU / web shop style). */
const C = {
  titleExc: "text-[#2FF387]",
  titleNorm: "text-gold",
  /** Luck, additional, skill, core stat lines */
  muted: "text-[#9aadd5]",
  /** Excellent option rows (armor/weapon bits) */
  excellent: "text-[#8CB0EA]",
  classReq: "text-red-500",
} as const;

const ARMOR_EXCELLENT: { bit: number; label: string }[] = [
  { bit: 0x20, label: "Increase Max HP +4%" },
  { bit: 0x10, label: "Increase Max Mana +4%" },
  { bit: 0x08, label: "Damage Decrease +4%" },
  { bit: 0x04, label: "Reflect Damage +5%" },
  { bit: 0x02, label: "Defense Success Rate +10%" },
  { bit: 0x01, label: "Increase Zen (Monsters) +30%" },
];

const WEAPON_EXCELLENT: { bit: number; label: string }[] = [
  { bit: 0x20, label: "Life after kill +Life/8" },
  { bit: 0x10, label: "Mana after kill +Mana/8" },
  { bit: 0x08, label: "Excellent Damage Rate +10%" },
  { bit: 0x04, label: "Attack +Level/20" },
  { bit: 0x02, label: "Increase Attack Damage +%" },
  { bit: 0x01, label: "Attack / Wizardry Speed +7" },
];

/** Shown when `DecodedItem.luck` is true (classic MU lists both). */
const LUCK_LINES = [
  "Luck (success rate of Jewel of Soul +25%)",
  "Luck (critical damage rate +5%)",
] as const;

const CLASS_LABEL: Record<string, string> = {
  DW: "Dark Wizard",
  SM: "Soul Master",
  DK: "Dark Knight",
  BK: "Blade Knight",
  ELF: "Fairy Elf",
  ME: "Muse Elf",
  MG: "Magic Gladiator",
};

function classCodesFromFlags(flags: ItemClassFlags): string[] {
  const codes: string[] = [];
  if (flags.dw === 1) codes.push("DW", "SM");
  else if (flags.dw === 2) codes.push("SM");
  if (flags.dk === 1) codes.push("DK", "BK");
  else if (flags.dk === 2) codes.push("BK");
  if (flags.elf === 1) codes.push("ELF", "ME");
  else if (flags.elf === 2) codes.push("ME");
  if (flags.mg >= 1) codes.push("MG");
  return codes;
}

function equippableClassNames(flags: ItemClassFlags): string[] {
  return classCodesFromFlags(flags).map((c) => CLASS_LABEL[c] ?? c);
}

export type ItemCardItem = DecodedItem &
  Pick<
    ItemDefinition,
    | "defense"
    | "defRate"
    | "dmgMin"
    | "dmgMax"
    | "reqStr"
    | "reqAgi"
    | "classFlags"
  > & {
    name: string;
    width?: number;
    height?: number;
  };

type ItemCardProps = {
  item: ItemCardItem;
  compact?: boolean;
};

function additionalOptionLabel(item: ItemCardItem): string | null {
  if (item.addOption <= 0) return null;
  if (item.group === 6) {
    const defenseRate = (item.addOption / 4) * 5;
    return `Additional Defense Rate +${defenseRate}%`;
  }
  if (item.group >= 7 && item.group <= 11) {
    return `Additional defense +${item.addOption}`;
  }
  if (item.group === 5) {
    return `Additional Wizardry Damage +${item.addOption}`;
  }
  return `Additional Damage +${item.addOption}`;
}

export function ItemCard({ item, compact = false }: ItemCardProps) {
  const isDefensive = item.group >= 6 && item.group <= 11;
  const isShield = item.group === 6;
  const isExcellent = item.excellent > 0;
  const excellentOpts = isDefensive ? ARMOR_EXCELLENT : WEAPON_EXCELLENT;
  const activeExcellent = excellentOpts.filter(
    (o) => (item.excellent & o.bit) !== 0,
  );
  const classNames = item.classFlags
    ? equippableClassNames(item.classFlags)
    : [];
  const additionalText = additionalOptionLabel(item);

  const title = (
    <span
      className={cn(
        "text-[11px] leading-tight font-semibold",
        isExcellent ? C.titleExc : C.titleNorm,
      )}
    >
      {isExcellent ? "Excellent " : ""}
      {item.name} +{item.level}
    </span>
  );

  if (compact) {
    return (
      <div className="text-center font-sans text-[10px] leading-snug">
        <p>{title}</p>
        <div
          className={cn(
            "mt-1 flex flex-wrap justify-center gap-x-2 gap-y-0.5",
            C.muted,
          )}
        >
          {item.skill && <span>Skill</span>}
          {item.luck && (
            <span className="flex w-full flex-col gap-0 text-[9px] leading-tight">
              {LUCK_LINES.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          )}
          {item.defense !== undefined && (
            <span>Def {item.defense + item.addOption}</span>
          )}
          {item.dmgMin !== undefined && (
            <span>
              Dmg {item.dmgMin + item.addOption}~{item.dmgMax! + item.addOption}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-56 overflow-hidden rounded-lg bg-[rgba(12,12,12,0.9)] font-sans text-[10px] leading-snug">
      <div className="space-y-2 px-1.5 py-2 text-center">
        <div>{title}</div>

        <div className="flex justify-center py-0.5">
          <div className="bg-muted/30 flex h-12 w-12 items-center justify-center rounded">
            <span className="text-muted-foreground text-[10px]">
              {item.width ?? 1}×{item.height ?? 1}
            </span>
          </div>
        </div>

        <div className={cn("space-y-0.5", C.muted)}>
          {item.defense !== undefined && (
            <p>Defense: {item.defense + item.addOption}</p>
          )}
          {isShield && item.defRate !== undefined && (
            <p>Defense rate: {item.defRate}</p>
          )}
          {item.dmgMin !== undefined && item.dmgMax !== undefined && (
            <p>
              Damage: {item.dmgMin + item.addOption} ~{" "}
              {item.dmgMax + item.addOption}
            </p>
          )}
          {item.reqStr !== undefined && <p>Strength required {item.reqStr}</p>}
          {item.reqAgi !== undefined && <p>Agility required {item.reqAgi}</p>}
          <p>Durability: {item.durability}</p>
        </div>

        {classNames.length > 0 && (
          <div className="space-y-0.5">
            {classNames.map((name) => (
              <p key={name} className={C.classReq}>
                Can be equipped by {name}
              </p>
            ))}
          </div>
        )}

        {(item.skill || item.luck || additionalText) && (
          <div className={cn("space-y-0.5", C.muted)}>
            {item.skill && <p>Skill (ability)</p>}
            {item.luck && LUCK_LINES.map((line) => <p key={line}>{line}</p>)}
            {additionalText && <p>{additionalText}</p>}
          </div>
        )}

        {activeExcellent.length > 0 && (
          <div className={cn("space-y-0.5 pt-1", C.excellent)}>
            {activeExcellent.map((opt) => (
              <p key={opt.bit}>{opt.label}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemCard;
