<script setup lang="ts">
import { motion, useReducedMotion } from 'motion-v'
import { findByHost } from '~~/server/utils/miniapps'
import { buildOpenPath, IOS_APP_ID, joinQuery, parseOpenPath } from '~~/utils/deeplink'

const route = useRoute()
const { t } = useI18n()
const { data: apps } = await useMiniApps()
const reduced = useReducedMotion()

const parsed = parseOpenPath(route.params.url as string | string[] | undefined)

if (!parsed) {
  throw createError({ statusCode: 404, statusMessage: 'Invalid open URL', fatal: true })
}

const app = computed(() => findByHost(apps.value, parsed.host))

if (!app.value) {
  throw createError({ statusCode: 404, statusMessage: 'Unknown mini app host', fatal: true })
}

const forwardQuery = computed(() => route.query as Record<string, string | string[]>)
const hasQuery = computed(() => Object.keys(forwardQuery.value).length > 0)

const fullUrl = computed(() =>
  hasQuery.value ? joinQuery(parsed.full, forwardQuery.value) : parsed.full,
)

const deeplinkPath = computed(() => buildOpenPath(fullUrl.value))

useSeoMeta({
  title: () => `${t('open.title', { name: app.value!.name })} · Nimiq Pay`,
  description: () => app.value!.description,
})

// Smart App Banner on iOS Safari — `app-argument` is delivered to the app via
// appUrlOpen and resolved by the existing https branch in src/lib/deep-link.ts.
// Include `search` so query params forwarded to the mini-app survive the launch.
const requestUrl = useRequestURL()
const appArgument = computed(() => `${requestUrl.origin}${requestUrl.pathname}${requestUrl.search}`)
useHead({
  meta: [
    { name: 'apple-itunes-app', content: () => `app-id=${IOS_APP_ID}, app-argument=${appArgument.value}` },
  ],
})

definePageMeta({ robots: false })
</script>

<template>
  <article
    v-if="app"
    class="relative min-h-[calc(100vh-260px)] grid place-items-center overflow-hidden py-20 text-center"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(255,199,44,0.12),transparent_30%),radial-gradient(circle_at_82%_45%,rgba(20,122,243,0.12),transparent_32%)]"
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

      <h1 class="m-0 text-[46px] sm:text-[64px] font-black tracking-[-0.03em] leading-[0.96] max-w-[12ch] text-[var(--heading-contrast)]">
        {{ t('open.heading', { name: app.name }) }}
      </h1>
      <p class="m-0 mt-4 text-lg sm:text-xl text-secondary max-w-[42ch] leading-[1.5]">
        {{ app.description }}
      </p>

      <div
        class="w-full max-w-[560px] mt-10"
      >
        <OpenInPayCTA :deeplink="deeplinkPath" :fallback-url="fullUrl" :type="app.type" />
      </div>
    </div>
  </article>
</template>
