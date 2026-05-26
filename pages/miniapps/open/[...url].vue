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

definePageMeta({ robots: false, layout: false })
</script>

<template>
  <article
    v-if="app"
    class="relative w-full min-h-screen overflow-hidden text-white"
    style="color-scheme: dark;"
    data-theme="dark"
  >
    <div
      class="absolute inset-0"
      :style="{
        background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.42) 0%, transparent 62%), radial-gradient(circle at 50% 30%, var(--colors-blue-1100) 0%, transparent 55%), radial-gradient(circle at 88% 96%, var(--colors-orange-1100) 0%, transparent 38%), var(--colors-darkblue)`,
      }"
      aria-hidden="true"
    />
    <HexField color="rgba(255,255,255,0.07)" :size="28" />

    <div class="relative flex flex-col items-center justify-center px-6 py-16 min-h-screen text-center">
      <div class="relative w-[220px] h-[220px] mb-8 grid place-items-center">
        <motion.div
          v-for="(base, i) in [0.45, 0.75, 1]"
          :key="i"
          class="absolute inset-0 rounded-full border border-white/20"
          :initial="{ scale: base, opacity: 0.65 - i * 0.18 }"
          :animate="reduced ? { scale: base, opacity: 0.65 - i * 0.18 } : { scale: [base, base * 1.15, base], opacity: [0.65 - i * 0.18, 0.22, 0.65 - i * 0.18] }"
          :transition="reduced ? { duration: 0 } : { duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }"
          aria-hidden="true"
        />
        <MiniAppLogo :logo="app.logo" :url="app.url" :name="app.name" size="lg" />
      </div>

      <h1 class="m-0 text-[26px] sm:text-[34px] font-bold tracking-[-0.025em] leading-[1.1] max-w-[28ch] text-white">
        {{ t('open.heading', { name: app.name }) }}
      </h1>
      <p class="m-0 mt-3 text-sm sm:text-base text-white/90 max-w-[44ch] leading-[1.5]">
        {{ t('open.hint') }}
      </p>

      <div
        class="w-full max-w-[360px] mt-8 [--surface-1:rgb(255_255_255/0.08)] [--surface-2:rgb(255_255_255/0.14)] [--border-default:rgb(255_255_255/0.22)] [--border-strong:rgb(255_255_255/0.34)] [--text-primary:#f4f4f8] [--text-tertiary:rgb(255_255_255/0.78)]"
      >
        <OpenInPayCTA :deeplink="deeplinkPath" :fallback-url="fullUrl" :type="app.type" />
      </div>
    </div>
  </article>
</template>
