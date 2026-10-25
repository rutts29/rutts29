# 0xRutts portfolio

Personal portfolio for [0xrutts.com](https://www.0xrutts.com).

Positioning: **Applied AI Engineer**.

## Routes

| Route | Experience |
| --- | --- |
| `/` | The portfolio: a terminal-flavoured single page with a story, selected work, skills and publications |
| `/llms.txt`, `/llms-full.txt`, `/index.md` | The same content as one Markdown document for agents; `/` also serves it to clients that send `Accept: text/markdown` |
| `/resume` | View or download the one-page resume (hidden while `resume.isPublished` is false) |

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS 4
- Plain CSS for the portfolio (`app/simple-portfolio.css`), themed before first paint
- GSAP + Lenis (dormant terminal implementation only)
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
bun run check:public
bun run verify
```

## Repository safeguards

Direct dependencies are exactly pinned. Bun rejects lockfile drift in CI-friendly installs, blocks lifecycle scripts, and applies a seven-day minimum package age through `bunfig.toml`.

Enable the dependency-free staged-secret guard once per clone:

```bash
git config core.hooksPath .githooks
```

The hook runs `bun run check:repo --staged` and rejects environment files, oversized unscanned blobs, private-key formats, and common token signatures without reading ignored local files. `bun run check:repo` covers tracked and untracked committable files.

After a production build, `bun run check:public` scans browser assets and prerendered responses for local paths, common credential patterns, and public source maps. It reports file names and finding categories without printing matched values.

## Content architecture

- `src/config/portfolioContent.ts` is the canonical source for portfolio content, the story, metadata, structured data, the Markdown routes, and resume settings.
- `src/lib/portfolioMarkdown.ts` renders that content as Markdown; `proxy.ts` rewrites `/` to it for Markdown clients.
- The dormant terminal implementation also derives command output from this source so it can be restored without content drift.
- `/interactive` and `/terminal` currently redirect to `/`; their implementation remains in the repository but is not part of the public navigation.
- The public resume is delivered from Vercel Blob through a same-origin document route, which preserves the inline viewer and download filename.
- `dev` and `build` copy the pinned PDF.js browser modules into a versioned, ignored `public/pdfjs/` directory. The viewer loads those modules directly so bundling cannot embed a build-machine path from PDF.js's Node-only fallback. No third-party CDN is used.
- Theme for the simple site is bootstrapped before paint (`layout` boot script) to avoid theme FOUC.
- Email CTA uses mailto.
- Do not commit `.env` or local screenshot dumps; they are gitignored.
