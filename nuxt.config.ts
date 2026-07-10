import type {MiniApp} from './server/utils/miniapps';
import process from 'node:process'
import { fetchMiniApps  } from './server/utils/miniapps'
import { hostOf } from './utils/deeplink'

const SITE_URL = 'https://nimpay.app'

const I18N_LOCALES = [
  { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
  { code: 'es', language: 'es-ES', file: 'es.json', name: 'Español' },
  { code: 'pt', language: 'pt-PT', file: 'pt.json', name: 'Português' },
  { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
  { code: 'de', language: 'de-DE', file: 'de.json', name: 'Deutsch' },
] as const

export type LocaleCode = (typeof I18N_LOCALES)[number]['code']

const DEFAULT_LOCALE: LocaleCode = 'en'
const NON_DEFAULT_LOCALES = I18N_LOCALES.filter(l => l.code !== DEFAULT_LOCALE).map(l => l.code)

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  ssr: true,
  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap', 'nuxt-og-image', '@nuxt/eslint', 'motion-v/nuxt', '@unocss/nuxt', '@nuxtjs/turnstile', 'nuxt-auth-utils'],

  // Cloudflare Turnstile: secret read from NUXT_TURNSTILE_SECRET_KEY at runtime
  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
  },

  // Secrets injected as Cloudflare Worker secrets (NUXT_*-prefixed). Repo target
  // overridable via env for testing against a scratch repo before nimiq/awesome.
  runtimeConfig: {
    // Submit login uses the GitHub App's user-to-server flow via nuxt-auth-utils:
    // it reads NUXT_OAUTH_GITHUB_CLIENT_ID/_SECRET (the App's client credentials)
    // and NUXT_SESSION_PASSWORD to seal the identity cookie. Login is identity
    // only — the user token is discarded; repo writes run as the App installation
    // (githubApp* below). Scope [] because GitHub Apps ignore OAuth scopes.
    oauth: { github: { clientId: '', clientSecret: '' } },
    githubAppId: '',
    githubAppPrivateKey: '',
    githubAppInstallationId: '',
    reportRepoOwner: 'nimiq',
    reportRepoName: 'awesome',
    submitRepoOwner: 'nimiq',
    submitRepoName: 'awesome',
    submitRepoBranch: 'main',
  },
  eslint: {
    config: {
      standalone: false,
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  site: {
    url: SITE_URL,
    name: 'Nimiq Pay',
  },

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  i18n: {
    baseUrl: SITE_URL,
    defaultLocale: DEFAULT_LOCALE,
    strategy: 'prefix_except_default',
    locales: [...I18N_LOCALES],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'nimpay_lang',
      redirectOn: 'root',
      fallbackLocale: DEFAULT_LOCALE,
    },
  },

  sitemap: {
    exclude: ['/miniapps/open/**', '/miniapps/*/*/report', '/200.html', '/404.html'],
    zeroRuntime: true,
  },

  // OG images render from Satori components at build time (every indexable route
  // is prerendered), so zeroRuntime ships no resvg/satori WASM into the Worker.
  // Mulish (used via fontFamily in the OG components) is auto-resolved by
  // nuxt-og-image v6's fontless downloader.
  ogImage: {
    zeroRuntime: true,
    defaults: { width: 1200, height: 630 },
    // Build-time Satori/resvg/sharp pipeline can saturate under parallel
    // prerender; give each render room and cap concurrency (see nitro.prerender).
    security: { renderTimeout: 60000 },
  },

  // Report form is a runtime page (Turnstile + POST); keep crawlLinks from
  // statically rendering it per mini app.
  routeRules: {
    '/miniapps/*/*/report': { prerender: false },
    // Submit form is runtime too (Turnstile + POST that opens a PR).
    '/miniapps/submit': { prerender: false },
  },

  nitro: {
    preset: 'cloudflare-module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: 'nimpay-website',
        compatibility_date: '2025-05-01',
        // Non-secret vars baked into the deployed Worker config so each `wrangler
        // deploy` (run on push) keeps them. Without this, plaintext dashboard vars
        // get wiped on deploy. Values come from build-time env; secrets stay as
        // Worker secrets, never here.
        vars: {
          NUXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
          // GitHub App OAuth client id (non-secret; appears in the login redirect).
          // The client secret + NUXT_SESSION_PASSWORD stay as Worker secrets.
          NUXT_OAUTH_GITHUB_CLIENT_ID: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
          NUXT_REPORT_REPO_OWNER: process.env.NUXT_REPORT_REPO_OWNER || 'nimiq',
          NUXT_REPORT_REPO_NAME: process.env.NUXT_REPORT_REPO_NAME || 'awesome',
          NUXT_SUBMIT_REPO_OWNER: process.env.NUXT_SUBMIT_REPO_OWNER || 'nimiq',
          NUXT_SUBMIT_REPO_NAME: process.env.NUXT_SUBMIT_REPO_NAME || 'awesome',
          NUXT_SUBMIT_REPO_BRANCH: process.env.NUXT_SUBMIT_REPO_BRANCH || 'main',
        },
      },
    },
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/', '/miniapps'],
      autoSubfolderIndex: false,
      // Cap parallelism so the native OG render pipeline (satori/resvg/sharp)
      // doesn't saturate and time out during build.
      concurrency: 4,
    },
  },

  hooks: {
    'nitro:config': async function(nitroConfig) {
      const apps = await fetchMiniApps()
      const detailRoutes = apps.flatMap((app: MiniApp) => {
        const base = `/miniapps/${app.type}/${app.slug}`
        return [base, ...NON_DEFAULT_LOCALES.map(l => `/${l}${base}`)]
      })
      const homeRoutes = NON_DEFAULT_LOCALES.flatMap(l => [`/${l}`, `/${l}/miniapps`])
      // Bare deeplink per app (the canonical shareable /open URL). Prerendering
      // it lets each reuse its detail OG card via the shared cacheKey; runtime
      // query/sub-path variants fall back to the static image.
      const openRoutes = apps
        .map((app: MiniApp) => hostOf(app.url))
        .filter((h): h is string => !!h)
        .map(h => `/miniapps/open/${h}`)
      nitroConfig.prerender ||= {}
      nitroConfig.prerender.routes ||= []
      nitroConfig.prerender.routes.push(...homeRoutes, ...detailRoutes, ...openRoutes)
    },
  },

  experimental: {
    payloadExtraction: true,
    viewTransition: true,
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
