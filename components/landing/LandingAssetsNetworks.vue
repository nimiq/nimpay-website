<script setup lang="ts">
const { t } = useI18n()

const cards = computed(() => [
  {
    key: 'nim',
    badgeBg: 'light-dark(rgb(255 199 44 / 0.16), rgb(255 199 44 / 0.18))',
    badgeText: 'light-dark(#9a6400, #ffd66e)',
    items: ['speed', 'potential', 'payments'],
  },
  {
    key: 'usdt',
    badgeBg: 'light-dark(rgb(37 167 124 / 0.14), rgb(37 167 124 / 0.2))',
    badgeText: 'light-dark(#047857, #5fd6ab)',
    items: ['stable', 'acceptance', 'support'],
  },
])
</script>

<template>
  <section class="flex flex-col gap-14">
    <header class="max-w-[820px] mx-auto text-center flex flex-col gap-5">
      <p class="m-0 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand-yellow-deep)]">
        {{ t('landing.assets.label') }}
      </p>
      <h2 class="m-0 text-[34px] sm:text-[64px] lg:text-[72px] font-black leading-[0.95] tracking-[-0.02em] text-[var(--text-primary)]">
        {{ t('landing.assets.title') }}
      </h2>
      <p class="m-0 text-lg text-secondary leading-[1.5]">
        {{ t('landing.assets.body') }}
      </p>
    </header>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <article
        v-for="card in cards"
        :key="card.key"
        class="h-full rounded-[32px] bg-[var(--surface-1)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-[var(--card-shadow)] flex flex-col"
      >
        <div>
          <div class="w-16 h-16 rounded-2xl grid place-items-center bg-white shadow-[0_16px_32px_rgba(32,35,75,0.12)]">
            <NimiqLogo v-if="card.key === 'nim'" class="w-11 h-11" />
            <UsdtLogo v-else class="w-12 h-12" />
          </div>
          <h3 class="mt-9 mb-4 text-[30px] sm:text-[36px] font-black tracking-[-0.02em] text-[var(--text-primary)]">
            {{ t(`landing.assets.${card.key}.title`) }}
          </h3>
          <p class="m-0 text-base sm:text-lg text-secondary leading-[1.55]">
            {{ t(`landing.assets.${card.key}.body`) }}
          </p>
          <ul class="list-none p-0 my-8 flex flex-col gap-4">
            <li v-for="item in card.items" :key="item" class="flex items-center gap-3 text-[15px] font-bold text-[var(--text-primary)]">
              <span class="w-5 h-5 rounded-full bg-[#21c76a] text-white grid place-items-center shrink-0" aria-hidden="true">
                <svg viewBox="0 0 16 16" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 8.2 6.4 11.5 13 4.5" />
                </svg>
              </span>
              {{ t(`landing.assets.${card.key}.items.${item}`) }}
            </li>
          </ul>
        </div>
        <div class="mt-auto pt-7 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span class="text-[11px] font-extrabold uppercase tracking-[0.12em] text-label">{{ t('landing.assets.bestFor') }}</span>
          <span class="self-start sm:self-auto px-4 py-2 rounded-full text-sm font-extrabold" :style="{ backgroundColor: card.badgeBg, color: card.badgeText }">
            {{ t(`landing.assets.${card.key}.bestFor`) }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>
