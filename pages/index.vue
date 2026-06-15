<script setup lang="ts">
definePageMeta({ ecosystemBanner: true })

const { t } = useI18n()
const { data: apps } = await useMiniApps()
const featured = computed(() => apps.value
  .filter(a => a.featured)
  .sort((a, b) => a.name.localeCompare(b.name))
  .slice(0, 3))

useSeoMeta({
  title: () => t('landing.metaTitle'),
  description: () => t('landing.metaDescription'),
  ogTitle: () => t('landing.metaTitle'),
  ogDescription: () => clampDescription(t('landing.metaDescription')),
})

defineOgImage('LandingCard', {
  title: t('landing.hero.title'),
  description: t('landing.hero.subtitle'),
})
</script>

<template>
  <div class="flex flex-col gap-20 sm:gap-28">
    <LandingHero />
    <LandingFactsStrip :count="apps.length" />
    <LandingFeatures />
    <LandingMarqueeBands />
    <LandingHowItWorks />
    <LandingAssetsNetworks />
    <LandingMiniApps v-if="featured.length" :apps="featured" :total="apps.length" />
    <LandingFaq />
    <LandingDownload />
  </div>
</template>
