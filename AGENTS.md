# AGENTS.md

Instructions for AI coding agents (opencode + qwen3-coder) working on Phizza.
Keep changes small, focused and verified. When in doubt, ask instead of guessing.

## Project

Phizza is a pizza dough calculator. The user enters the number of pizzas, dough ball weight, hydration, salt and (when relevant) yeast or starter, and the app returns exact ingredient weights.

Supported in v1:

- **Direct dough** (flour, water, salt, yeast)
- **Sourdough dough** (flour, water, salt, sourdough starter, known in Italian as "pasta madre")

Languages:

- User interface: **Italian only**
- Code, comments, commit messages, PRs, docs: **English only**

License: GPL-3.0.

## Stack

React, Vite, TypeScript (strict mode), pnpm, CSS Modules, Vitest with React Testing Library (jsdom), ESLint, Prettier. Deployed to GitHub Pages.

## Commands

Always use **pnpm**. Never use npm or yarn, and never commit `package-lock.json` or `yarn.lock`.

```
pnpm install      # install dependencies
pnpm dev          # start the dev server
pnpm build        # type-check and build for production
pnpm preview      # serve the production build locally
pnpm test         # run Vitest once
pnpm test:watch   # run Vitest in watch mode
pnpm lint         # run ESLint
pnpm format       # run Prettier
pnpm typecheck    # tsc --noEmit
```

`package.json` is the source of truth for scripts. If a script above is missing, tell the human instead of inventing one.

## Project structure

```
src/
  core/         Pure calculation logic. No React, no DOM. Fully unit-tested.
  components/   React components, each with its own *.module.css, plus small
                helper modules (format.ts, parseNumber.ts)
  test/         Vitest setup (jsdom, jest-dom matchers)
  strings.ts    ALL user-facing Italian text
  App.tsx
  main.tsx

Tests are colocated with the code they cover: *.test.ts / *.test.tsx.
```

## Code conventions

- Business logic lives in `src/core`, never inside components. Components only collect input and render output.
- Never hardcode UI text in components. Add it to `src/strings.ts`.
- No `any`. Use `unknown` and narrow it.
- Use named exports. One component per file. Keep files under about 200 lines.
- Styling: CSS Modules only. No inline styles, no CSS frameworks.
- Keep calculations in full precision. Round only in the display layer.
- Invalid user input returns a typed error result from `src/core`. Do not throw for it.

## Domain rules

These are the most error-prone part of the project. Follow them exactly.

- Baker's percentages: flour is 100%, every other ingredient is relative to **total flour**.
- Hydration = water / flour.
- **Direct dough:**
  - total weight = pizzas × ball weight
  - flour = total weight / (1 + hydration + salt% + yeast%)
- **Sourdough:**
  - starter % is relative to **total flour**, including the flour inside the starter
  - starter hydration defaults to 50%
  - starter flour = starter / (1 + starter hydration)
  - starter water = starter × starter hydration / (1 + starter hydration)
  - added flour = total flour − starter flour
  - added water = total water − starter water
  - **Never count the starter's flour and water twice.**
  - If added flour or added water would be negative, return an error (for example, target hydration lower than the starter's with a high starter %).
- Every change to a formula needs a Vitest test with expected values computed by hand.

## Git workflow

- **Never push to `main`.** Work on a branch and open a pull request.
- Branch names: `<type>/<short-kebab-description>`, for example `feat/sourdough-calculator`.
- Commits follow **Conventional Commits**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`. Optional scope, imperative mood, subject under 72 characters, for example `feat(core): add sourdough calculation`.
- One logical change per PR. The PR description says what changed, why, and how it was tested.
- Before opening a PR, run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. Everything must pass.
- CI (`.github/workflows/ci.yml`) runs the same four checks on every PR. Merging into `main` triggers `.github/workflows/deploy.yml`, which re-runs the checks and deploys to GitHub Pages.

## Requires explicit human approval

Stop and ask the human before doing any of these:

- Adding, removing or upgrading dependencies
- Changing ESLint, Prettier or tsconfig configuration
- Changing GitHub Actions workflows (`.github/workflows`)

## Never do

- Skip, disable or weaken tests (`.skip`, `.only`, loosened assertions) to make a failing build pass. Fix the code instead. Removing an obsolete test needs a justification in the PR description.
- Add `eslint-disable` comments without a comment explaining why.
- Commit secrets, `node_modules`, `dist` or other generated files.
- Change the license or add code incompatible with GPL-3.0.
- Mix unrelated refactors into a feature PR.

## Working style

- Read the files you need before editing them. Do not assume their contents.
- Prefer small, incremental edits over rewriting whole files.
- Run the checks after each meaningful change and fix errors before moving on.
- If a task is large, split it into steps and separate PRs.
