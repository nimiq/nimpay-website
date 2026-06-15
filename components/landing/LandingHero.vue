<script setup lang="ts">
import { motion } from 'motion-v'
import homeNim840 from '~/assets/screenshots/home-nim-840.webp'

const { t } = useI18n()
</script>

<template>
  <section class="min-h-[calc(100vh-220px)] grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center py-12 sm:py-20">
    <div class="flex flex-col gap-7 max-w-[620px]">
      <h1 class="m-0 max-w-[560px] text-[42px] sm:text-[58px] lg:text-[66px] font-black leading-[1.02] tracking-[-0.02em] text-balance text-[var(--text-primary)]">
        {{ t('landing.hero.title') }}
      </h1>
      <p class="m-0 text-lg sm:text-xl text-secondary leading-[1.45] max-w-[620px]">
        {{ t('landing.hero.subtitle') }}
      </p>
      <StoreButtons size="lg" class="mt-2" />
    </div>
    <motion.div
      class="relative rounded-[40px] px-10 pt-12 sm:px-20 sm:pt-14 pb-0 mb-8 overflow-visible shadow-[0_40px_100px_-50px_rgba(32,35,75,0.55)]"
      :style="{ background: 'var(--brand-yellow-gradient)' }"
      :initial="{ y: 16 }"
      :animate="{ y: 0 }"
      :transition="{ type: 'spring', stiffness: 320, damping: 24 }"
    >
      <LandingPhoneShot
        :src="homeNim840"
        :alt="t('landing.hero.phoneAlt')"
        :width="840"
        :height="1825"
        priority
        class="relative max-w-[250px] sm:max-w-[300px] mx-auto -mb-8"
      />
    </motion.div>
  </section>
</template>
