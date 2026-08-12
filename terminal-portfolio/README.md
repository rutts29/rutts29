# 0xRutts portfolio

Personal portfolio for [0xrutts.com](https://www.0xrutts.com).

Positioning: **AI Systems Engineer · Applied ML Researcher**.

## Modes

| Route | Experience |
| --- | --- |
| `/` | Recruiter-first AI and ML portfolio (default) |
| `/interactive` | Optional terminal with interactive commands |
| `/terminal` | Permanent redirect → `/interactive` (legacy) |

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS 4 (terminal UI)
- Global CSS for the simple portfolio (FOUC-safe, first paint)
- GSAP + Lenis on the terminal route only
- Package manager: **Bun** `1.3.14` (see `packageManager` / `.bun-version`)
- Node: `>=24.18 <25` (LTS line)

Install is locked with exact versions, frozen lockfile-friendly, and lifecycle scripts disabled (`bunfig.toml`) for supply-chain hygiene.

## Commands

```bash
cd terminal-portfolio
bun install --frozen-lockfile
bun run dev
bun run typecheck
bun run lint
bun run build
bun run verify
```

## Repository safeguards

Direct dependencies are exactly pinned. Bun rejects lockfile drift in CI-friendly installs, blocks lifecycle scripts, and applies a seven-day minimum package age through `bunfig.toml`.

Enable the dependency-free staged-secret guard once per clone:

```bash
git config core.hooksPath .githooks
```

The hook runs `bun run check:repo --staged` and rejects environment files, oversized unscanned blobs, private-key formats, and common token signatures without reading ignored local files. `bun run check:repo` covers tracked and untracked committable files.

## Content architecture

- `src/config/portfolioContent.ts` is the canonical source for both interfaces, metadata, structured data, and `/llms.txt`.
- Terminal command outputs in `commands.ts` derive from the same source.
- Theme for the simple site is bootstrapped before paint (`layout` boot script) to avoid theme FOUC.
- Demo CTA uses mailto.
- Do not commit `.env` or local screenshot dumps; they are gitignored.
