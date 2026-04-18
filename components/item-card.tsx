import { DecodedItem, ItemClassFlags, ItemDefinition } from "@/types/item";

// Armor excellent bits (b7 & 0x3f) for groups 6-11
const ARMOR_EXCELLENT: { bit: number; label: string }[] = [
  { bit: 0x20, label: "Increase Max HP +4%" },
  { bit: 0x10, label: "Increase Max Mana +4%" },
  { bit: 0x08, label: "Damage Decrease +4%" },
  { bit: 0x04, label: "Reflect Damage +5%" },
  { bit: 0x02, label: "Defense Success Rate +10%" },
  { bit: 0x01, label: "Increase Zen (Monsters) +30%" },
];

// Weapon excellent bits for groups 0-5
const WEAPON_EXCELLENT: { bit: number; label: string }[] = [
  { bit: 0x20, label: "Life after kill +Life/8" },
  { bit: 0x10, label: "Mana after kill +Mana/8" },
  { bit: 0x08, label: "Excellent Damage Rate +10%" },
  { bit: 0x04, label: "Attack +Level/20" },
  { bit: 0x02, label: "Increase Attack Damage +%" },
  { bit: 0x01, label: "Attack / Wizardry Speed +7" },
];

function getEquippableClasses(flags: ItemClassFlags): string[] {
  const classes: string[] = [];
  if (flags.dw === 1) classes.push("Dark Wizard", "Soul Master");
  else if (flags.dw === 2) classes.push("Soul Master");
  if (flags.dk === 1) classes.push("Dark Knight", "Blade Knight");
  else if (flags.dk === 2) classes.push("Blade Knight");
  if (flags.elf === 1) classes.push("Fairy Elf", "Muse Elf");
  else if (flags.elf === 2) classes.push("Muse Elf");
  if (flags.mg >= 1) classes.push("Magic Gladiator");
  return classes;
}

type ItemCardItem = DecodedItem &
  Pick<ItemDefinition, "defense" | "defRate" | "dmgMin" | "dmgMax" | "reqStr" | "reqAgi" | "classFlags"> & {
    name: string;
    width?: number;
    height?: number;
  };

type ItemCardProps = {
  item: ItemCardItem;
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center gap-4 px-3 py-[3px]">
    <span className="text-[#c8a86e]">{label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

const Divider = () => <div className="border-t border-[#3d2b0f] mx-3 my-1" />;

const ItemCard = ({ item }: ItemCardProps) => {
  const isDefensive = item.group >= 6 && item.group <= 11;
  const isShield = item.group === 6;
  const isExcellent = item.excellent > 0;
  const excellentOpts = isDefensive ? ARMOR_EXCELLENT : WEAPON_EXCELLENT;
  const activeExcellent = excellentOpts.filter((o) => (item.excellent & o.bit) !== 0);
  const equippableClasses = item.classFlags ? getEquippableClasses(item.classFlags) : [];
  const additionalOptionText = (() => {
    if (item.addOption <= 0) return null;

    if (item.group === 6) {
      const defenseRate = (item.addOption / 4) * 5;
      return `Additional Defense Rate +${defenseRate}%`;
    }

    if (item.group >= 7 && item.group <= 11) {
      return `Additional Defense +${item.addOption}`;
    }

    if (item.group === 5) {
      return `Additional Wizardry Damage +${item.addOption}`;
    }

    return `Additional Damage +${item.addOption}`;
  })();

  return (
    <div className="w-64 bg-[#120a02] border border-[#6b4c1e] rounded overflow-hidden text-xs">
      {/* Item Image */}
      <div className="h-28 bg-black/50 border-b border-[#3d2b0f] flex items-center justify-center">
        <div className="w-16 h-16 rounded border border-[#6b4c1e]/50 bg-[#1a0a00] flex items-center justify-center">
          <span className="text-[#6b4c1e] text-[10px] text-center leading-tight px-1">
            {item.width ?? 1}×{item.height ?? 1}
          </span>
        </div>
      </div>

      {/* Item Name */}
      <div className="px-3 py-2">
        <p className={`font-semibold leading-tight ${isExcellent ? "text-[#80cfff]" : "text-[#ffd060]"}`}>
          {isExcellent ? "Excellent " : ""}
          {item.name} +{item.level}
        </p>
      </div>

      <Divider />

      {/* Defense stats */}
      {item.defense !== undefined && <Row label="Defense" value={item.defense + item.addOption} />}
      {isShield && item.defRate !== undefined && <Row label="Defense Rate" value={item.defRate} />}

      {/* Weapon damage */}
      {item.dmgMin !== undefined && item.dmgMax !== undefined && (
        <Row label="Damage" value={`${item.dmgMin + item.addOption} ~ ${item.dmgMax + item.addOption}`} />
      )}

      <Divider />

      {/* Requirements */}
      {item.reqStr !== undefined && <Row label="Required Strength" value={item.reqStr} />}
      {item.reqAgi !== undefined && <Row label="Required Agility" value={item.reqAgi} />}

      {/* Class */}
      {equippableClasses.length > 0 && (
        <div className="px-3 py-[3px] text-[#e0e0e0]">Can be equipped by {equippableClasses.join(", ")}</div>
      )}

      {(item.luck || item.addOption > 0 || activeExcellent.length > 0 || item.skill) && <Divider />}

      {/* Instance options */}
      {item.skill && <div className="px-3 py-[3px] text-[#80cfff]">Skill</div>}
      {item.luck && <div className="px-3 py-[3px] text-[#80cfff]">Luck</div>}
      {additionalOptionText && <div className="px-3 py-[3px] text-[#80cfff]">{additionalOptionText}</div>}

      {/* Excellent options */}
      {activeExcellent.map((opt) => (
        <div key={opt.bit} className="px-3 py-[3px] text-[#80cfff]">
          {opt.label}
        </div>
      ))}

      {/* Bottom padding */}
      <div className="h-1" />
    </div>
  );
};

export default ItemCard;
