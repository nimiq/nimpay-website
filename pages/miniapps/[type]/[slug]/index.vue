<script setup lang="ts">
import { findMiniApp, isMiniAppType } from '~~/server/utils/miniapps'
import { getFaviconUrl } from '~~/utils/deeplink'

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
  ogDescription: () => app.value!.description,
  ogImage: () => app.value!.logo || getFaviconUrl(app.value!.url) || undefined,
  ogType: 'website',
  twitterCard: 'summary',
})
</script>

<template>
  <MiniAppDetail v-if="app" :app="app" />
</template>
