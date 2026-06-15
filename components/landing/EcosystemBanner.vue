<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="px-5 py-2.5 sm:px-8 bg-[var(--strip-bg)] border-b border-[var(--header-border)] text-center text-[13px] text-secondary">
    {{ t('landing.banner.text') }}
    <a
      href="https://www.nimiq.com/nimiq-pay/"
      target="_blank"
      rel="noopener"
      class="ml-1 font-semibold text-[var(--text-primary)] no-underline hover:underline focus-ring rounded whitespace-nowrap"
    >
      {{ t('landing.banner.cta') }}
    </a>
  </div>
</template>
