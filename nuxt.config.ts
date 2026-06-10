import type {MiniApp} from './server/utils/miniapps';
import process from 'node:process'
import { fetchMiniApps  } from './server/utils/miniapps'

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
  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap', '@nuxt/eslint', 'motion-v/nuxt', '@unocss/nuxt', '@nuxtjs/turnstile'],

  // Cloudflare Turnstile: secret read from NUXT_TURNSTILE_SECRET_KEY at runtime
  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
  },

  // Secrets injected as Cloudflare Worker secrets (NUXT_*-prefixed). Repo target
  // overridable via env for testing against a scratch repo before nimiq/awesome.
  runtimeConfig: {
    githubAppId: '',
    githubAppPrivateKey: '',
    githubAppInstallationId: '',
    reportRepoOwner: 'nimiq',
    reportRepoName: 'awesome',
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
    name: 'Nimiq Pay Mini Apps',
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

  // Report form is a runtime page (Turnstile + POST); keep crawlLinks from
  // statically rendering it per mini app.
  routeRules: {
    '/miniapps/*/*/report': { prerender: false },
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
          NUXT_REPORT_REPO_OWNER: process.env.NUXT_REPORT_REPO_OWNER || 'nimiq',
          NUXT_REPORT_REPO_NAME: process.env.NUXT_REPORT_REPO_NAME || 'awesome',
        },
      },
    },
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/miniapps'],
      autoSubfolderIndex: false,
    },
  },

  hooks: {
    'nitro:config': async function(nitroConfig) {
      const apps = await fetchMiniApps()
      const detailRoutes = apps.flatMap((app: MiniApp) => {
        const base = `/miniapps/${app.type}/${app.slug}`
        return [base, ...NON_DEFAULT_LOCALES.map(l => `/${l}${base}`)]
      })
      const homeRoutes = NON_DEFAULT_LOCALES.map(l => `/${l}/miniapps`)
      nitroConfig.prerender ||= {}
      nitroConfig.prerender.routes ||= []
      nitroConfig.prerender.routes.push(...homeRoutes, ...detailRoutes)
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
