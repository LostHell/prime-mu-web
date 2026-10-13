# React patterns

Next.js **App Router** + **React 19**. TypeScript is **strict** ([`tsconfig.json`](../../tsconfig.json)).

## Server vs client

- **`app/**`defaults to Server Components.** Add`'use client'` at the top of a file only when that module needs browser-only APIs, React state/effects, or event handlers that cannot stay in a small client leaf.
- Prefer **pushing interactivity down** into a client child instead of marking large server trees as client.
- **`page.tsx` and `layout.tsx` are never `'use client'`.** They fetch data on the server and render a client child where interaction is needed.
- Props passed from a server component to a client component must be serializable: plain objects, strings, numbers, arrays, `Date`. No `Buffer`, `bigint`, class instances or functions (server actions are the exception).

## SSR Safety

Every component must be SSR-safe:

- Render on server without breaking
- No direct `window`, `document`, or browser API access during render
- Use effects for browser-only code
- Hydrate correctly on client

```typescript
// BAD - Breaks on server
const width = window.innerWidth;

// GOOD - Safe for SSR
const [width, setWidth] = useState(0);
useEffect(() => {
  setWidth(window.innerWidth);
}, []);
```

### Numbers and dates

The server and the browser can use different locales, so `n.toLocaleString()` without arguments renders `10.000` on one and `10,000` on the other and breaks hydration.

- Numbers in UI: `formatNumber` (thousands separators) or `formatCompact` (`10M`) from `@/lib/utils/numbers`. Never a bare `toLocaleString()`.
- Dates in UI: helpers in `@/lib/utils/dates`, which fix the locale and time zone.
- Messages built in server actions use `formatNumber` too, so they read the same as the UI.

## Forms

Forms submit to a server action through `useActionState`:

```tsx
"use client";

const [state, action, isPending] = useActionState(changeEmailAction, {});

<form action={action}>
  <Field>
    <FieldLabel htmlFor="newEmail">New email</FieldLabel>
    <Input id="newEmail" name="newEmail" disabled={isPending} />
    {state.errors?.newEmail && (
      <FieldError>{state.errors.newEmail[0]}</FieldError>
    )}
  </Field>
  <Button type="submit" disabled={isPending}>
    Save
  </Button>
</form>;
```

- Input `name` attributes match the keys the action reads from `formData` and the Zod schema.
- Disable inputs and the submit button while `isPending`.
- Feedback: persistent result in an `Alert`, or a toast. When the submitting UI can disappear after revalidation (cancel, buy), wrap the action with `withActionToast` from `@/hooks/use-action-toast` instead of toasting in an effect.
- Client-side checks are for convenience only. The action validates again.

## useEffect Usage

Use with caution. Reference: <https://react.dev/learn/you-might-not-need-an-effect>

**Don't use useEffect for:**

- **Transforming data for rendering** — Do it during render instead
- **Handling user events** — Use event handlers
- **Resetting state when props change** — Use `key` prop to remount
- **Adjusting state when props change** — Compute during render
- **Sharing logic between event handlers** — Extract to a function
- **Fetching data without cleanup** — Handle race conditions with abort/flag
- **Subscribing to external stores** — Use `useSyncExternalStore`

## Keys and Fragments

- Use stable, unique keys for list items
- Never use array index as key unless list is static and won't reorder
- Prefer `<Fragment>` or `<>` over wrapping divs
- Use `<Fragment key={...}>` when mapping needs a key

```typescript
// BAD - Index as key
{items.map((item, index) => <Item key={index} {...item} />)}

// GOOD - Stable unique key
{items.map((item) => <Item key={item.id} {...item} />)}
```

## Imports and paths

- Path alias **`@/*`** → repo root ([`tsconfig.json`](../../tsconfig.json)). Relative-vs-alias rules and import direction: [`project-structure.md`](./project-structure.md#import-direction).
- **JSX**: automatic runtime is configured; you do not need `import React` for JSX alone.
- Use `import type { … }` for anything that is only a type, always in client components. It keeps server modules out of the client bundle.
- Named exports; `export default` only for Next.js route files.

## UI components and patterns

- Prefer **Design System** and existing components over bespoke markup. See [`design-system.md`](./design-system.md).
- No `any`. Type third-party gaps with a narrow local type instead.

## Existing exceptions (don't copy)

- `'use client'` pages under `app/user-panel/` (`page.tsx`, `reset`, `add-stats`, `clear-pk`, `account/change-email`, `account/change-password`). They read the selected character from client context (`app/user-panel/_context/user-panel-context.tsx`).
- 19 bare `toLocaleString()` calls in `app/` and `components/`, including `app/user-panel/page.tsx`, `reset-form.tsx` and the Blood Castle / Devil Square tables.
- `components/item-tooltip.tsx` uses `any` and assigns to refs returned from context. It is the source of the current ESLint errors.
