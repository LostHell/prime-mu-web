import { type SVGProps } from "react";

type MuClass =
  | "Dark Knight"
  | "Dark Wizard"
  | "Fairy Elf"
  | "Magic Gladiator"
  | "Dark Lord";

/* shared wrapper */
function AvatarSvg({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 80 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/* ── Dark Knight ─────────────────────────────────────────────
   Heavy armored warrior — great sword + shield silhouette      */
function DarkKnightAvatar({ color }: { color: string }) {
  return (
    <AvatarSvg color={color}>
      {/* helm */}
      <path
        d="M32 6 Q40 1 48 6 L51 18 Q40 22 29 18Z"
        fill={color}
        opacity="0.9"
      />
      <rect x="35" y="4" width="10" height="5" rx="2" fill={color} />
      {/* visor slit */}
      <rect
        x="34"
        y="14"
        width="12"
        height="2"
        rx="1"
        fill="hsl(230 25% 7%)"
        opacity="0.7"
      />
      {/* torso / plate armor */}
      <path
        d="M26 18 L29 18 Q40 22 51 18 L54 18 L57 48 L23 48Z"
        fill={color}
        opacity="0.85"
      />
      {/* breastplate ridge */}
      <line
        x1="40"
        y1="22"
        x2="40"
        y2="46"
        stroke="hsl(230 25% 7%)"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M30 28 Q40 32 50 28"
        stroke="hsl(230 25% 7%)"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      {/* left arm */}
      <rect
        x="15"
        y="20"
        width="10"
        height="30"
        rx="5"
        fill={color}
        opacity="0.8"
      />
      {/* right arm */}
      <rect
        x="55"
        y="20"
        width="10"
        height="30"
        rx="5"
        fill={color}
        opacity="0.8"
      />
      {/* shield (left) */}
      <path d="M8 24 L18 24 L18 50 Q13 55 8 50Z" fill={color} opacity="0.6" />
      <path d="M10 30 L16 30" stroke="hsl(45 90% 50%)" strokeWidth="1.2" />
      <path d="M13 26 L13 52" stroke="hsl(45 90% 50%)" strokeWidth="1.2" />
      {/* great sword (right) */}
      <rect
        x="67"
        y="8"
        width="4"
        height="58"
        rx="2"
        fill={color}
        opacity="0.7"
      />
      <rect
        x="62"
        y="44"
        width="14"
        height="3"
        rx="1.5"
        fill={color}
        opacity="0.9"
      />
      <polygon points="69,6 67,14 71,14" fill={color} />
      {/* legs */}
      <rect
        x="27"
        y="48"
        width="11"
        height="30"
        rx="4"
        fill={color}
        opacity="0.8"
      />
      <rect
        x="42"
        y="48"
        width="11"
        height="30"
        rx="4"
        fill={color}
        opacity="0.8"
      />
      {/* boots */}
      <path d="M27 76 L38 76 L40 82 L25 82Z" fill={color} opacity="0.9" />
      <path d="M42 76 L53 76 L55 82 L40 82Z" fill={color} opacity="0.9" />
      {/* glow */}
      <ellipse cx="40" cy="88" rx="18" ry="4" fill={color} opacity="0.12" />
    </AvatarSvg>
  );
}

/* ── Dark Wizard ─────────────────────────────────────────────
   Robed spellcaster — staff + long robe                        */
function DarkWizardAvatar({ color }: { color: string }) {
  return (
    <AvatarSvg color={color}>
      {/* pointed hat */}
      <polygon points="40,1 28,20 52,20" fill={color} opacity="0.9" />
      <rect
        x="26"
        y="19"
        width="28"
        height="4"
        rx="2"
        fill={color}
        opacity="0.7"
      />
      {/* head */}
      <ellipse cx="40" cy="28" rx="9" ry="10" fill={color} opacity="0.85" />
      {/* robe body */}
      <path
        d="M24 36 Q32 34 40 34 Q48 34 56 36 L60 78 Q40 82 20 78Z"
        fill={color}
        opacity="0.75"
      />
      {/* robe trim */}
      <path
        d="M24 36 Q32 38 40 38 Q48 38 56 36"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M22 56 Q40 60 58 56"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      {/* left sleeve */}
      <path
        d="M24 36 L14 60 Q10 65 13 66 L20 56 L24 56Z"
        fill={color}
        opacity="0.7"
      />
      {/* right sleeve / staff arm */}
      <path
        d="M56 36 L66 60 Q70 65 67 66 L60 56 L56 56Z"
        fill={color}
        opacity="0.7"
      />
      {/* orb / magic hand */}
      <circle cx="12" cy="66" r="5" fill={color} opacity="0.5" />
      <circle cx="12" cy="66" r="3" fill={color} opacity="0.9" />
      {/* staff */}
      <rect
        x="69"
        y="10"
        width="3"
        height="68"
        rx="1.5"
        fill={color}
        opacity="0.6"
      />
      {/* staff orb */}
      <circle cx="70.5" cy="10" r="5" fill={color} opacity="0.4" />
      <circle cx="70.5" cy="10" r="3" fill={color} opacity="0.85" />
      {/* inner rune on robe */}
      <path
        d="M35 50 L40 44 L45 50 L40 56Z"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      {/* feet */}
      <ellipse cx="33" cy="80" rx="6" ry="3" fill={color} opacity="0.6" />
      <ellipse cx="47" cy="80" rx="6" ry="3" fill={color} opacity="0.6" />
      {/* glow */}
      <ellipse cx="40" cy="88" rx="18" ry="4" fill={color} opacity="0.12" />
    </AvatarSvg>
  );
}

/* ── Fairy Elf ───────────────────────────────────────────────
   Agile archer — bow + quiver + wings                          */
function FairyElfAvatar({ color }: { color: string }) {
  return (
    <AvatarSvg color={color}>
      {/* wings */}
      <path d="M40 30 Q18 20 10 35 Q18 38 40 36Z" fill={color} opacity="0.3" />
      <path d="M40 30 Q62 20 70 35 Q62 38 40 36Z" fill={color} opacity="0.3" />
      <path
        d="M40 30 Q22 22 14 32 Q22 35 40 36Z"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M40 30 Q58 22 66 32 Q58 35 40 36Z"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.6"
      />
      {/* head */}
      <ellipse cx="40" cy="14" rx="8" ry="9" fill={color} opacity="0.85" />
      {/* pointed ears */}
      <polygon points="32,12 28,8 32,16" fill={color} opacity="0.8" />
      <polygon points="48,12 52,8 48,16" fill={color} opacity="0.8" />
      {/* hair */}
      <path
        d="M32 8 Q40 4 48 8 Q46 2 40 1 Q34 2 32 8Z"
        fill={color}
        opacity="0.7"
      />
      {/* lithe torso */}
      <path
        d="M32 22 Q40 20 48 22 L50 46 Q40 48 30 46Z"
        fill={color}
        opacity="0.8"
      />
      {/* belt */}
      <rect
        x="31"
        y="43"
        width="18"
        height="3"
        rx="1.5"
        fill={color}
        opacity="0.9"
      />
      {/* left arm */}
      <path
        d="M30 22 L22 44 Q20 48 23 49 L27 38 L30 38Z"
        fill={color}
        opacity="0.7"
      />
      {/* right arm extended — bow grip */}
      <path
        d="M50 22 L66 38 Q68 42 66 44 L58 34 L52 30Z"
        fill={color}
        opacity="0.7"
      />
      {/* bow */}
      <path
        d="M68 14 Q76 30 68 50"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        opacity="0.8"
        strokeLinecap="round"
      />
      <line
        x1="68"
        y1="14"
        x2="68"
        y2="50"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.5"
        strokeDasharray="3 2"
      />
      {/* arrow */}
      <line
        x1="55"
        y1="32"
        x2="72"
        y2="32"
        stroke={color}
        strokeWidth="1.2"
        opacity="0.9"
      />
      <polygon points="73,32 70,30 70,34" fill={color} opacity="0.9" />
      <polygon points="55,32 57,30 57,34" fill={color} opacity="0.7" />
      {/* quiver */}
      <rect
        x="18"
        y="22"
        width="5"
        height="18"
        rx="2.5"
        fill={color}
        opacity="0.6"
      />
      <line
        x1="19"
        y1="25"
        x2="19"
        y2="29"
        stroke={color}
        strokeWidth="1"
        opacity="0.9"
      />
      <line
        x1="21"
        y1="24"
        x2="21"
        y2="28"
        stroke={color}
        strokeWidth="1"
        opacity="0.9"
      />
      {/* skirt / legs */}
      <path
        d="M30 46 Q28 62 24 78 L36 78 L38 56 L42 56 L44 78 L56 78 Q52 62 50 46Z"
        fill={color}
        opacity="0.7"
      />
      {/* boots */}
      <path d="M24 76 L36 76 L36 82 L22 82Z" fill={color} opacity="0.85" />
      <path d="M44 76 L56 76 L58 82 L44 82Z" fill={color} opacity="0.85" />
      {/* glow */}
      <ellipse cx="40" cy="88" rx="18" ry="4" fill={color} opacity="0.12" />
    </AvatarSvg>
  );
}

/* ── Magic Gladiator ─────────────────────────────────────────
   Hybrid warrior-mage — sword + cape + magic aura             */
function MagicGladiatorAvatar({ color }: { color: string }) {
  return (
    <AvatarSvg color={color}>
      {/* magic aura halo */}
      <ellipse cx="40" cy="12" rx="14" ry="4" fill={color} opacity="0.15" />
      {/* helm — open face */}
      <path
        d="M31 8 Q40 3 49 8 L51 20 Q40 24 29 20Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M33 10 L31 18"
        stroke="hsl(230 25% 7%)"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M47 10 L49 18"
        stroke="hsl(230 25% 7%)"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* face */}
      <ellipse cx="40" cy="16" rx="6" ry="6" fill={color} opacity="0.6" />
      {/* cape */}
      <path d="M26 24 Q16 40 18 68 L26 64 L30 48Z" fill={color} opacity="0.4" />
      <path d="M54 24 Q64 40 62 68 L54 64 L50 48Z" fill={color} opacity="0.4" />
      {/* torso */}
      <path
        d="M28 20 Q40 24 52 20 L54 48 L26 48Z"
        fill={color}
        opacity="0.82"
      />
      {/* magic rune */}
      <circle
        cx="40"
        cy="34"
        r="6"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M40 28 L42 33 L37 30 L43 30 L38 33Z"
        fill={color}
        opacity="0.5"
      />
      {/* left arm + shield energy */}
      <rect
        x="15"
        y="22"
        width="11"
        height="28"
        rx="5"
        fill={color}
        opacity="0.75"
      />
      <ellipse cx="14" cy="50" rx="4" ry="6" fill={color} opacity="0.3" />
      <ellipse cx="14" cy="50" rx="2" ry="3" fill={color} opacity="0.6" />
      {/* right arm + sword */}
      <rect
        x="54"
        y="22"
        width="11"
        height="28"
        rx="5"
        fill={color}
        opacity="0.75"
      />
      <rect
        x="65"
        y="6"
        width="4"
        height="50"
        rx="2"
        fill={color}
        opacity="0.7"
      />
      <rect
        x="60"
        y="38"
        width="14"
        height="3"
        rx="1.5"
        fill={color}
        opacity="0.9"
      />
      <polygon points="67,4 65,12 69,12" fill={color} />
      {/* legs */}
      <rect
        x="28"
        y="48"
        width="11"
        height="28"
        rx="4"
        fill={color}
        opacity="0.8"
      />
      <rect
        x="41"
        y="48"
        width="11"
        height="28"
        rx="4"
        fill={color}
        opacity="0.8"
      />
      {/* boots */}
      <path d="M28 74 L39 74 L40 82 L26 82Z" fill={color} opacity="0.9" />
      <path d="M41 74 L52 74 L54 82 L40 82Z" fill={color} opacity="0.9" />
      {/* glow */}
      <ellipse cx="40" cy="88" rx="18" ry="4" fill={color} opacity="0.12" />
    </AvatarSvg>
  );
}

/* ── Dark Lord ───────────────────────────────────────────────
   Commanding sovereign — crown + scepter + royal cape         */
function DarkLordAvatar({ color }: { color: string }) {
  return (
    <AvatarSvg color={color}>
      {/* divine crown */}
      <path
        d="M28 12 L28 6 L34 10 L40 4 L46 10 L52 6 L52 12 L28 12Z"
        fill={color}
        opacity="0.95"
      />
      <circle cx="34" cy="8" r="2" fill="hsl(45 90% 70%)" opacity="0.9" />
      <circle cx="40" cy="5" r="2.5" fill="hsl(45 90% 70%)" opacity="0.9" />
      <circle cx="46" cy="8" r="2" fill="hsl(45 90% 70%)" opacity="0.9" />
      {/* head */}
      <ellipse cx="40" cy="19" rx="9" ry="9" fill={color} opacity="0.9" />
      {/* royal robe */}
      <path
        d="M24 28 Q32 26 40 26 Q48 26 56 28 L62 82 Q40 86 18 82Z"
        fill={color}
        opacity="0.8"
      />
      {/* robe inner panel */}
      <path
        d="M34 28 L36 80 Q40 82 44 80 L46 28Q40 26 34 28Z"
        fill={color}
        opacity="0.5"
      />
      {/* fur trim */}
      <path
        d="M24 28 Q32 32 40 32 Q48 32 56 28"
        stroke="hsl(40 20% 85%)"
        strokeWidth="2.5"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
      {/* epaulettes */}
      <ellipse cx="24" cy="30" rx="7" ry="4" fill={color} opacity="0.7" />
      <ellipse cx="56" cy="30" rx="7" ry="4" fill={color} opacity="0.7" />
      {/* left arm */}
      <path
        d="M17 28 L12 56 Q10 60 13 62 L18 50 L22 38Z"
        fill={color}
        opacity="0.75"
      />
      {/* right arm / scepter */}
      <path
        d="M63 28 L68 56 Q70 60 67 62 L62 50 L58 38Z"
        fill={color}
        opacity="0.75"
      />
      {/* scepter staff */}
      <rect
        x="70"
        y="14"
        width="4"
        height="60"
        rx="2"
        fill={color}
        opacity="0.65"
      />
      {/* scepter top orb + spikes */}
      <circle cx="72" cy="10" r="6" fill={color} opacity="0.35" />
      <circle cx="72" cy="10" r="4" fill={color} opacity="0.85" />
      <polygon points="72,2 70,8 74,8" fill={color} opacity="0.9" />
      <polygon points="66,6 70,10 68,14" fill={color} opacity="0.7" />
      <polygon points="78,6 74,10 76,14" fill={color} opacity="0.7" />
      {/* robe rune */}
      <path
        d="M35 50 L40 43 L45 50 L40 57Z"
        stroke="hsl(45 90% 70%)"
        strokeWidth="0.8"
        fill="none"
        opacity="0.55"
      />
      <circle cx="40" cy="50" r="2" fill="hsl(45 90% 70%)" opacity="0.4" />
      {/* feet */}
      <ellipse cx="33" cy="83" rx="8" ry="3" fill={color} opacity="0.7" />
      <ellipse cx="47" cy="83" rx="8" ry="3" fill={color} opacity="0.7" />
      {/* glow */}
      <ellipse cx="40" cy="90" rx="20" ry="5" fill={color} opacity="0.15" />
    </AvatarSvg>
  );
}

const AVATARS: Record<MuClass, React.ComponentType<{ color: string }>> = {
  "Dark Knight": DarkKnightAvatar,
  "Dark Wizard": DarkWizardAvatar,
  "Fairy Elf": FairyElfAvatar,
  "Magic Gladiator": MagicGladiatorAvatar,
  "Dark Lord": DarkLordAvatar,
};

const ClassAvatar = ({
  muClass,
  color,
  className,
}: {
  muClass: MuClass;
  color: string;
  className?: string;
}) => {
  const Avatar = AVATARS[muClass];
  return (
    <div
      className={className}
      style={{ filter: `drop-shadow(0 0 8px ${color}55)` }}
    >
      <Avatar color={color} />
    </div>
  );
};

export default ClassAvatar;
