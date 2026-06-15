<script setup lang="ts">
import { findMiniApp, isMiniAppType } from '~~/server/utils/miniapps'

const route = useRoute()
const { data: apps } = await useMiniApps()

const typeParam = String(route.params.type ?? '')
const slugParam = String(route.params.slug ?? '')

if (!isMiniAppType(typeParam)) {
  throw createError({ statusCode: 404, statusMessage: 'Unknown mini app type', fatal: true })
}

const app = computed(() => findMiniApp(apps.value, typeParam, slugParam))

if (!app.value) {
  throw createError({ statusCode: 404, statusMessage: 'Mini app not found', fatal: true })
}

useSeoMeta({
  title: () => `${app.value!.name} · Nimiq Pay Mini Apps`,
  description: () => app.value!.description,
  ogTitle: () => app.value!.name,
  ogDescription: () => clampDescription(app.value!.description),
})

const { name, description, developer, logo, url, type } = app.value!
defineOgImage('OgMiniApp', {
  title: name,
  description,
  developer: developer ?? undefined,
  logo,
  url,
  type,
}, {
  // Card content is locale-independent (English app data), so all 5 localized
  // routes share one render. The same cacheKey lets the /open dispatch route
  // reuse this prerendered card instead of rendering at runtime.
  cacheKey: `miniapp-${typeParam}-${slugParam}`,
})
</script>

<template>
  <MiniAppDetail v-if="app" :app="app" />
</template>
