import type {MiniApp} from './server/utils/miniapps';
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
  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap', '@nuxt/eslint', 'motion-v/nuxt', '@unocss/nuxt'],
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
    exclude: ['/miniapps/open/**', '/200.html', '/404.html'],
  },

  nitro: {
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
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
