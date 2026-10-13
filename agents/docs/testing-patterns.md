# Testing

## Overview

Cover code with tests to ensure it works properly during development and that the system behaves as expected when introducing new features/changes.

## What must have tests

- Every new or changed **server action**: the success path, each early return (not logged in, invalid input, not owned, online, not enough balance), and the "changed concurrently" path (`count: 0`).
- Every new or changed function in **`lib/game/*`**, **`lib/utils/*`** and **`lib/validation/*`**, including edge values (0, the maximum, empty, null).
- **Client components with logic**: forms, hooks, components that disable buttons or show different states.
- A bug fix comes with a test that fails without the fix.

## Test Types

### Unit tests (Jest)

- Config: [`jest.config.js`](../../jest.config.js) (via `next/jest`), setup: [`jest-setup.ts`](../../jest-setup.ts).
- Run: `npm test` — CI-style: `npm run test:unit:ci` (coverage, single band).
- Watch: `npm run test:watch`.
- Place tests next to source as `*.test.ts` / `*.test.tsx` (e.g. `lib/utils.test.ts`).
- There are no integration tests against a real database. Server actions and queries are tested with Prisma mocked.

**Framework:** Jest + React Testing Library

**What to test:**

- Behavior with valid input
- Behavior with invalid/incomplete input
- Different states and variations

**Structure:**

- File naming: `<file-name>.test.ts(x)` next to the file it tests.
- Name each test as a sentence with the behavior and its condition: `test("says the character is short of zen when the clear costs more than they carry")`. `describe` blocks are optional.
- Test user behavior, not implementation details
- Group related assertions in one test
- Use accessible query selectors (role, label)
- Check visibility before asserting disappearance (negative assertions)

**Query Selectors (priority order):**

1. `role` - `screen.getByRole("button", { name: "Submit" })`
2. `labelText` - `screen.getByLabelText("Email")`
3. `placeholderText` - `screen.getByPlaceholderText("Enter email")`
4. `text` - `screen.getByText("Welcome")`
5. `displayValue`, `altText`, `title`
6. `testId` - **AVOID unless necessary** (users don't see test IDs)

**Mocking:**

- Define input data/props within test file.
- Mock browser APIs when needed — global jsdom shims live in
  [`jest-setup.ts`](../../jest-setup.ts).
- **Server config**: tests that touch game rules mock the synced config with fixed values, so a server sync can't break them:

  ```ts
  jest.mock("@/lib/game/server-config", () =>
    jest.requireActual("@/lib/test-utils/server-config"),
  );
  ```

- **Server actions** (see `lib/actions/clear-pk.test.ts`): mock `./utils` (auth, ownership, offline), `@/prisma/prisma` with only the methods the action calls, and `next/cache`. Build a `FormData` and call the action with `{}` as the state.
- **Components that submit a form**: mock the action module (`jest.mock("@/lib/actions/clear-pk", () => ({ clearPkAction: jest.fn() }))`). Never let a component test reach Prisma.
- Call `jest.clearAllMocks()` in `beforeEach` when a test file sets mock return values.

### Common Patterns

**Create reusable render function for components**

```tsx
const buildComponent = (props: MyComponentProps) => {
  return render(<MyComponent {...props} />);
};

test("renders the message it is given", () => {
  const message = "Success!";
  buildComponent({ message });

  expect(screen.getByText(message)).toBeInTheDocument();
});
```

**Component with user interaction:**

> ⚠️ **Important**: Do NOT use `@testing-library/user-event` or `fireEvent` directly. Use the interaction helpers from `@/lib/test-utils/interactions` instead. These are pre-configured wrappers that ensure consistent behavior across tests.
>
> Available helpers: `click`, `type`, `clear`, `tab`, `enterKey`, `selectOptions`, `submit`, `upload`, `uploadNoApplyAccept`, `mouseDown`, `clickWithEvent`, `slide` (range inputs), `scroll`, and `dragOver` / `dragEnter` / `dragLeave` / `drop`. If you need another interaction, add it to that file.
>
> With `jest.useFakeTimers()`, pass `noDelay = true` to `click`, `type` and `mouseDown`, or they wait forever.

```tsx
// ❌ BAD: Using user-event or fireEvent directly
import userEvent from "@testing-library/user-event";
await userEvent.click(button);

// ✅ GOOD: Using our interaction helpers
import { click, type, clear } from "@/lib/test-utils/interactions";
await click(button);
await type(input, "text");
await clear(input);
```

```tsx
import { render, screen } from "@testing-library/react";
import { click } from "@/lib/test-utils/interactions";

test("calls the handler when the button is clicked", async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  await click(screen.getByRole("button", { name: "Click me" }));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Existing exceptions (don't copy)

- Server actions without tests: `buy-market-item.ts`, `cancel-market-listing.ts`, `deposit.ts`, `withdraw.ts`, `change-email.ts`, `change-password.ts`, `login.ts`.
