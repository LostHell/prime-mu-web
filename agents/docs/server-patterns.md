# Server patterns

Rules for code that reads or writes the game database: `lib/actions`, `lib/queries`, `lib/validation`, `lib/game`, `lib/auth`. Read [database.md](./database.md) first: the game server writes the same rows at the same time.

## Server actions (`lib/actions/*`)

- One action per file: `lib/actions/<verb>-<noun>.ts`, `"use server"` at the top, exporting `<verb><Noun>Action`.
- Form actions have the `useActionState` signature `(state: ActionState, formData: FormData) => Promise<ActionState>`. `ActionState` lives in `lib/types/action-state.ts`.
- **Every export of a `"use server"` file is a public endpoint** that anyone can call with any arguments. Export only actions from these files. Helpers go in `lib/actions/utils.ts` (no directive) or `lib/game/*`.

Each action follows these steps, in this order:

1. **Auth**: `const accountId = await getAuthenticatedUser();` and return `{ success: false, message: "You must be logged in." }` when it is null.
2. **Validate**: `schema.safeParse({...})` with values read from `formData`. Return the field errors on failure. Never use a form value before it is validated.
3. **Ownership**: never trust a character name or listing id from the form. Load it filtered by `AccountID: accountId` (`verifyCharacterOwnership`, or `sellerAccountId` checks).
4. **Offline check**: `await isAccountOffline(accountId)` before changing characters, the warehouse or deposits. While the player is online the game server holds this data in memory and overwrites the database when they log out.
5. **Conditional write** (see Concurrency below).
6. **Revalidate**: `revalidatePath(...)` for every route that shows the changed data.
7. **Return** an `ActionState` with a short message the player can act on.

Errors:

- Never let an error reach the client. Inside a transaction, throw `ActionError("message for the player")` for expected failures, and wrap the transaction in `try/catch` returning `actionErrorMessage(err, "Failed to …")`. It logs unexpected errors with a reference ID and hides their details.
- Don't return Prisma or driver messages to the player.

## Concurrency on the shared database

A value you read can change before you write it: another tab, another player, or the game server.

- **Guard every read-then-write.** Use `updateMany` with a `where` that repeats the values you read, then check `count`. When it is `0`, return a "changed, refresh and try again" message. See `add-stats.ts`, `reset-character.ts`, `clear-pk.ts`.
- **Balances**: decrement with `{ decrement: n }` and guard with `{ gte: n }` in the `where`. Never write a value you computed in JavaScript from an earlier read (`Money: character.Money - cost`).
- **Warehouse blobs** (`warehouse.Items`): guard the write on the original buffer (`where: { AccountID, Items: originalItems }`).
- **Several rows** change together inside one `prisma.$transaction(async (tx) => …)`, and every call in it uses `tx`. The one exception is `getNextItemSerial()`, which must use the global client.
- **Creating rows**: a unique conflict (Prisma code `P2002`) means another request won. Turn it into a retry message.

## Queries (`lib/queries/*`)

- One read per file: `get-<thing>.ts` exporting `get<Thing>`.
- Queries take `accountId` as an argument. They never call `auth()`; the page or action does that and passes the id.
- Return plain, serializable objects with readable names (`level`, not `cLevel`) and nulls already defaulted. No Prisma rows, `Buffer`, or `bigint` (use `bigIntToSafeNumber`) in anything passed to a client component.
- Fetch related rows in one batch (`where: { Name: { in: names } }` + a `Map`), never one query per row. See `get-rankings.ts`.
- Normalize page numbers and search text with `lib/utils/pagination.ts` and `constants/pagination.ts`.
- Wrap a query in React `cache()` when one request calls it more than once (see `get-server-info.ts`).
- New query files start with `import "server-only";`.
- Client components import query result types with `import type` only.

## Validation (`lib/validation/*`)

- One file per action, named like the action: `<verb>-<noun>.ts` exporting `<verb><Noun>Schema` and `<Verb><Noun>Input`. Shared fields go in `shared.ts`.
- Limits must match the game database columns (for example usernames 4–10 characters, passwords 6–10, email 50).
- Schemas check the shape of input. Rules that need the database (enough Zen, ownership, free warehouse space) belong in the action.
- Zod 4: use `z.flattenError(error).fieldErrors` and `z.email()`. `error.flatten()` and `z.string().email()` are deprecated.

## Game logic (`lib/game/*`)

- Pure TypeScript: no Prisma, no React, no `next/*`. Easy to unit test.
- Game rules come from `serverConfig` (`lib/game/server-config.ts`). Don't hard-code a number the server config provides. When a rule exists only in the server's C++ code, name the source file in a comment (see `lib/game/characters/stat-limits.ts`).

## Auth and passwords

- Session: `auth()` from `@/auth`; in actions, `getAuthenticatedUser()`.
- Passwords: only through `encodePassword` and `verifyPassword` from `@/lib/auth/password`. They follow the server's `MD5Encryption` mode. Never compare password bytes yourself, and never log passwords or hashes.
- `proxy.ts` is not a security boundary. See [nextjs-patterns.md](./nextjs-patterns.md).

## Existing exceptions (don't copy)

- `add-stats.ts` and `reset-character.ts` query `MEMB_STAT` inline instead of calling `isAccountOffline`.
- `register.ts` creates `MEMB_INFO` and `MEMB_STAT` outside a transaction, and two sign-ups with the same name can both pass the existence check (the second fails with an unhandled `P2002`).
- `login.ts` and `register.ts` return `AuthFormState` (`lib/validation/types.ts`) instead of `ActionState`.
- `cancel-market-listing.ts` validates with `buyMarketItemSchema`.
- `buy-market-item.ts` and `cancel-market-listing.ts` each define `isUniqueConflict` and repeat the "place an item in the warehouse" block. Extract them before adding a third copy.
- Existing `lib/queries/*` files, except `get-next-item-serial.ts`, don't import `server-only`.
- `lib/actions/index.ts` and `lib/validation/index.ts` are incomplete barrels that nothing imports. Import from the file itself.
- 14 call sites still use the deprecated Zod `flatten()` and `.email()`.
