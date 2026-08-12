# 0xRutts portfolio

Personal portfolio for [0xrutts.com](https://0xrutts.com).

## Modes

| Route | Experience |
| --- | --- |
| `/` | Portfolio — scannable AI/ML site (default) |
| `/interactive` | Terminal only — live shell to explore with commands |
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
```

## Notes

- Portfolio content lives in `src/config/scrollTimeline.ts` (home page) and `src/config/commands.ts` (terminal).
- Theme for the simple site is bootstrapped before paint (`layout` boot script) to avoid theme FOUC.
- Do not commit `.env` or local screenshot dumps; they are gitignored.
