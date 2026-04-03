"use client";

import ClassAvatar from "@/components/class-avatar";
import Divider from "@/components/divider";
import PageLayout from "@/components/page-layout";
import {
  BarChart3,
  ChevronRight,
  Compass,
  Key,
  Lock,
  LogIn,
  Mail,
  RotateCcw,
  Settings,
  ShieldOff,
  Swords,
  User,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";

type MuClass = "Dark Knight" | "Dark Wizard" | "Fairy Elf" | "Magic Gladiator" | "Dark Lord";

interface Character {
  name: string;
  class: MuClass;
  level: number;
  resets: number;
  guild?: string;
  zen: number;
  pkCount: number;
  freePoints: number;
  stats: { str: number; agi: number; vit: number; ene: number; cmd: number };
}

const EMPTY_CHARACTERS: Character[] = [];

// Classes that have the Command stat
const CMD_CLASSES: MuClass[] = ["Dark Lord"];

const CLASS_COLOR: Record<string, string> = {
  "Dark Knight": "hsl(0 70% 55%)",
  "Dark Wizard": "hsl(220 80% 65%)",
  "Fairy Elf": "hsl(130 60% 50%)",
  "Magic Gladiator": "hsl(270 70% 65%)",
  "Dark Lord": "hsl(45 90% 55%)",
};

const MU_CLASS_BY_ID: Record<number, MuClass> = {
  0: "Dark Wizard",
  1: "Dark Knight",
  2: "Fairy Elf",
  3: "Magic Gladiator",
  4: "Dark Lord",
};

type Section = "overview" | "add-stats" | "reset" | "clear-pk" | "unstuck";

const SIDEBAR: { id: Section; label: string; Icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", Icon: BarChart3 },
  { id: "add-stats", label: "Add Stats", Icon: Swords },
  { id: "reset", label: "Reset Character", Icon: RotateCcw },
  { id: "clear-pk", label: "Clear PK", Icon: ShieldOff },
  { id: "unstuck", label: "Unstuck", Icon: Compass },
];

/* ─── Helpers ────────────────────────────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-sm font-serif uppercase tracking-widest mb-2"
      style={{ color: "hsl(var(--gold))" }}
    >
      {children}
    </label>
  );
}

function Feedback({ type, message }: { type: "success" | "error"; message: string }) {
  return (
    <div
      className="text-sm font-semibold px-4 py-3 rounded border"
      style={{
        color: type === "success" ? "hsl(130 60% 50%)" : "hsl(var(--crimson))",
        borderColor: type === "success" ? "hsl(130 60% 50% / 0.4)" : "hsl(var(--crimson) / 0.4)",
        backgroundColor:
          type === "success" ? "hsl(130 60% 50% / 0.08)" : "hsl(var(--crimson) / 0.08)",
      }}
    >
      {message}
    </div>
  );
}

function ConfirmAction({
  label,
  description,
  buttonLabel,
  buttonColor,
  onConfirm,
}: {
  label: string;
  description: string;
  buttonLabel: string;
  buttonColor: string;
  onConfirm: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      {!confirmed ? (
        <button
          className="btn-outline w-full"
          style={{ borderColor: buttonColor, color: buttonColor }}
          onClick={() => setConfirmed(true)}
        >
          {label}
        </button>
      ) : (
        <div className="space-y-3">
          <p
            className="text-sm text-center font-semibold uppercase tracking-widest"
            style={{ color: buttonColor }}
          >
            Are you sure? This cannot be undone.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-outline" onClick={() => setConfirmed(false)}>
              Cancel
            </button>
            <button
              className="btn-outline"
              style={{
                borderColor: buttonColor,
                color: buttonColor,
                background: `${buttonColor}18`,
              }}
              onClick={() => {
                setConfirmed(false);
                onConfirm();
              }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
const UserPanel = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [chars, setChars] = useState<Character[]>(EMPTY_CHARACTERS);
  const [isLoadingChars, setIsLoadingChars] = useState(true);
  const [section, setSection] = useState<Section>("overview");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  // Always operate on the selected character, kept in sync inside chars[]
  const char = selectedChar!;
  const setChar = (updater: (prev: Character) => Character) => {
    setChars((prev) => prev.map((c) => (c.name === char.name ? updater(c) : c)));
    setSelectedChar((prev) => (prev ? updater(prev) : prev));
  };

  const hasCmd = selectedChar ? CMD_CLASSES.includes(selectedChar.class) : false;

  /* login form */
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  /* add-stats form */
  const [pts, setPts] = useState({ str: 0, agi: 0, vit: 0, ene: 0, cmd: 0 });

  /* account settings – change password */
  const [pwCur, setPwCur] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwCnf, setPwCnf] = useState("");
  const [pwFeedback, setPwFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* account settings – change email */
  const [emailNew, setEmailNew] = useState("");
  const [emailPass, setEmailPass] = useState("");
  const [emailFeedback, setEmailFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* account settings panel open state */
  const [accountOpen, setAccountOpen] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const response = await fetch("/api/user-panel/characters", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load characters.");
        }

        const data = (await response.json()) as {
          characters: Array<{
            name: string;
            classId: number | null;
            level: number | null;
            resets: number | null;
            zen: number | null;
            pkCount: number | null;
            freePoints: number | null;
            strength: number | null;
            agility: number | null;
            vitality: number | null;
            energy: number | null;
            command: number | null;
          }>;
        };

        const mappedCharacters: Character[] = data.characters.map((character) => ({
          name: character.name,
          class: MU_CLASS_BY_ID[character.classId ?? 0] ?? "Dark Wizard",
          level: character.level ?? 1,
          resets: character.resets ?? 0,
          guild: undefined,
          zen: character.zen ?? 0,
          pkCount: character.pkCount ?? 0,
          freePoints: character.freePoints ?? 0,
          stats: {
            str: character.strength ?? 0,
            agi: character.agility ?? 0,
            vit: character.vitality ?? 0,
            ene: character.energy ?? 0,
            cmd: character.command ?? 0,
          },
        }));

        setChars(mappedCharacters);
      } catch {
        setChars([]);
      } finally {
        setIsLoadingChars(false);
      }
    };

    void loadCharacters();
  }, []);

  const flash = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser || !loginPass) return;
    setIsLoggedIn(true);
    setSelectedChar(null); // show character select first
    setSection("overview");
  };

  const ptsTotal = Object.values(pts).reduce((a, b) => a + b, 0);

  const handleAddStats = (e: React.FormEvent) => {
    e.preventDefault();
    if (ptsTotal === 0) return;
    if (ptsTotal > char.freePoints) {
      flash("error", "Not enough free stat points.");
      return;
    }
    setChar((prev) => ({
      ...prev,
      freePoints: prev.freePoints - ptsTotal,
      stats: {
        str: prev.stats.str + pts.str,
        agi: prev.stats.agi + pts.agi,
        vit: prev.stats.vit + pts.vit,
        ene: prev.stats.ene + pts.ene,
        cmd: prev.stats.cmd + pts.cmd,
      },
    }));
    setPts({ str: 0, agi: 0, vit: 0, ene: 0, cmd: 0 });
    flash("success", "Stats added successfully.");
  };

  /* ─── Dashboard sections ─── */
  function renderSection() {
    switch (section) {
      case "overview":
        return (
          <div className="space-y-6">
            <h2 className="section-title">Character Overview</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Name", value: char.name },
                { label: "Class", value: char.class, color: CLASS_COLOR[char.class] },
                { label: "Level", value: char.level },
                { label: "Resets", value: char.resets },
                { label: "Guild", value: char.guild ?? "—" },
                { label: "Zen", value: char.zen.toLocaleString() },
                { label: "Free Points", value: char.freePoints },
                {
                  label: "PK Count",
                  value: char.pkCount,
                  color: char.pkCount > 0 ? "hsl(var(--crimson))" : undefined,
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground text-sm">{label}</span>
                  <span
                    className="font-semibold text-sm"
                    style={{ color: color ?? "hsl(var(--gold))" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="ornament-line" />
            <h3
              className="font-serif text-sm uppercase tracking-widest"
              style={{ color: "hsl(var(--gold))" }}
            >
              Base Stats
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {(Object.entries(char.stats) as [string, number][]).map(([key, val]) => (
                <div key={key} className="stat-card py-3 px-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                    {key}
                  </div>
                  <div className="font-bold font-mono" style={{ color: "hsl(var(--gold))" }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "add-stats":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Add Stats</h2>
              <span className="text-xs font-mono" style={{ color: "hsl(var(--gold))" }}>
                {char.freePoints - ptsTotal} pts remaining
              </span>
            </div>
            <form onSubmit={handleAddStats} className="space-y-4">
              {(["str", "agi", "vit", "ene", "cmd"] as const)
                .filter((s) => s !== "cmd" || hasCmd)
                .map((stat) => {
                  const labels: Record<string, string> = {
                    str: "Strength",
                    agi: "Agility",
                    vit: "Vitality",
                    ene: "Energy",
                    cmd: "Command",
                  };
                  return (
                    <div key={stat} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                      <div>
                        <div
                          className="text-xs font-serif uppercase tracking-widest mb-1"
                          style={{ color: "hsl(var(--gold))" }}
                        >
                          {labels[stat]}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {char.stats[stat]} →{" "}
                          <span style={{ color: "hsl(var(--gold-glow))" }}>
                            {char.stats[stat] + pts[stat]}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-outline"
                        style={{ padding: "0.25rem 0.75rem", fontSize: "1rem", lineHeight: 1 }}
                        onClick={() =>
                          pts[stat] > 0 && setPts((p) => ({ ...p, [stat]: p[stat] - 1 }))
                        }
                      >
                        −
                      </button>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={char.freePoints}
                          value={pts[stat]}
                          onChange={(e) => {
                            const v = Math.max(
                              0,
                              Math.min(Number(e.target.value), char.freePoints),
                            );
                            setPts((p) => ({ ...p, [stat]: v }));
                          }}
                          className="input-gold text-center font-mono"
                          style={{ width: "4.5rem" }}
                        />
                        <button
                          type="button"
                          className="btn-outline"
                          style={{ padding: "0.25rem 0.75rem", fontSize: "1rem", lineHeight: 1 }}
                          onClick={() =>
                            ptsTotal < char.freePoints &&
                            setPts((p) => ({ ...p, [stat]: p[stat] + 1 }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              <div className="ornament-line" />
              {feedback && <Feedback {...feedback} />}
              <button type="submit" className="btn-gold w-full" disabled={ptsTotal === 0}>
                Apply {ptsTotal > 0 ? `(${ptsTotal} pts)` : ""}
              </button>
            </form>
          </div>
        );

      case "reset":
        return (
          <div className="space-y-6">
            <h2 className="section-title">Reset Character</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Current Resets", value: char.resets },
                { label: "Current Level", value: char.level },
                { label: "Points per Reset", value: "+5000" },
                { label: "Level after Reset", value: 1 },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground text-sm">{label}</span>
                  <span className="font-semibold text-sm" style={{ color: "hsl(var(--gold))" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="ornament-line" />
            {feedback && <Feedback {...feedback} />}
            <ConfirmAction
              label="Reset Character"
              description="Resetting will set your level back to 1 and grant you bonus stat points. Your items and zen are preserved."
              buttonLabel="Confirm Reset"
              buttonColor="hsl(var(--crimson))"
              onConfirm={() => {
                setChar((prev) => ({
                  ...prev,
                  resets: prev.resets + 1,
                  level: 1,
                  freePoints: prev.freePoints + 5000,
                }));
                flash(
                  "success",
                  `Character reset! Resets: ${char.resets + 1}. +5000 stat points granted.`,
                );
              }}
            />
          </div>
        );

      case "clear-pk":
        return (
          <div className="space-y-6">
            <h2 className="section-title">Clear PK</h2>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground text-sm">Current PK Count</span>
              <span
                className="font-bold font-mono text-sm"
                style={{ color: char.pkCount > 0 ? "hsl(var(--crimson))" : "hsl(130 60% 50%)" }}
              >
                {char.pkCount}
              </span>
            </div>
            <div className="ornament-line" />
            {feedback && <Feedback {...feedback} />}
            {char.pkCount === 0 ? (
              <p className="text-sm text-center text-muted-foreground">
                Your character has no PK kills. Nothing to clear.
              </p>
            ) : (
              <ConfirmAction
                label="Clear PK Status"
                description="This will remove all Player Killer marks from your character, allowing you to enter towns and interact with NPCs freely."
                buttonLabel="Confirm Clear"
                buttonColor="hsl(var(--crimson))"
                onConfirm={() => {
                  setChar((prev) => ({ ...prev, pkCount: 0 }));
                  flash("success", "PK status cleared. You are no longer a Player Killer.");
                }}
              />
            )}
          </div>
        );

      case "unstuck":
        return (
          <div className="space-y-6">
            <h2 className="section-title">Unstuck</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If your character is trapped or stuck in a location, use this to teleport safely to{" "}
              <span style={{ color: "hsl(var(--gold))" }}>Lorencia</span>. Can only be used once
              every 10 minutes.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Destination", value: "Lorencia" },
                { label: "Cooldown", value: "10 minutes" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground text-sm">{label}</span>
                  <span className="font-semibold text-sm" style={{ color: "hsl(var(--gold))" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="ornament-line" />
            {feedback && <Feedback {...feedback} />}
            <button
              className="btn-gold w-full"
              onClick={() => flash("success", "Your character has been teleported to Lorencia.")}
            >
              Teleport to Lorencia
            </button>
          </div>
        );
    }
  }

  /* ─── Character select screen ─── */
  if (isLoggedIn && !selectedChar) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 animate-fade-up">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold gold-gradient-text">
                Select Character
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Choose a character to manage</p>
            </div>
          </div>

          <div
            className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 animate-fade-up"
            style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
          >
            {isLoadingChars && (
              <div className="col-span-full text-center text-muted-foreground text-sm">
                Loading your characters...
              </div>
            )}
            {!isLoadingChars && chars.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground text-sm">
                No characters found on this account yet.
              </div>
            )}
            {chars.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setSelectedChar(c);
                  setSection("overview");
                  setFeedback(null);
                }}
                className="card-dark card-hover p-5 flex flex-col items-center text-center transition-all group relative overflow-hidden"
                style={{ borderColor: CLASS_COLOR[c.class] + "55" }}
              >
                {/* subtle class-color background wash */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${CLASS_COLOR[c.class]}18 0%, transparent 70%)`,
                  }}
                />

                {/* avatar */}
                <ClassAvatar
                  muClass={c.class}
                  color={CLASS_COLOR[c.class]}
                  className="w-20 h-24 mb-3"
                />

                {/* class label */}
                <span
                  className="text-xs font-serif uppercase tracking-widest mb-1"
                  style={{ color: CLASS_COLOR[c.class] }}
                >
                  {c.class}
                </span>

                {/* character name */}
                <div className="font-serif font-bold text-base gold-gradient-text mb-3">
                  {c.name}
                </div>

                <div className="ornament-line w-full mb-3" />

                <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1">
                  {[
                    { label: "Level", value: c.level },
                    { label: "Resets", value: c.resets },
                    { label: "Guild", value: c.guild ?? "—" },
                    {
                      label: "PK",
                      value: c.pkCount,
                      color: c.pkCount > 0 ? "hsl(var(--crimson))" : undefined,
                    },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: color ?? "hsl(var(--gold))" }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <ChevronRight
                  className="absolute top-3 right-3 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: CLASS_COLOR[c.class] }}
                />
              </button>
            ))}
          </div>

          {/* Account Settings */}
          <div
            className="mt-8 animate-fade-up"
            style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
          >
            <Divider />
            <button
              className="flex items-center gap-3 w-full mb-4"
              onClick={() => {
                setAccountOpen((v) => !v);
                setPwFeedback(null);
                setEmailFeedback(null);
              }}
            >
              <Settings className="w-5 h-5" style={{ color: "hsl(var(--gold))" }} />
              <h2 className="section-title">Account Settings</h2>
              <ChevronRight
                className="w-4 h-4 ml-auto transition-transform duration-200"
                style={{
                  color: "hsl(var(--gold))",
                  transform: accountOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {accountOpen && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Change Password */}
                <div className="card-dark p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Key className="w-5 h-5" style={{ color: "hsl(var(--gold))" }} />
                    <h3
                      className="font-serif text-base font-bold uppercase tracking-widest"
                      style={{ color: "hsl(var(--gold))" }}
                    >
                      Change Password
                    </h3>
                  </div>
                  <div className="ornament-line mb-4" />
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!pwCur || !pwNew || !pwCnf) return;
                      if (pwNew !== pwCnf) {
                        setPwFeedback({ type: "error", message: "New passwords do not match." });
                        return;
                      }
                      if (pwNew.length < 6) {
                        setPwFeedback({
                          type: "error",
                          message: "Password must be at least 6 characters.",
                        });
                        return;
                      }
                      setPwCur("");
                      setPwNew("");
                      setPwCnf("");
                      setPwFeedback({ type: "success", message: "Password changed successfully." });
                      setTimeout(() => setPwFeedback(null), 3500);
                    }}
                  >
                    <div>
                      <FieldLabel>Current Password</FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="password"
                          placeholder="Current password"
                          className="input-gold pl-9"
                          value={pwCur}
                          onChange={(e) => setPwCur(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>New Password</FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="password"
                          placeholder="New password (6–10 chars)"
                          className="input-gold pl-9"
                          value={pwNew}
                          onChange={(e) => setPwNew(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Confirm New Password</FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="password"
                          placeholder="Repeat new password"
                          className="input-gold pl-9"
                          value={pwCnf}
                          onChange={(e) => setPwCnf(e.target.value)}
                        />
                      </div>
                    </div>
                    {pwFeedback && <Feedback {...pwFeedback} />}
                    <button type="submit" className="btn-gold w-full">
                      Save Password
                    </button>
                  </form>
                </div>

                {/* Change Email */}
                <div className="card-dark p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-5 h-5" style={{ color: "hsl(var(--gold))" }} />
                    <h3
                      className="font-serif text-base font-bold uppercase tracking-widest"
                      style={{ color: "hsl(var(--gold))" }}
                    >
                      Change Email
                    </h3>
                  </div>
                  <div className="ornament-line mb-4" />
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!emailNew || !emailPass) return;
                      if (!emailNew.includes("@")) {
                        setEmailFeedback({
                          type: "error",
                          message: "Please enter a valid email address.",
                        });
                        return;
                      }
                      setEmailNew("");
                      setEmailPass("");
                      setEmailFeedback({ type: "success", message: "Email updated successfully." });
                      setTimeout(() => setEmailFeedback(null), 3500);
                    }}
                  >
                    <div>
                      <FieldLabel>New Email</FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          placeholder="New email address"
                          className="input-gold pl-9"
                          value={emailNew}
                          onChange={(e) => setEmailNew(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Current Password</FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="password"
                          placeholder="Confirm with your password"
                          className="input-gold pl-9"
                          value={emailPass}
                          onChange={(e) => setEmailPass(e.target.value)}
                        />
                      </div>
                    </div>
                    {emailFeedback && <Feedback {...emailFeedback} />}
                    <button type="submit" className="btn-gold w-full">
                      Save Email
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
    );
  }

  /* ─── Logged-in dashboard ─── */
  if (isLoggedIn) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-up">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold gold-gradient-text">
                User Panel
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Welcome back,{" "}
                <span className="font-semibold" style={{ color: CLASS_COLOR[char.class] }}>
                  {char.name}
                </span>
                <span className="text-muted-foreground"> &mdash; </span>
                <span className="text-xs" style={{ color: CLASS_COLOR[char.class] }}>
                  {char.class}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn-outline flex items-center gap-2"
                style={{ padding: "0.5rem 1rem" }}
                onClick={() => {
                  setSelectedChar(null);
                  setFeedback(null);
                }}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Characters</span>
              </button>
            </div>
          </div>

          <div
            className="grid md:grid-cols-[220px_1fr] gap-6 animate-fade-up"
            style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
          >
            {/* Sidebar */}
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {SIDEBAR.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setSection(id);
                    setFeedback(null);
                  }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded text-left whitespace-nowrap transition-all duration-200 font-serif text-xs uppercase tracking-widest"
                  style={{
                    background: section === id ? "hsl(var(--gold) / 0.12)" : "transparent",
                    color: section === id ? "hsl(var(--gold))" : "hsl(var(--muted-foreground))",
                    borderLeft:
                      section === id ? "2px solid hsl(var(--gold))" : "2px solid transparent",
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>

            {/* Content */}
            <div className="card-dark p-6 min-h-100">
              {renderSection()}
              {section !== "add-stats" &&
                section !== "reset" &&
                section !== "clear-pk" &&
                section !== "unstuck" &&
                feedback && (
                  <div className="mt-4">
                    <Feedback {...feedback} />
                  </div>
                )}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  /* ─── Logged-out (login / register) ─── */
  return (
    <PageLayout>
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="font-serif text-4xl md:text-5xl font-bold gold-gradient-text mb-4">
            User Panel
          </h1>
          <p className="text-muted-foreground text-lg">Manage your account</p>
        </div>

        {/* Tab Switcher */}
        <div
          className="flex mb-8 border-b border-border animate-fade-up"
          style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
        >
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 font-serif text-sm uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "login" ? (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" /> Login
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" /> Register
                </span>
              )}
            </button>
          ))}
        </div>

        <div
          className="card-dark p-6 card-hover animate-fade-up"
          style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
        >
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <FieldLabel>Username</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="input-gold pl-10"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="input-gold pl-10"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn-gold w-full">
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div>
                <FieldLabel>Username</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Choose username (4–10 chars)"
                    className="input-gold pl-10"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="email" placeholder="Enter email" className="input-gold pl-10" />
                </div>
              </div>
              <div>
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Choose password (6–10 chars)"
                    className="input-gold pl-10"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Confirm Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="input-gold pl-10"
                  />
                </div>
              </div>
              <button type="submit" className="btn-gold w-full">
                Create Account
              </button>
            </form>
          )}
        </div>

        <Divider className="mt-8" />
      </div>
    </PageLayout>
  );
};

export default UserPanel;
