# Design system

This repo uses **Tailwind CSS + shadcn/ui primitives** under `components/ui/*`, with theme tokens defined in `app/globals.css` (CSS variables like `--background`, `--primary`, `--gold`, etc.).

The published design system (brand book, tokens, component guidelines) is generated from this repo. This file is the in-repo source of truth for agents.

## Keep in sync (required)

Any change to **`app/globals.css`** or **`components/ui/*`** must update this doc **in the same change**:

- New, renamed, re-valued or removed token: update the [Tokens](#tokens) tables below.
- New, removed or re-styled primitive (variant, size, default): update [Components](#components).
- Then note in the PR description: "Design system needs a re-sync". The published design system only updates when someone asks Claude to re-sync it from this repo.

The same applies to the shared brand components (`components/ui/text.tsx`, `headline.tsx`, `ornament-line.tsx`, `components/divider.tsx`, `components/logo.tsx`, `components/page-layout.tsx`).

## Lint guardrail

`eslint.config.mjs` adds a `no-restricted-syntax` rule for `app/**` and `components/**` (excluding `components/ui/**` and tests). It errors on:

- hex colors (`#abc`, `#aabbcc`) in `className`, `style`, `cn()`, `cva()`, `clsx()`;
- arbitrary color values (`bg-[#…]`, `text-[rgba(…)]`, `border-[hsl(…)]`, `…-[oklch(…)]`, `…-[color-mix(…)]`);
- arbitrary radius values (`rounded-[…]`, `rounded-t-[…]`, …).

Arbitrary layout values (`grid-cols-[…]`, `w-[10%]`, `text-[11px]`) are allowed. If the rule fires, add or reuse a token in `app/globals.css` (and document it here); don't disable the rule.

## Core rules (with examples)

### Prefer design tokens over hard-coded colors

- **Do** use tokenized Tailwind classes like `bg-background`, `text-foreground`, `border-border`, `text-primary`, `bg-card`.
- **Avoid** hard-coded hex / arbitrary colors in JSX unless there’s a strong reason.

Bad:

```tsx
export function Panel() {
  return (
    <div style={{ backgroundColor: "#0b1020", color: "#f3e7c6" }}>Content</div>
  );
}
```

Good:

```tsx
export function Panel() {
  return <div className="bg-card text-card-foreground">Content</div>;
}
```

### Use `components/ui/*` primitives for consistent interaction + accessibility

- **Do** use `Button`, `Input`, `Select`, `Dialog`, `Drawer`, etc.
- **Avoid** re-implementing basic primitives with raw HTML + custom classes.

Bad:

```tsx
export function SaveButton() {
  return (
    <button className="rounded bg-yellow-500 px-4 py-2 text-black hover:bg-yellow-400">
      Save
    </button>
  );
}
```

Good:

```tsx
import { Button } from "@/components/ui/button";

export function SaveButton() {
  return <Button>Save</Button>;
}
```

### Use `cn()` for class composition (and let Tailwind merge conflicts)

`cn()` lives in `lib/utils.ts` and merges conditional classes safely.

Bad:

```tsx
export function Row({ selected }: { selected: boolean }) {
  return (
    <div className={"px-3 py-2 " + (selected ? "bg-card" : "bg-transparent")}>
      Row
    </div>
  );
}
```

Good:

```tsx
import { cn } from "@/lib/utils";

export function Row({ selected }: { selected: boolean }) {
  return (
    <div className={cn("px-3 py-2", selected ? "bg-card" : "bg-transparent")}>
      Row
    </div>
  );
}
```

### Route-local UI belongs in `app/<route>/_components`

- **Do** keep one-route components colocated under that route subtree.
- **Promote** to `components/` only when reused by multiple routes.

Bad:

```tsx
// components/user-panel-reset-form.tsx (only used on one page)
export function UserPanelResetForm() {
  return <div>...</div>;
}
```

Good:

```tsx
// app/user-panel/reset/_components/reset-form.tsx
export function ResetForm() {
  return <div>...</div>;
}
```

### Prefer small reusable patterns over one-off CSS classes

Global CSS lives in `app/globals.css`. Keep it focused on:

- **Theme tokens** (CSS variables)
- **Truly global utilities** (rare)
- **Global layout/background** patterns that apply across the whole app

Avoid adding one-off component styling to `globals.css`—use Tailwind classes or a component wrapper instead.

Bad:

```css
/* app/globals.css */
.special-login-button {
  background: linear-gradient(90deg, red, blue);
}
```

Good:

```tsx
import { Button } from "@/components/ui/button";

export function LoginCTA() {
  return <Button className="bg-primary text-primary-foreground">Log in</Button>;
}
```

## Tokens

All tokens live in `app/globals.css` as HSL channels (`--gold: 45 90% 50%`) and are exposed to Tailwind through `@theme inline` as `--color-*` (use `bg-gold`, `text-gold/80`, …). One theme only: dark. Raw CSS uses `hsl(var(--token))` / `hsl(var(--token) / 0.5)`. There is no light theme and no `dark:` variant; don't add `dark:` classes.

### Colors

| Token                                  | Use                                                                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `background` / `foreground`            | Page ground and default text.                                                                                                                                       |
| `card`, `popover` (+ `-foreground`)    | Raised panels (with `backdrop-blur-md`); select, menu and toast surfaces.                                                                                           |
| `primary` / `primary-foreground`       | Gold fill + dark ink on it. `primary` = `gold`.                                                                                                                     |
| `secondary`, `muted` (+ `-foreground`) | Low-emphasis fills. `muted-foreground` (55% L, ≈5:1 on `background`) for hints and descriptions.                                                                    |
| `accent` / `accent-foreground`         | Deep purple: info toasts, menu checkbox/radio focus only.                                                                                                           |
| `destructive` / `crimson`              | Errors, offline, class-requirement lines. 3.3:1 on `background`: pair with an icon or word.                                                                         |
| `online` / `success`                   | Server online, success toasts, `Alert variant="success"`. Same green.                                                                                               |
| `border`, `input`, `ring`              | 1px borders (set on `*`), input borders, gold focus ring (used at /50, 3px).                                                                                        |
| `gold`, `gold-dim`, `gold-glow`        | Brand gold: headings, highlighted values, table headers, hover. `gold-dim` for hairlines and quiet borders; `gold-glow` only as a gradient stop.                    |
| `mu-tooltip-bg/exc/text/line`          | Item tooltip (`ItemCard`) legacy palette: panel at `/90`, excellent title, stat lines, excellent options. Sizes: `text-item-title` (11px), `text-item-line` (10px). |
| `silver` / `bronze`                    | 2nd / 3rd place podium medals.                                                                                                                                      |

### Type

- `font-serif` = **Cinzel** (600/700 only — never `font-medium`): `Text` variants `hero`, `h1`–`h4` (always `gold-gradient-text`) and `section`, all `h1`–`h6`, `Button decorative`, table headers.
- `font-sans` = **Raleway** (400–700): everything else. Default.
- No mono font is loaded.

### Spacing and sizing

- Tailwind 0.25rem unit. Controls (button, input, select, tab list, menu item) default to `h-12` (48px); `sm` `h-10`. Button sizes: `default`, `sm`, `icon` (48px square), `icon-xs` (32px square).
- Cards: `py-5`, `gap-5`, sections `px-6`. Table cells `px-4 py-3`.
- `PageLayout`: `public` `max-w-5xl py-28`, `auth` `max-w-md py-28`, `panel` `max-w-5xl py-8`.

### Radius

Single source: `--radius` in `app/globals.css` (**`0.25rem`**). Tailwind exposes `rounded-sm` (2px), `rounded-md` (4px, controls), `rounded-lg` (6px, alerts, dialogs, popovers), `rounded-xl` (8px, cards).

- **Do** use `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, or `rounded-full`.
- **Avoid** `rounded-[Npx]` in app code (lint error). If you reach for one, fix the token instead.

### Depth and ornament

- Depth is gold glow, not drop shadow: `.animate-glow` (pulsing, e.g. the 1st-place podium card) and `.card-hover` (lift + glow on hover). Popovers use `shadow-lg shadow-black/20`.
- Section breaks: `Divider` (gold diamond) between major sections; `OrnamentLine` (fading `gold-dim` hairline) for quiet separation.

## Components

Use the primitive before writing markup:

| Need       | Use                                                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Action     | `Button` (`default` gold gradient for the one primary action, `outline` for the secondary, `decorative` only on real CTAs; `secondary`, `ghost`, `destructive`, `link`) |
| Form       | `Field*` + `Input` / `Select` / `Label`, errors via `FieldError`                                                                                                        |
| Panel      | `Card`                                                                                                                                                                  |
| Lists      | `Table` (gold Cinzel headers), `Pagination` / `SearchResultsPagination`                                                                                                 |
| Messages   | `Alert` (persistent), `toast.*` from `sonner` (transient), `EmptyState`                                                                                                 |
| Overlays   | `Dialog`, `AlertDialog` (confirm before irreversible actions), `Drawer`. For item hover use `ItemTooltip`.                                                              |
| Text       | `Text` + `Headline`; never style raw `h1`–`h6`. Small uppercase section labels: `<Text variant="section">` (renders `h3`; pass `as="h2"` if needed).                    |
| Game items | `ItemIcon`, `ItemTooltip` + `ItemCard`, `WarehouseGrid`                                                                                                                 |

## Typography weight scale

Two webfonts are loaded in `app/layout.tsx` via `next/font/google`:

- **Cinzel** (serif, `--font-cinzel`) — drives `font-serif` headings produced by the `Text` component (`hero`, `h1`, `h2`, `h3`, `h4` variants and `gold-gradient-text`).
- **Raleway** (sans, `--font-raleway`) — drives the body / UI font (`font-sans`, the default).

Only the weights actually used in JSX are pre-loaded. Add a weight here _before_ using it in a class.

| Font    | Loaded weights | Allowed Tailwind classes                                   |
| ------- | -------------- | ---------------------------------------------------------- |
| Cinzel  | `600`, `700`   | `font-semibold`, `font-bold` (only on serif headings)      |
| Raleway | `400`–`700`    | `font-normal`, `font-medium`, `font-semibold`, `font-bold` |

- **Do** stick to `font-medium`, `font-semibold`, `font-bold` for emphasis on body copy.
- **Avoid** `font-extrabold`, `font-black`, `font-light`, `font-thin` — those weights are not loaded and the browser will fake them, which looks blurry on Cinzel.

## Icon size scale

Icon sizes are tokenized in `app/globals.css` (`--spacing-icon-{xs,sm,md,lg,xl,2xl,3xl}`) and surfaced as Tailwind utilities `size-icon-xs` … `size-icon-3xl`. Use them on `lucide-react` icons and inline SVGs to keep them visually paired with the text they sit next to.

| Token           | Value     | Pair with text class   | Typical use                                            |
| --------------- | --------- | ---------------------- | ------------------------------------------------------ |
| `size-icon-xs`  | `0.75rem` | `text-xs`              | Inline icons inside chips, badges, tabular labels.     |
| `size-icon-sm`  | `1rem`    | `text-sm`, `text-base` | Buttons, form fields, body copy.                       |
| `size-icon-md`  | `1.25rem` | `text-base`, `text-lg` | Card actions, alerts, table-row affordances.           |
| `size-icon-lg`  | `1.5rem`  | `text-lg`, `text-xl`   | Section headers (e.g. blood-castle / devil-square h3). |
| `size-icon-xl`  | `2rem`    | `text-2xl` and above   | Empty-state and large hero icons.                      |
| `size-icon-2xl` | `3rem`    | —                      | Compact empty-state icon.                              |
| `size-icon-3xl` | `4rem`    | —                      | Display icons (download hero).                         |

- **Do** prefer a token (`size-icon-md`) over arbitrary `size-5` / `h-5 w-5` literals.
- **Avoid** mixing icon size with text size that doesn't pair (e.g. `size-icon-xl` next to `text-xs`). Pick the row in the table above and stay on it.
- **Exception:** primitives in `components/ui/*` may use `size-{n}` literals to match shadcn defaults; app code uses the token. Skeleton bars and image frames are not icons and may use plain sizes.

## Tailwind class ordering

Prettier is configured with `prettier-plugin-tailwindcss`, so Tailwind classes will be **sorted automatically** on format.
