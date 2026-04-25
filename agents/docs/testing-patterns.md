# Testing

## Overview

Cover code with tests to ensure it works properly during development and that the system behaves as expected when introducing new features/changes.

## Test Types

### Unit tests (Jest)

- Config: [`jest.config.js`](../../jest.config.js) (via `next/jest`), setup: [`jest-setup.ts`](../../jest-setup.ts).
- Run: `npm test` — CI-style: `npm run test:unit:ci` (coverage, single band).
- Watch: `npm run test:watch`.
- Place tests next to source as `*.test.ts` / `*.test.tsx` (e.g. `lib/utils.test.ts`).

**Purpose:** Test small, reusable code pieces (shared components, React hooks, utility functions)

**Framework:** Jest + React Testing Library

**What to test:**

- Behavior with valid input
- Behavior with invalid/incomplete input
- Different states and variations

**Structure:**

- File naming: `<component-name>.test.tsx` (kebab-case) or `<hook-name>.test.ts`
- Place test file next to source file
- Use descriptive names: `describe("ComponentName")` and `test("should do X when Y happens")`
- Group related checks in the same test block
- Include both condition and expectation in test names
- Use explicit, descriptive test names
- Test user behavior, not implementation details
- Group related assertions
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

### Common Patterns

**Create reusable render function for components**

```tsx

const buildComponent = (props: MyComponentProps) => {
  return render(
    <MyComponent {...props} />
  );
}

test("should render component properly", async () => {
  const message = "Success!";
  buildComponent({ message });

  expect(screen.getByText(message)).toBeInTheDocument();
});
```

**Component with user interaction:**

> ⚠️ **Important**: Do NOT use `@testing-library/user-event` directly. Use the interaction helpers from `@/test-utils/interactions` instead. These are pre-configured wrappers that ensure consistent behavior across tests.
>
> Available helpers: `click`, `type`, `clear`, `hover`, `tab`, and more.

```tsx
// ❌ BAD: Using user-event directly
import userEvent from "@testing-library/user-event";
await userEvent.click(button);

// ✅ GOOD: Using our interaction helpers
import { click, type, clear } from "@/test-utils/interactions";
await click(button);
await type(input, "text");
await clear(input);
```

```tsx
import { render, screen } from "@testing-library/react";
import { click } from "@/test-utils/interactions";

test("should call handler when button clicked", async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  await click(screen.getByRole("button", { name: "Click me" }));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```
