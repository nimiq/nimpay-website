Public web catalog of Nimiq Pay mini apps, hosted at `https://nimpay.app/miniapps`. Detail pages are statically generated per mini app and per locale. The bare root `/` 301s to `https://www.nimiq.com/nimiq-pay/`.

## Stack

- **Nuxt 4** SSG (`nuxt generate`) — full prerender, `payloadExtraction` on, `crawlLinks` + `failOnError`
- **UnoCSS** with `presetWind4` and `nimiq-css/unocss` preset (preflight + utilities)
- **`nimiq-css`** for brand tokens and base styles
- **`motion-v`** (Motion for Vue) for header / interactive animations
- **`reka-ui`** headless components (dropdowns, switchers)
- **`@nuxtjs/i18n`** — locales: en (default), es, pt, fr, de · `prefix_except_default` · browser detection via `nimpay_lang` cookie
- **`@nuxtjs/sitemap`** — excludes `/miniapps/open/**`, `/200.html`, `/404.html`
- **Light/dark theme** — `useTheme()` composable, `nimpay_theme` cookie, system fallback
- **ESLint** with `@antfu/eslint-config` + `@nuxt/eslint` + `@unocss/eslint-plugin`
- Hosted on **Cloudflare Pages**

## Data source

Mini app data comes from [`nimiq/awesome`](https://github.com/nimiq/awesome):

```
https://raw.githubusercontent.com/nimiq/awesome/main/src/data/dist/nimiq-mini-apps.json
```

The JSON is fetched once at build time by `server/utils/miniapps.ts` (in-process cache, single fetch shared between Nitro hook and `/api/miniapps`). If the fetch fails, the build fails — a broken deploy is preferred over a stale catalog.

Build-time route generation: `nuxt.config.ts` reads the catalog inside the `nitro:config` hook and pushes `/miniapps/{type}/{slug}` plus localized variants into `nitro.prerender.routes`. The localized `/miniapps` home pages are added the same way.

## Routes

| URL                                  | Renders                                                                |
|--------------------------------------|------------------------------------------------------------------------|
| `/`                                  | 301 → `https://www.nimiq.com/nimiq-pay/` (edge, via `public/_redirects`; `pages/index.vue` is the dev/preview fallback) |
| `/miniapps`                          | Home: featured strip, type filter, search                              |
| `/miniapps/{type}/{slug}`            | Mini app detail page (`type` ∈ `nimiq`, `evm`)                         |
| `/miniapps/open/{host}[/path][?qs]`  | Deeplink interstitial (404 if `host` is not in the catalog). Served via SPA fallback (`/200.html`) — see `_redirects` |
| `/{locale}/...`                      | Same routes, localized chrome (mini-app names/descriptions stay EN)    |
| `/api/miniapps`                      | Catalog JSON (build-time prerendered, useful for clients)              |

## Project layout

```
app.vue                          # shell: header, footer, theme + i18n head
error.vue                        # error page
pages/
  index.vue                      # SSG fallback redirect (edge handles real traffic)
  miniapps/
    index.vue                    # catalog home
    [type]/[slug].vue            # detail
    open/[...url].vue            # deeplink interstitial
components/
  LanguageSwitcher.vue
  LocaleFlag.vue
  ThemeSwitcher.vue
  effects/BorderGlow.vue         # interactive mesh-gradient border
  miniapps/
    MiniAppCard.vue
    MiniAppDetail.vue
    MiniAppFeaturedStrip.vue
    MiniAppFilter.vue
    MiniAppGrid.vue
    MiniAppLogo.vue
    MiniAppTypeBadge.vue
    OpenInPayCTA.vue
composables/
  useMiniApps.ts                 # client-side access to catalog via /api/miniapps
  useMiniAppFilter.ts            # search + type filter state
  useTheme.ts                    # cookie-backed theme with system fallback
utils/
  deeplink.ts                    # platform detection, host normalization, open-path builders
  miniAppType.ts                 # type labels / helpers
server/
  utils/miniapps.ts              # build-time fetch, cache, lookups
  api/miniapps.get.ts            # JSON endpoint for the catalog
i18n/locales/{en,es,pt,fr,de}.json
public/
  _redirects                     # Cloudflare Pages edge rules
  _headers                       # JSON content-type for AASA / assetlinks
  .well-known/apple-app-site-association
  .well-known/assetlinks.json
  assets/fonts/                  # self-hosted Mulish + FiraCode (woff2)
```

## Deeplinks

`public/.well-known/apple-app-site-association` and `public/.well-known/assetlinks.json` register `nimpay.app/miniapps/*` as a Universal Link / App Link for the Nimiq Pay native app. **Both files currently contain `TODO_*` placeholders** that must be filled in before the deeplink will validate:

- iOS: `TEAMID.BUNDLE_ID` (e.g. `ABCD1234EF.com.nimiq.pay`)
- Android: `package_name` + `sha256_cert_fingerprints` from the signing cert

`public/_headers` ensures both files are served as `Content-Type: application/json` (required by Apple).

`/miniapps/open/{host}[/path]` is the catch-all interstitial: if `host` matches a known mini app (via `findByHost` / `normalizeHost` — strips `www.`, case-insensitive), the page shows an "Open in Nimiq Pay" CTA with platform-aware store fallback (`detectPlatform` from `utils/deeplink.ts`); otherwise it 404s. The route is excluded from the sitemap and is served as a SPA fallback by Cloudflare Pages.

## Theming

`useTheme()` (in `composables/useTheme.ts`) exposes `mode` (user choice or `null`), `resolved` (always `light` | `dark`), and `toggle()`. Persistence: `nimpay_theme` cookie, 1y. Fallback: `prefers-color-scheme`. `app.vue` writes `data-theme` to `<html>` and sets the `theme-color` meta tag accordingly. CSS uses the native `light-dark()` function over a `--*` variable layer.

## i18n

- Locales declared in `nuxt.config.ts`.
- Browser detection on root only; choice is stored in `nimpay_lang` (1y, lax).
- Default locale (en) has no prefix; others use `/es/`, `/pt/`, `/fr/`, `/de/`.
- UI strings live in `i18n/locales/*.json`. Mini-app names and descriptions are intentionally **not** translated — they're authored upstream in `nimiq/awesome`.

## Catalog refresh

Cloudflare Pages rebuilds on every push to this repo. To refresh **without a code change** when a new mini app lands in `nimiq/awesome`:

1. **Webhook (primary):** a GitHub Action in `nimiq/awesome` calls a Cloudflare Pages [deploy hook](https://developers.cloudflare.com/pages/configuration/deploy-hooks/) whenever `src/data/dist/nimiq-mini-apps.json` changes on `main`. The deploy hook URL is stored as the secret `NIMPAY_WEBPAGE_DEPLOY_HOOK` in `nimiq/awesome` Actions secrets.
2. **Daily fallback:** a scheduled GitHub Action in this repo (`.github/workflows/refresh.yml`, not yet created) hits the same deploy hook once a day, so missed webhook deliveries are covered within 24h.

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # output → .output/public
pnpm generate     # alias of build
pnpm preview      # serve the static output locally
pnpm typecheck    # nuxt typecheck (vue-tsc)
pnpm lint
pnpm lint:fix
```

Cloudflare Pages build settings:

- Build command: `pnpm install && pnpm run build`
- Build output directory: `.output/public`
- Node version: 22

## Verification checklist (post-deploy)

```bash
curl -I  https://nimpay.app/                                          # 301 → nimiq.com/nimiq-pay/
curl -i  https://nimpay.app/.well-known/apple-app-site-association    # 200, application/json
curl -i  https://nimpay.app/.well-known/assetlinks.json               # 200, application/json
curl -I  https://nimpay.app/miniapps/open/attacker.com                # 404
curl -s  https://nimpay.app/api/miniapps | jq 'length'                # > 0
```

On a real device with Nimiq Pay installed: long-press any `nimpay.app/miniapps/...` link → the share sheet should offer "Open in Nimiq Pay".
