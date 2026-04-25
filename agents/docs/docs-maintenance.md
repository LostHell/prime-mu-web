# Maintaining agent docs

Agents should **keep these docs in sync with the repo** whenever a change would make a doc wrong or incomplete. No approval loop—edit in the same change as the code.

## Do not touch (unless the doc is wrong)

- **[`AGENTS.md`](../../AGENTS.md)**: Only the one-line project truth, npm/Node/build/start facts that apply to **every** task, and the **link table**. If your work is not universal, do not add it here.

## Update an existing file (default)

Use the document table under **[`AGENTS.md` → More documentation](../../AGENTS.md#more-documentation)** to pick the right `agents/docs/*.md` by topic. Edit **one** file; add or fix the minimum text so a future agent can run the right commands and avoid known mistakes.

**Rule**: If the change fits **one row** in that table, **extend that file**—do not create a new doc.

## Create a new file (rare)

Create `agents/docs/<short-name>.md` only when:

- The topic does not fit any row in the [`AGENTS.md`](../../AGENTS.md#more-documentation) table **and** would make an existing file long or mixed-topic, **or**
- You are introducing a major new concern area (e.g. a new test stack) that deserves its own short page.

Then:

1. Add the file under `agents/docs/`.
2. Add **one row** to the [same table in `AGENTS.md`](../../AGENTS.md#more-documentation) (Document / Purpose / When to read).

## Style

- **Facts**: commands, script names, config filenames, one-line “when to use.”
- **No** long prose, duplicated README content, or fragile path maps unless you will maintain them.
- **Remove** bullets that are no longer true when you change tooling.

## This file

Change **`docs-maintenance.md`** only when these **rules** change. Add or edit rows in the [`AGENTS.md`](../../AGENTS.md#more-documentation) table when the doc set or purposes change—not here.
