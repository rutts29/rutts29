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

- **Single content source:** `src/config/portfolioContent.ts`. Home and terminal adapters (`scrollTimeline.ts`, `commands.ts`) derive from it — do not duplicate facts.
- Theme for the simple site is bootstrapped before paint (`layout` boot script) to avoid theme FOUC.
- Private projects never render public source links. Demo CTA is mailto until Resend delivery is verified.
- Do not commit `.env` or local screenshot dumps; they are gitignored.
