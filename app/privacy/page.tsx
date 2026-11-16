import {
  LegalContact,
  LegalDocument,
  LegalSection,
} from "@/app/_components/legal-document";
import { BRAND } from "@/constants/app";
import { CHARACTER_SELECTION_COOKIE } from "@/constants/character-selection";
import { LEGAL_PAGES_PUBLISHED } from "@/constants/legal";
import { openGraphFor } from "@/lib/utils/open-graph";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `What personal data ${BRAND} keeps, why, which cookies the site uses, how long the data is kept, and how to see, change or delete it.`,
  alternates: { canonical: "/privacy" },
  openGraph: openGraphFor("/privacy"),
  // Unlisted until there is a contact (constants/app.ts LEGAL_CONTACT).
  ...(LEGAL_PAGES_PUBLISHED ? {} : { robots: { index: false, follow: true } }),
};

const PrivacyPage = () => {
  return (
    <LegalDocument
      title="Privacy policy"
      updated="16 November 2026"
      intro={
        <p>
          This policy explains what personal data {BRAND} keeps when you use
          this website and play the game, and what you can do about it.
          Questions and requests go to the contact at the end of this page.
        </p>
      }
    >
      <LegalSection id="data" title="What we keep">
        <ul>
          <li>
            <strong>Your account:</strong> your username, your email address and
            your password. The password is stored in an encoded form, the way
            the game server needs it. Use a password you do not use anywhere
            else.
          </li>
          <li>
            <strong>Your game data:</strong> your characters and their stats,
            items, zen, warehouse, guild, market listings and purchases, and
            deposits.
          </li>
          <li>
            <strong>Connection data:</strong> the game server records the IP
            address of your latest connection, when you connected and
            disconnected, and your total time online. It may also write
            technical log files that include IP addresses.
          </li>
          <li>
            <strong>Website requests:</strong> like most websites, the server
            that hosts this site may keep technical logs of requests, such as
            the IP address and the page asked for.
          </li>
        </ul>
        <p>
          The site has no analytics, advertising or tracking, and it does not
          send you emails.
        </p>
      </LegalSection>

      <LegalSection id="purposes" title="Why we keep it">
        <ul>
          <li>
            To create your account and let you play and use the website: this is
            needed to provide the game to you (GDPR Art. 6(1)(b)).
          </li>
          <li>
            To keep the server and the website secure and to find cheating and
            abuse, using connection data and logs: this is our legitimate
            interest in a fair and working game (GDPR Art. 6(1)(f)).
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="public" title="What others can see">
        <p>
          The <Link href="/rankings">rankings</Link> show character names,
          classes, levels, resets, guilds, scores and who is online now. Your
          username, email address and IP address are never shown.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies">
        <p>
          The site uses only the cookies it needs to work, so it does not ask
          for consent:
        </p>
        <ul>
          <li>
            <strong>authjs.session-token</strong> (with a __Secure- prefix on
            HTTPS) keeps you logged in. It ends when you log out or after 30
            days without use.
          </li>
          <li>
            <strong>authjs.csrf-token</strong> and{" "}
            <strong>authjs.callback-url</strong> protect the login form and
            bring you back to the page you came from. They end when you close
            the browser.
          </li>
          <li>
            <strong>{CHARACTER_SELECTION_COOKIE}</strong> remembers which
            character you picked in the user panel, for up to a year.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sharing" title="Who receives it">
        <p>
          Your data is not sold or shared for marketing. It is stored on the
          server that runs {BRAND}, and the hosting provider of that server
          processes it on our behalf. It is given to others only when the law
          requires it.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="How long we keep it">
        <p>
          Your account and game data are kept for as long as your account
          exists. The IP address of a connection is replaced by the next one. On
          request, we delete your account and the personal data that belongs to
          it.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="Your rights">
        <p>Under the GDPR you can ask:</p>
        <ul>
          <li>to see the personal data we keep about you;</li>
          <li>
            to correct it (you can change your email address and password
            yourself in the user panel);
          </li>
          <li>to delete your account and its personal data;</li>
          <li>
            to restrict or object to how we use it, and to receive it in a
            common format.
          </li>
        </ul>
        <p>
          You can also complain to the data protection authority of your
          country.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes">
        <p>
          This policy may change. The date at the top shows the latest version.
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

export default PrivacyPage;
