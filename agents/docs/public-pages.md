# Public pages: SEO, GEO and legal

## Waiting for us

- **`/terms` and `/privacy` are written but not published.** `LEGAL_CONTACT` in [`constants/app.ts`](../../constants/app.ts) is `null`. Until then both pages are `noindex`, nothing links to them, and their Contact section says the details are not published. To publish them, set it to the email that answers account and privacy requests. That one change links them in the footer, the registration text, the sitemap and `/llms.txt`, and makes them indexable ([`constants/legal.ts`](../../constants/legal.ts), tested in `constants/legal.test.ts`).
- **The owner reviews the texts first.** They are drafts, not legal advice. Open decisions:
  - Rules (`app/rules/page.tsx`): "The staff will never ask for your password"; a ban can cover every account of a player; there is no rule on several accounts per player yet.
  - Terms (`app/terms/page.tsx`): no governing-law clause; liability is excluded only "to the extent the law allows".
  - Privacy (`app/privacy/page.tsx`): the hosting location is not stated; the controller is named only by the contact email.
- When a legal text changes, update its date (the `updated` prop of `LegalDocument`). The privacy policy describes what the code does (stored fields, cookies, no analytics, no emails). Update it in the same change when that changes.

## Metadata

- Every public page sets `title`, a `description` of about 105–155 characters with facts the page shows, `alternates.canonical`, and `openGraph: openGraphFor(path)` ([`lib/utils/open-graph.ts`](../../lib/utils/open-graph.ts)). A page's own `openGraph` replaces the layout's, so always start from `openGraphFor`.
- Searches and class filters on `/rankings` are `noindex, follow` (`app/rankings/_utils/rankings-seo.ts`). `/user-panel` is `noindex` and disallowed in `app/robots.ts`. `/login` and `/register` are `noindex, follow` and not in the sitemap, but **not** disallowed: a crawler must be able to read the noindex.
- `SITE_URL` is required for `npm run build`: see [local-development.md](./local-development.md).

## Structured data and `/llms.txt`

- Render JSON-LD with `<JsonLd data={…} />` ([`components/json-ld.tsx`](../../components/json-ld.tsx)), in server components only. The builders live in [`lib/utils/json-ld.ts`](../../lib/utils/json-ld.ts) (breadcrumbs, FAQPage) and in route `_json-ld/` folders: `app/_json-ld/site.ts` (WebSite, Organization) and `app/downloads/_json-ld/game.ts` (VideoGame). `PageHero` and `LegalDocument` (`/rules`, `/terms`, `/privacy`) add the BreadcrumbList themselves, next to the breadcrumb they show.
- Structured data only states what the page shows.
- `/llms.txt` is built at build time by `app/llms.txt/_utils/llms-text.ts`. A new public page goes into `app/sitemap.ts`, into the Pages list of `llms-text.ts`, and into the Cloudflare edge cache ([deployment.md](./deployment.md)).
- `app/_constants/site-faq.ts` feeds `/faq`, its FAQPage and `/llms.txt`. The events come from `describeEvents` (`lib/game/events/describe-events.ts`). Take figures from `serverConfig` and its constants; don't hard-code them. The FAQ makes no claims about prices or payments (owner decision).

## News

- A news item is one entry in [`constants/news.ts`](../../constants/news.ts) (`id`, `date`, `dateTime`, `title`, `summary`) and its text in `app/_components/news-body.tsx`. Add it at the top of the list: newest first.
- From that entry it appears at `/news/<id>` with its full text (NewsArticle + BreadcrumbList), and with its summary on the home page and `/news`. It is also in `/news/rss.xml`, in the sitemap with its date, in `/llms.txt` and in the launcher (`/api/launcher/news` opens `/news/<id>`). An unknown id is a 404 (`dynamicParams = false`).
- `summary` is the plain-text version (about 105–155 characters) for search results, the feed and structured data: keep it in step with the text.
- Take every figure in a news text from the server config or the site's limits, not typed in (tested in `app/_components/news-body.test.tsx`), and check each claim against the code: for example, resets, Add stats, the market and deposits all need the account logged out of the game.

## Links

- Header and mobile menu: `NAVIGATION_ITEMS` ([`constants/navigation.ts`](../../constants/navigation.ts)).
- Footer: those pages, then FAQ, then `LEGAL_LINKS` ([`constants/footer.ts`](../../constants/footer.ts)). The FAQ and the legal pages are linked only from the footer.

## Existing exceptions (don't copy)

- `app/downloads/_components/downloads-content.tsx` renders its FAQPage with an inline `<script>` and its own `app/downloads/_json-ld/faq.ts`, not `<JsonLd>` and `faqPageJsonLd`.
