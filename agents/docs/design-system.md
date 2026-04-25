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

## Tailwind class ordering

Prettier is configured with `prettier-plugin-tailwindcss`, so Tailwind classes will be **sorted automatically** on format.