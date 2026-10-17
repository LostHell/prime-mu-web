import { HIDE_ITEM_DMG_DEF_AND_STATS, HIDE_ITEM_ICON } from "@/constants/items";
import { formatItemName } from "@/lib/game/item-database/formatters";
import {
  type ItemClassFlags,
  type ItemDefinition,
} from "@/lib/game/item-database/types";
import { getAdditionalOption } from "@/lib/game/item-decoder/additional-option";
import {
  getExcellentOptions,
  isExcellentItem,
} from "@/lib/game/item-decoder/excellent-option";
import {
  formatAdditionalOption,
  formatExcellentOption,
  LUCK_OPTION_LINES,
} from "@/lib/game/item-decoder/formatters";
import { type DecodedItem } from "@/lib/game/item-decoder/types";
import { cn } from "@/lib/utils";
import { ItemIcon } from "./item-icon";

/** Tooltip palette (legacy MU / web shop style). Backed by `--mu-tooltip-*` and `--crimson` tokens. */
const C = {
  titleExc: "text-mu-tooltip-exc",
  titleNorm: "text-gold",
  /** Luck, additional, skill, core stat lines */
  muted: "text-mu-tooltip-text",
  /** Excellent option rows (armor/weapon bits) */
  excellent: "text-mu-tooltip-line",
  classReq: "text-crimson",
} as const;

const CLASS_LABEL: Record<string, string> = {
  DW: "Dark Wizard",
  SM: "Soul Master",
  DK: "Dark Knight",
  BK: "Blade Knight",
  ELF: "Fairy Elf",
  ME: "Muse Elf",
  MG: "Magic Gladiator",
};

const classCodesFromFlags = (flags: ItemClassFlags): string[] => {
  const codes: string[] = [];
  if (flags.dw === 1) codes.push("DW", "SM");
  else if (flags.dw === 2) codes.push("SM");
  if (flags.dk === 1) codes.push("DK", "BK");
  else if (flags.dk === 2) codes.push("BK");
  if (flags.elf === 1) codes.push("ELF", "ME");
  else if (flags.elf === 2) codes.push("ME");
  if (flags.mg >= 1) codes.push("MG");
  return codes;
};

const equippableClassNames = (flags: ItemClassFlags): string[] =>
  classCodesFromFlags(flags).map((c) => CLASS_LABEL[c] ?? c);

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
};

export function ItemCard({ item }: ItemCardProps) {
  const isShield = item.group === 6;
  const isExcellent = isExcellentItem(item);
  const activeExcellent = getExcellentOptions(item);
  const classNames = item.classFlags
    ? equippableClassNames(item.classFlags)
    : [];
  const additionalOption = getAdditionalOption(item);
  const additionalText = additionalOption
    ? formatAdditionalOption(additionalOption)
    : null;

  const title = (
    <span
      className={cn(
        "text-item-title leading-tight font-semibold",
        isExcellent ? C.titleExc : C.titleNorm,
      )}
    >
      {formatItemName({
        item: {
          name: item.name,
          group: item.group,
          index: item.index,
          level: item.level,
          excellent: isExcellent ? 1 : 0,
        },
        options: { includeExcellent: true },
      })}
    </span>
  );

  return (
    <div className="bg-mu-tooltip-bg/90 text-item-line w-56 overflow-hidden rounded-lg font-sans leading-snug">
      <div className="space-y-2 px-1.5 py-2 text-center">
        <div>{title}</div>

        {!HIDE_ITEM_ICON && (
          <div className="flex justify-center py-0.5">
            <div className="bg-muted/30 flex h-12 w-12 items-center justify-center overflow-hidden rounded">
              <ItemIcon
                group={item.group}
                index={item.index}
                level={item.level}
                className="h-full w-full"
              />
            </div>
          </div>
        )}

        {!HIDE_ITEM_DMG_DEF_AND_STATS && (
          <div className={cn("space-y-0.5", C.muted)}>
            {isShield && item.defRate !== undefined && (
              <p>Defense rate: {item.defRate}</p>
            )}
            {item.dmgMin !== undefined && item.dmgMax !== undefined && (
              <p>
                Damage: {item.dmgMin + item.addOption} ~{" "}
                {item.dmgMax + item.addOption}
              </p>
            )}
            {item.reqStr !== undefined && (
              <p>Strength required {item.reqStr}</p>
            )}
            {item.reqAgi !== undefined && <p>Agility required {item.reqAgi}</p>}
            <p>Durability: {item.durability}</p>
          </div>
        )}

        {classNames.length > 0 && (
          <div className="space-y-0.5">
            {classNames.map((name) => (
              <p key={name} className={C.classReq}>
                Can be equipped by {name}
              </p>
            ))}
          </div>
        )}

        <div className="space-y-0.5">
          {(item.skill || item.luck || additionalText) && (
            <div className={cn("space-y-0.5", C.muted)}>
              {item.skill && <p>Skill (ability)</p>}
              {item.luck &&
                LUCK_OPTION_LINES.map((line) => <p key={line}>{line}</p>)}
              {additionalText && <p>{additionalText}</p>}
            </div>
          )}

          {activeExcellent.length > 0 && (
            <div className={cn("space-y-0.5", C.excellent)}>
              {activeExcellent.map((opt) => (
                <p key={opt.bit}>{formatExcellentOption(opt)}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
