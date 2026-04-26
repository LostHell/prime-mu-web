# Design system

This repo uses **Tailwind CSS + shadcn/ui primitives** under `components/ui/*`, with theme tokens defined in `app/globals.css` (CSS variables like `--background`, `--primary`, `--gold`, etc.).

## Core rules (with examples)

### Prefer design tokens over hard-coded colors

- **Do** use tokenized Tailwind classes like `bg-background`, `text-foreground`, `border-border`, `text-primary`, `bg-card`.
- **Avoid** hard-coded hex / arbitrary colors in JSX unless there’s a strong reason.

Bad:

```tsx
export function Panel() {
  return (
    <div style={{ backgroundColor: "#0b1020", color: "#f3e7c6" }}>
      Content
    </div>
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

- **Do** use `Button`, `Input`, `Select`, `Sheet`, `Tabs`, etc.
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

## Radius

Radius is driven by a single token: `--radius` in `app/globals.css` (currently `0.5rem`). Tailwind exposes it as `--radius-sm/md/lg/xl`.

- **Do** use `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, or `rounded-full`.
- **Avoid** `rounded-[Npx]` literals in app code outside `components/ui/`. If you reach for one, fix the token instead.

## Typography weight scale

Two webfonts are loaded in `app/layout.tsx` via `next/font/google`:

- **Cinzel** (serif, `--font-cinzel`) — drives `font-serif` headings produced by the `Text` component (`hero`, `h1`, `h2`, `h3`, `h4` variants and `gold-gradient-text`).
- **Raleway** (sans, `--font-raleway`) — drives the body / UI font (`font-sans`, the default).

Only the weights actually used in JSX are pre-loaded. Add a weight here _before_ using it in a class.

| Font    | Loaded weights | Allowed Tailwind classes                                  |
| ------- | -------------- | --------------------------------------------------------- |
| Cinzel  | `600`, `700`   | `font-semibold`, `font-bold` (only on serif headings)     |
| Raleway | `400`–`700`    | `font-normal`, `font-medium`, `font-semibold`, `font-bold` |

- **Do** stick to `font-medium`, `font-semibold`, `font-bold` for emphasis on body copy.
- **Avoid** `font-extrabold`, `font-black`, `font-light`, `font-thin` — those weights are not loaded and the browser will fake them, which looks blurry on Cinzel.

## Icon size scale

Icon sizes are tokenized in `app/globals.css` (`--spacing-icon-{xs,sm,md,lg,xl}`) and surfaced as Tailwind utilities `size-icon-xs`, `size-icon-sm`, `size-icon-md`, `size-icon-lg`, `size-icon-xl`. Use them on `lucide-react` icons and inline SVGs to keep them visually paired with the text they sit next to.

| Token              | Value      | Pair with text class           | Typical use                                            |
| ------------------ | ---------- | ------------------------------ | ------------------------------------------------------ |
| `size-icon-xs`     | `0.75rem`  | `text-xs`                      | Inline icons inside chips, badges, tabular labels.     |
| `size-icon-sm`     | `1rem`     | `text-sm`, `text-base`         | Buttons, form fields, body copy.                       |
| `size-icon-md`     | `1.25rem`  | `text-base`, `text-lg`         | Card actions, alerts, table-row affordances.           |
| `size-icon-lg`     | `1.5rem`   | `text-lg`, `text-xl`           | Section headers (e.g. blood-castle / devil-square h3). |
| `size-icon-xl`     | `2rem`     | `text-2xl` and above           | Empty-state and large hero icons.                      |

- **Do** prefer a token (`size-icon-md`) over arbitrary `size-5` / `h-5 w-5` literals.
- **Avoid** mixing icon size with text size that doesn't pair (e.g. `size-icon-xl` next to `text-xs`). Pick the row in the table above and stay on it.
- **Exception:** primitives in `components/ui/*` may use `size-{n}` literals to match shadcn defaults; app code should prefer the token.

## Tailwind class ordering

Prettier is configured with `prettier-plugin-tailwindcss`, so Tailwind classes will be **sorted automatically** on format.