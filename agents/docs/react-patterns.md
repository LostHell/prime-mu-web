# React patterns

Next.js **App Router** + **React 19**. TypeScript is **strict** ([`tsconfig.json`](../../tsconfig.json)).

## Server vs client

- **`app/**` defaults to Server Components.** Add `'use client'` at the top of a file only when that module needs browser-only APIs, React state/effects, or event handlers that cannot stay in a small client leaf.
- Prefer **pushing interactivity down** into a client child instead of marking large server trees as client.

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

- Path alias **`@/*`** → repo root ([`tsconfig.json`](../../tsconfig.json)). Use it for internal modules when it keeps imports stable.
- **JSX**: automatic runtime is configured; you do not need `import React` for JSX alone—follow existing files and ESLint for consistency.

## UI components and patterns

- Prefer **Design System** and existing components over bespoke markup. See [`design-system.md`](./design-system.md).

