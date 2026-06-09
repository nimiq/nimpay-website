<p align="center">
  <img src="./public/readme-header.png" alt="Nimiq Pay Mini Apps" width="1200">
</p>

# Nimiq Pay Mini Apps

Public web catalog for Nimiq Pay mini apps, hosted at `https://nimpay.app/miniapps`.

## What this is

This Nuxt app statically generates the mini app catalog, detail pages, localized routes, and deeplink interstitials. The bare root `/` redirects to `https://www.nimiq.com/nimiq-pay/`.

## Stack

- Nuxt 4 SSG with full prerendering
- UnoCSS with `nimiq-css` brand tokens
- `@nuxtjs/i18n` for `en`, `es`, `pt`, `fr`, `de`
- `@nuxtjs/sitemap` for generated sitemap output
- `motion-v` and `reka-ui` for UI behavior
- ESLint with Antfu, Nuxt, and UnoCSS configs
- Cloudflare Workers hosting (Nitro `cloudflare-module` preset)

## Data and routes

Mini app data comes from [`nimiq/awesome`](https://github.com/nimiq/awesome):

```txt
https://raw.githubusercontent.com/nimiq/awesome/main/src/data/dist/nimiq-mini-apps.json
```

The catalog is fetched at build time by `server/utils/miniapps.ts`. Build failures are preferred over deploying stale or incomplete data.

| Route | Purpose |
| --- | --- |
| `/` | 301 redirect to the Nimiq Pay product page |
| `/miniapps` | Catalog home with featured apps, filters, and search |
| `/miniapps/{type}/{slug}` | Mini app detail page |
| `/miniapps/open/{host}[/path][?qs]` | Deeplink interstitial with app-store fallback |
| `/{locale}/...` | Localized UI chrome |
| `/api/miniapps` | Prerendered catalog JSON |

## Local development

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm typecheck
pnpm lint
```

Run `pnpm lint` after making changes.

## Deployment notes

Cloudflare Workers (Workers Builds, git-connected). `nuxt build` emits the Worker plus
`.output/server/wrangler.json`; `deployConfig: true` makes Cloudflare run `wrangler deploy`
with that generated config on each push.

- Build command: `pnpm install && pnpm run build`
- Node version: `22`

### Environment variables

`wrangler deploy` treats the generated config as the source of truth for plaintext vars, so
any non-secret var set only in the dashboard gets wiped on each deploy. Non-secret vars are
therefore pinned in `nitro.cloudflare.wrangler.vars` (`nuxt.config.ts`) and sourced from
build-time env:

- `NUXT_PUBLIC_TURNSTILE_SITE_KEY` — set as a **Build variable** (inlined at build, also
  propagated to the Worker via `vars`).
- `NUXT_REPORT_REPO_OWNER` / `NUXT_REPORT_REPO_NAME` — default to `nimiq` / `awesome`; set
  only to override.

Secrets (`NUXT_TURNSTILE_SECRET_KEY`, `NUXT_GITHUB_APP_*`) stay as **Worker secrets** — never
in `vars`. Secrets persist across deploys.

Deeplink files live in `public/.well-known/`

Catalog refresh is handled by rebuilding the Worker when `nimiq/awesome` changes. A scheduled
fallback workflow can hit the same deploy hook if webhook delivery is missed.

## Verification

```bash
curl -I https://nimpay.app/
curl -i https://nimpay.app/.well-known/apple-app-site-association
curl -i https://nimpay.app/.well-known/assetlinks.json
curl -I https://nimpay.app/miniapps/open/nimiq.com
curl -s https://nimpay.app/api/miniapps | jq 'length'
pnpm lint
```
