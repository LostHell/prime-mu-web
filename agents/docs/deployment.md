# Deployment: Cloudflare edge cache and Coolify

The site runs on Coolify behind Cloudflare (Free plan) at `blackmu.net`. `www.blackmu.net` 301-redirects to the apex.

## Cloudflare edge cache

[`next.config.ts`](../../next.config.ts) adds a `Cloudflare-CDN-Cache-Control` header from [`lib/utils/cdn-cache.ts`](../../lib/utils/cdn-cache.ts) (tested in `cdn-cache.test.ts`). Only Cloudflare reads it; browsers keep Next's `Cache-Control: private, no-cache, no-store`. The Free plan cannot set an Edge TTL under 2 hours in the dashboard, which is why the TTL comes from the app.

| Pages                                                                                                         | Header                                       | Why                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `LIVE_PAGES`: `/`, `/rankings` (every `view`, search and page), `/server-info`, `/downloads`, `/faq`, `/news` | `public, max-age=60, stale-if-error=86400`   | Live game data: the online/offline status, online count, rankings, online list, the launcher release (uploaded without a deploy). |
| `CONTENT_PAGES`: `/rules`, `/terms`, `/privacy`, `/news/<id>`, `/news/rss.xml`, `/llms.txt`                   | `public, max-age=3600, stale-if-error=86400` | Change only on a deploy, which purges the cache.                                                                                  |
| `PRIVATE_PAGES`: `/user-panel` and below, `/login`, `/register`, `/forgot-password`, `/reset-password`        | `no-store`                                   | Personal or sign-in pages, for everyone.                                                                                          |
| Everything else (`/api/`, `/_next/`, `/patches/`, `/downloads/launcher/`, `public/` files, 404s)              | none                                         | Cloudflare's own rules apply.                                                                                                     |

- The public headers are **not** sent when the request has `authjs.session-token` or `__Secure-authjs.session-token` (the header shows the account) or an `RSC` header (the client router gets an RSC payload on the same URL). Next matches `missing` cookies by exact name.
- **A new public page** goes into `LIVE_PAGES` (it reads the game database, the server status or the launcher folder) or `CONTENT_PAGES`, and into Cloudflare rule 1 below. A new personal page goes into `PRIVATE_PAGES` and rule 2. Without that the page is simply not cached.
- `stale-if-error=86400` lets Cloudflare serve the last copy for a day while the app is down. A purge drops those copies too: never purge right before a planned restart.
- Check it on a dev server: `curl -sI http://localhost:3000/rules` shows the header; with `-H "Cookie: authjs.session-token=x"` or `-H "RSC: 1"` it is gone.

## Cloudflare Cache Rules

Caching → Cache Rules, in this order (the later rule wins):

1. **Cache public pages**, Expression:

   ```
   (http.host eq "blackmu.net" and (http.request.uri.path in {"/" "/rankings" "/server-info" "/downloads" "/faq" "/news" "/rules" "/terms" "/privacy" "/llms.txt"} or starts_with(http.request.uri.path, "/news/")))
   ```

   → Eligible for cache; Edge TTL "Use cache-control header if present, bypass cache if not"; Browser TTL "Respect origin"; Serve stale content while revalidating on.

   It lists the pages instead of "everything outside `/_next/`, `/api/`, `/patches/`": Next sends `public` files (item icons, the hero banner) with `Cache-Control: public, max-age=0`, so a catch-all rule would stop Cloudflare's default caching of those files, and the launcher downloads are large files.

2. **Bypass private and signed-in**, Expression:

   ```
   (http.cookie contains "authjs.session-token") or (http.request.uri.query contains "_rsc=") or starts_with(http.request.uri.path, "/user-panel") or (http.request.uri.path in {"/login" "/register" "/forgot-password" "/reset-password"})
   ```

   → Bypass cache. `contains` also catches `__Secure-authjs.session-token` and chunked session cookies.

Check with `cf-cache-status`: public pages `MISS`, then `HIT`; with the session cookie, with `?_rsc=`, and on private pages `DYNAMIC`.

## Coolify: purge after a deploy

The app → Configuration → General → Post-deployment command. The app has no Docker Compose service in this repo (Coolify builds the single app container), so leave Container Name empty: the command runs in the app's container. Set `CLOUDFLARE_ZONE_ID` (the `blackmu.net` zone) and `CLOUDFLARE_API_TOKEN` (a custom API token with only Zone → Cache Purge → Purge on `blackmu.net`) as runtime environment variables. The app does not read them.

```
node -e "fetch('https://api.cloudflare.com/client/v4/zones/'+process.env.CLOUDFLARE_ZONE_ID+'/purge_cache',{method:'POST',headers:{Authorization:'Bearer '+process.env.CLOUDFLARE_API_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({purge_everything:true})}).then(r=>r.json()).then(j=>console.log('Cloudflare purge',j.success,JSON.stringify(j.errors)))"
```

The deploy log shows `Cloudflare purge true []` when it worked. Test a new token first: `curl -X POST https://api.cloudflare.com/client/v4/zones/<zone id>/purge_cache -H "Authorization: Bearer <token>" -H "Content-Type: application/json" --data '{"purge_everything":true}'`.

## IndexNow (Bing, Yandex)

`INDEXNOW_KEY` (runtime variable in Coolify; 8–128 letters, digits or dashes, e.g. `openssl rand -hex 16`) turns it on. The key is served at `/indexnow-key.txt` ([`app/indexnow-key.txt/route.ts`](../../app/indexnow-key.txt/route.ts)), so the search engines can check that the submission is ours.

News, pages and the sitemap change only with a deploy, so [`instrumentation.ts`](../../instrumentation.ts) sends every sitemap URL to `api.indexnow.org` once when the production server starts (`submitToIndexNow` in [`lib/utils/indexnow.ts`](../../lib/utils/indexnow.ts)). It does nothing in `next dev`, without the key or on a local `SITE_URL`, and never blocks the start. The app log shows `IndexNow: <n> URLs, HTTP 200` (or `202` while the key is still being checked). Never change the key after the first submission without a reason: the engines then have to check the new one.

## Email (Resend): password reset

`RESEND_API_KEY` and `MAIL_FROM` (runtime variables in Coolify) let `/forgot-password` send its links ([`lib/mail/send-mail.ts`](../../lib/mail/send-mail.ts)). In Resend: Domains → add `blackmu.net` → add the DNS records it shows (SPF, DKIM, and the MX of its sending subdomain) in Cloudflare DNS as **DNS only** (grey cloud) → wait for Verified. Then API Keys → a key with "Sending access" only → `RESEND_API_KEY`, and `MAIL_FROM=Black MU <no-reply@blackmu.net>`. Without a verified domain Resend sends only to the account owner's own address. A failed send shows `Mail: Resend answered HTTP <status>` in the app log; the player still sees the usual answer.

The links point at `SITE_URL`, and work for `PASSWORD_RESET_LINK_MINUTES` ([`constants/password-reset.ts`](../../constants/password-reset.ts)) and once. They are signed with `AUTH_SECRET`: changing it ends every open link and every session.
