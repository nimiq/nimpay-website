<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section
    id="download"
    class="relative scroll-mt-28 rounded-[40px] overflow-hidden p-8 sm:p-16 shadow-[0_34px_90px_-44px_rgba(255,199,44,0.75)]"
    :style="{ background: 'var(--brand-yellow-gradient)' }"
  >
    <div class="relative flex flex-col items-center gap-4 text-center">
      <h2 class="m-0 text-[42px] sm:text-[64px] font-black leading-[0.95] tracking-[-0.025em] text-balance !text-white">
        {{ t('landing.download.title') }}
      </h2>
      <p class="m-0 text-lg leading-[1.5] !text-white">
        {{ t('landing.download.body') }}
      </p>
      <StoreButtons size="lg" on-gradient class="mt-2 justify-center" />
    </div>
  </section>
</template>
