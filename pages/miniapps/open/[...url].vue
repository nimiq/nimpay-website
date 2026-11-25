<script setup lang="ts">
import type { SiteMetadata } from '~~/server/utils/site-metadata'
import { motion, useReducedMotion } from 'motion-v'
import { findByHost } from '~~/server/utils/miniapps'
import { buildOpenPath, IOS_APP_ID, joinQuery, parseOpenPath } from '~~/utils/deeplink'

const route = useRoute()
const { t, locale } = useI18n()
const { data: apps, error: appsError } = await useMiniApps()
const reduced = useReducedMotion()

const parsed = parseOpenPath(route.params.url as string | string[] | undefined)

if (!parsed) {
  throw createError({ statusCode: 404, statusMessage: 'Invalid open URL', fatal: true })
}

if (appsError.value) {
  throw createError({ statusCode: 503, statusMessage: 'Mini app directory unavailable', fatal: true })
}

const listedApp = computed(() => findByHost(apps.value, parsed.host))

const { data: siteMetadata } = await useAsyncData(
  `site-metadata:${parsed.full}`,
  () => listedApp.value
    ? Promise.resolve(null)
    : $fetch<SiteMetadata | null>('/api/site-metadata', { query: { url: parsed.full } }).catch(() => null),
)

const app = computed(() => listedApp.value ?? {
  name: parsed.host,
  description: siteMetadata.value?.description ?? '',
  logo: siteMetadata.value?.icon ?? '',
  url: parsed.full,
})

const forwardQuery = computed(() => route.query as Record<string, string | string[]>)
const hasQuery = computed(() => Object.keys(forwardQuery.value).length > 0)

const fullUrl = computed(() =>
  hasQuery.value ? joinQuery(parsed.full, forwardQuery.value) : parsed.full,
)

const deeplinkPath = computed(() => buildOpenPath(fullUrl.value))

const siteName = computed(() => listedApp.value ? '' : siteMetadata.value?.name ?? '')
const seoDescription = computed(() => listedApp.value?.description ?? t('open.unlisted'))

useSeoMeta({
  title: () => `${t('open.title', { name: app.value.name })} · Nimiq Pay`,
  description: () => seoDescription.value,
  ogTitle: () => app.value.name,
  ogDescription: () => clampDescription(seoDescription.value),
  robots: 'noindex',
})

if (import.meta.prerender && listedApp.value) {
  const { name, description, developer, logo, url, type, slug } = listedApp.value
  // The bare deeplink is prerendered (see nuxt.config nitro hook). Render the
  // app's card here, sharing the detail page's render via the same cacheKey.
  defineOgImage('OgMiniApp', {
    title: name,
    description,
    developer: developer ?? undefined,
    logo,
    url,
    type,
  }, {
    cacheKey: `miniapp-${type}-${slug}`,
  })
}
else {
  // Runtime query / sub-path variants can't render under zeroRuntime; use the
  // static brand image so the card never 404s.
  useSeoMeta({ ogImage: '/og-default.png' })
}

// Smart App Banner on iOS Safari — `app-argument` is delivered to the app via
// appUrlOpen and resolved by the existing https branch in src/lib/deep-link.ts,
// which only accepts `/miniapps/open/…`: strip the locale prefix. Keep the raw
// path, since `deeplinkPath` is decoded and loses an encoded `#` (`%23`).
// Include `search` so query params forwarded to the mini-app survive the launch.
const requestUrl = useRequestURL()
// The deeplink must use the public origin. At runtime requestUrl.origin already
// is the real host; at prerender it's localhost, so use the canonical site URL.
const { url: siteUrl } = useSiteConfig()
const origin = import.meta.prerender ? siteUrl.replace(/\/$/, '') : requestUrl.origin
const openPath = requestUrl.pathname.replace(new RegExp(`^/${locale.value}(?=/)`, 'i'), '')
const appArgument = computed(() => `${origin}${openPath}${requestUrl.search}`)
useHead({
  meta: [
    { name: 'apple-itunes-app', content: () => `app-id=${IOS_APP_ID}, app-argument=${appArgument.value}` },
  ],
})

definePageMeta({ robots: false })
</script>

<template>
  <article
    class="relative min-h-[calc(100vh-260px)] grid place-items-center py-20 text-center"
  >
    <div
      class="absolute top-0 bottom-0 left-1/2 w-screen -translate-x-1/2 bg-[radial-gradient(circle_at_18%_50%,rgba(255,199,44,0.12),transparent_30%),radial-gradient(circle_at_82%_45%,rgba(20,122,243,0.12),transparent_32%)]"
      aria-hidden="true"
    />

    <div class="relative flex flex-col items-center max-w-[680px] mx-auto">
      <p class="m-0 mb-8 px-4 py-2 rounded-full bg-[var(--chip-blue-bg)] text-[var(--chip-blue-text)] text-[11px] font-extrabold uppercase tracking-[0.12em]">
        {{ t('open.invite') }}
      </p>
      <div class="relative w-[120px] h-[120px] mb-7 grid place-items-center">
        <motion.div
          v-for="(base, i) in [0.45, 0.75, 1]"
          :key="i"
          class="absolute inset-0 rounded-[32px] border border-[var(--border-default)]"
          :initial="{ scale: base, opacity: 0.65 - i * 0.18 }"
          :animate="reduced ? { scale: base, opacity: 0.65 - i * 0.18 } : { scale: [base, base * 1.15, base], opacity: [0.65 - i * 0.18, 0.22, 0.65 - i * 0.18] }"
          :transition="reduced ? { duration: 0 } : { duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }"
          aria-hidden="true"
        />
        <MiniAppLogo :logo="app.logo" :url="app.url" :name="app.name" size="lg" />
      </div>

      <h1 class="m-0 text-[46px] sm:text-[64px] font-black tracking-[-0.03em] leading-[0.96] max-w-[12ch] text-[var(--heading-contrast)] [overflow-wrap:anywhere]">
        {{ t('open.heading', { name: app.name }) }}
      </h1>
      <p
        v-if="siteName && siteName.toLowerCase() !== parsed.host"
        class="m-0 mt-3 text-xl sm:text-2xl font-bold text-[var(--heading-contrast)] max-w-[24ch] [overflow-wrap:anywhere]"
      >
        {{ siteName }}
      </p>
      <p v-if="app.description" class="m-0 mt-4 text-lg sm:text-xl text-secondary max-w-[42ch] leading-[1.5]">
        {{ app.description }}
      </p>
      <p
        v-if="!listedApp"
        class="m-0 mt-4 text-sm text-tertiary max-w-[42ch] leading-[1.5]"
      >
        {{ t('open.unlisted') }}
      </p>

      <div
        class="w-full max-w-[560px] mt-10"
      >
        <OpenInPayCTA :deeplink="deeplinkPath" :fallback-url="fullUrl" :type="listedApp?.type" />
      </div>
    </div>
  </article>
</template>
