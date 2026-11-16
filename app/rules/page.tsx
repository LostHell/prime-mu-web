import { LegalDocument, LegalSection } from "@/app/_components/legal-document";
import { BRAND } from "@/constants/app";
import { openGraphFor } from "@/lib/utils/open-graph";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Server rules",
  description: `The rules of ${BRAND}: fair play with the official launcher, no bots, bug abuse or real-money trading, respect for other players, and the sanctions for breaking them.`,
  alternates: { canonical: "/rules" },
  openGraph: openGraphFor("/rules"),
};

const RulesPage = () => {
  return (
    <LegalDocument
      title="Server rules"
      updated="16 November 2026"
      intro={
        <p>
          These rules apply in the game, on this website and on the market. They
          keep {BRAND} fair for everyone. If something is not listed here but
          clearly harms the game or other players, the staff may still act on
          it.
        </p>
      }
    >
      <LegalSection id="fair-play" title="Fair play">
        <ul>
          <li>
            Play only with the client from the{" "}
            <Link href="/downloads">{BRAND} launcher</Link>. No modified
            clients.
          </li>
          <li>
            No bots or other programs that play for you, and no speed, damage or
            packet tools.
          </li>
          <li>
            Do not use bugs or exploits. Report them to the staff and do not
            share them with other players. Duplicating items or zen is never
            allowed.
          </li>
          <li>Do not attack or overload the server or the website.</li>
        </ul>
      </LegalSection>

      <LegalSection id="accounts" title="Accounts">
        <ul>
          <li>
            Keep your password to yourself. You are responsible for everything
            done on your account.
          </li>
          <li>The staff will never ask for your password.</li>
          <li>Do not buy, sell or take over other players&apos; accounts.</li>
        </ul>
      </LegalSection>

      <LegalSection id="trading" title="Trading">
        <ul>
          <li>
            No real-money trading: do not sell or buy items, zen, characters or
            accounts for real money or for anything outside {BRAND}.
          </li>
          <li>
            Check every trade and market listing before you confirm it. A market
            purchase completes at once.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="conduct" title="Conduct">
        <ul>
          <li>
            Respect other players and the staff: no insults, harassment, threats
            or hate speech.
          </li>
          <li>No spam, and no advertising of other servers.</li>
          <li>Do not pretend to be a member of the staff.</li>
          <li>
            Character and guild names must not be offensive and must not imitate
            the staff.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sanctions" title="Sanctions">
        <p>
          Depending on how serious a case is, the staff may warn you, restrict
          your account, remove items or zen gained by breaking the rules, or ban
          the account.
        </p>
        <p>
          Cheating, duplicating items or zen, and real-money trading can lead to
          a permanent ban of every account of the player.
        </p>
      </LegalSection>
    </LegalDocument>
  );
};

export default RulesPage;
