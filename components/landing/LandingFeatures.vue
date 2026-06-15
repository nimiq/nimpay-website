<script setup lang="ts">
import homeNim480 from '~/assets/screenshots/home-nim-480.webp'
import homeUsdt480 from '~/assets/screenshots/home-usdt-480.webp'
import miniApps480 from '~/assets/screenshots/mini-apps-480.webp'

const { t } = useI18n()
const localePath = useLocalePath()

const cards = computed(() => [
  {
    key: 'payments',
    src: homeNim480,
    alt: t('landing.hero.phoneAlt'),
    tint: 'var(--brand-yellow)',
    to: '#scan-pay-go',
  },
  {
    key: 'currencies',
    src: homeUsdt480,
    alt: t('landing.features.currencies.alt'),
    tint: 'var(--brand-blue)',
    to: '#download',
  },
  {
    key: 'rewards',
    src: miniApps480,
    alt: t('landing.features.rewards.alt'),
    tint: 'var(--brand-navy)',
    to: localePath('/miniapps'),
  },
])
</script>

<template>
  <section id="how-it-works" class="flex flex-col gap-10 scroll-mt-28">
    <div class="text-center max-w-[760px] mx-auto flex flex-col gap-4">
      <h2 class="m-0 text-[34px] sm:text-[48px] font-black leading-[1] tracking-[-0.02em] text-balance text-[var(--text-primary)]">
        {{ t('landing.features.title') }}
      </h2>
      <p class="m-0 text-base sm:text-lg text-secondary leading-[1.45]">
        {{ t('landing.features.subtitle') }}
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
      <NuxtLink
        v-for="card in cards"
        :key="card.key"
        :to="card.to"
        class="group min-w-0 h-full min-h-[480px] md:min-h-0 rounded-[32px] bg-[var(--surface-1)] border border-[var(--border-subtle)] p-6 sm:p-7 shadow-[var(--card-shadow)] overflow-hidden no-underline text-inherit flex flex-col justify-between transition-[background,border-color,box-shadow,transform] duration-200 hover:bg-[var(--card-hover-bg)] hover:border-[var(--border-default)] hover:shadow-[0_28px_80px_rgba(32,35,75,0.12)] focus-visible:bg-[var(--card-hover-bg)] focus-visible:border-[var(--border-default)] active:scale-[0.99] focus-ring"
      >
        <div>
          <p class="self-start m-0 px-3 py-1.5 rounded-full bg-[var(--chip-blue-bg)] text-[var(--chip-blue-text)] text-[11px] font-extrabold uppercase tracking-[0.1em]">
            {{ t(`landing.features.${card.key}.label`) }}
          </p>
          <h3 class="mt-5 mb-3 text-[27px] lg:text-[30px] font-black leading-[1.05] tracking-[-0.015em] text-[var(--text-primary)]">
            {{ t(`landing.features.${card.key}.title`) }}
          </h3>
          <p class="m-0 text-base text-secondary leading-[1.45]">
            {{ t(`landing.features.${card.key}.body`) }}
          </p>
        </div>
        <div class="relative mt-7 h-[220px] rounded-[24px] px-6 pt-8 overflow-hidden shrink-0" :style="{ backgroundColor: card.tint }">
          <LandingPhoneShot
            :src="card.src"
            :alt="card.alt"
            :width="480"
            :height="1043"
            bezel-radius="24px"
            screen-radius="18px"
            bezel-padding="7px"
            class="max-w-[145px] mx-auto -mb-10"
          />
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
