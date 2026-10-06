# 🍕 Phizza

A pizza dough calculator. Enter the number of pizzas, dough ball weight and hydration, and get exact amounts of flour, water, salt and yeast or sourdough starter. No more guessing by eye: here science rules (and so does the oven).

**Live demo:** `https://<your-username>.github.io/phizza/`

> The app interface is in Italian. Code, comments and documentation are in English.

## Features

- **Direct dough**: flour, water, salt and yeast from pizza count, ball weight and hydration
- **Sourdough dough** (pasta madre): the starter's own flour and water are accounted for, so nothing is counted twice
- Baker's percentages throughout (flour = 100%)
- Runs entirely in the browser, no backend

## Tech stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) + TypeScript (strict)
- CSS Modules
- [Vitest](https://vitest.dev/) for tests
- ESLint + Prettier
- pnpm
- GitHub Pages for hosting

## Getting started

Requirements: a recent Node.js LTS and [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/<your-username>/phizza.git
cd phizza
pnpm install
pnpm dev
```

### Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `pnpm dev`       | Start the development server   |
| `pnpm build`     | Create a production build      |
| `pnpm test`      | Run the test suite             |
| `pnpm lint`      | Lint the code with ESLint      |
| `pnpm format`    | Format the code with Prettier  |
| `pnpm typecheck` | Type-check with `tsc --noEmit` |

## How it works

Everything is expressed in baker's percentages, where flour is 100%.

**Direct dough**

```
total weight = pizzas × ball weight
flour        = total weight / (1 + hydration + salt% + yeast%)
water        = flour × hydration
```

**Sourdough**

The starter percentage refers to the total flour, including the flour inside the starter.

```
starter       = total flour × starter%
starter flour = starter / (1 + starter hydration)
starter water = starter × starter hydration / (1 + starter hydration)
added flour   = total flour − starter flour
added water   = total water − starter water
```

If the added flour or water would be negative, the app shows an error instead of a result.

## Project structure

```
src/
  core/         Pure calculation logic (no React, no DOM), fully unit-tested
  components/   React components with their CSS Modules
  strings.ts    All user-facing Italian text
  App.tsx
  main.tsx
```

## Deployment

The app is published on GitHub Pages. Vite is configured with `base: '/phizza/'` so assets resolve correctly under the repository path.

## AI-managed repository

This repository is developed and maintained by AI agents running [opencode](https://opencode.ai/) with qwen3-coder. Agents follow the rules in [AGENTS.md](./AGENTS.md):

- They work on branches and open pull requests, never pushing directly to `main`
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- Adding dependencies, changing lint/TypeScript configuration or editing GitHub Actions workflows requires human approval

## License

Released under the [GPL-3.0](./LICENSE) license.
