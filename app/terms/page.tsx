import {
  LegalContact,
  LegalDocument,
  LegalSection,
} from "@/app/_components/legal-document";
import { BRAND } from "@/constants/app";
import { LEGAL_PAGES_PUBLISHED } from "@/constants/legal";
import { VERSION } from "@/constants/server";
import { openGraphFor } from "@/lib/utils/open-graph";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `The terms for using ${BRAND}: your account, the server rules, game items and the market, availability, and how the terms change.`,
  alternates: { canonical: "/terms" },
  openGraph: openGraphFor("/terms"),
  // Unlisted until there is a contact (constants/app.ts LEGAL_CONTACT).
  ...(LEGAL_PAGES_PUBLISHED ? {} : { robots: { index: false, follow: true } }),
};

const TermsPage = () => {
  return (
    <LegalDocument
      title="Terms of use"
      updated="16 November 2026"
      intro={
        <p>
          By creating an account or playing {BRAND} you accept these terms and
          the <Link href="/rules">server rules</Link>.
        </p>
      }
    >
      <LegalSection id="service" title="The service">
        <p>
          {BRAND} is an independent private server for MU Online {VERSION}, with
          this website and its game launcher. It is not affiliated with or
          endorsed by Webzen Inc. MU Online is a registered trademark of Webzen
          Inc.
        </p>
      </LegalSection>

      <LegalSection id="account" title="Your account">
        <ul>
          <li>
            One account signs in to the game and to this website. Use an email
            address you can access: it is how the staff can tell that an account
            is yours.
          </li>
          <li>
            Keep your password secure. You are responsible for everything done
            on your account.
          </li>
          <li>
            The staff may restrict or close an account that breaks these terms
            or the <Link href="/rules">server rules</Link>.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="game-content" title="Characters, items and the market">
        <ul>
          <li>
            Characters, items, zen and other game content have no real-world
            value and are not your property.
          </li>
          <li>
            The staff may change, balance, reset or remove game content, for
            example to fix a bug or to restart the server.
          </li>
          <li>
            Trades on the market are between players. Check a listing and its
            price before you buy: a purchase completes at once.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="availability" title="Availability">
        <p>
          The server and the website are provided as they are, without any
          guarantee that they are always available. They may be down for
          maintenance, change, or stop. To the extent the law allows, {BRAND} is
          not liable for lost game progress, items or data.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes">
        <p>
          These terms may change. The date at the top shows the latest version.
          Playing after a change means you accept the new terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          <LegalContact />
        </p>
      </LegalSection>
    </LegalDocument>
  );
};

export default TermsPage;
