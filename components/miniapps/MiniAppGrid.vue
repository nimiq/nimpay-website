<script setup lang="ts">
import type { MiniApp } from '~~/server/utils/miniapps'

defineProps<{ apps: MiniApp[], query?: string }>()
const emit = defineEmits<{ clear: [] }>()
const { t } = useI18n()

const suggestions = ['shopping', 'utility', 'gaming', 'finance'] as const
</script>

<template>
  <div>
    <TransitionGroup
      v-if="apps.length"
      tag="ul"
      name="grid"
      class="relative list-none p-0 m-0 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5"
    >
      <li
        v-for="app in apps"
        :key="`${app.type}/${app.slug}`"
        class="h-full"
      >
        <MiniAppCard :app="app" />
      </li>
    </TransitionGroup>
    <div v-else class="min-h-[560px] flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div class="relative w-40 h-40 rounded-full bg-[light-dark(#fff9df,rgb(255,199,44,0.12))] grid place-items-center">
        <svg viewBox="0 0 72 72" class="w-20 h-20 text-[var(--brand-yellow-deep)]" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M22 28c0-9 6-15 14-15s14 6 14 15v22c0 5-5 8-9 4-3 4-7 4-10 0-4 4-9 1-9-4V28Z" />
          <path d="M30 31h.01M42 31h.01M36 43h.01" />
        </svg>
        <span class="absolute right-8 top-9 w-10 h-10 rounded-full bg-[light-dark(#ffffff,#272a52)] border border-[var(--border-subtle)] shadow-[var(--card-shadow)] grid place-items-center text-[var(--brand-yellow-deep)] font-black">?</span>
      </div>
      <div class="flex gap-1.5" aria-hidden="true">
        <span class="w-2 h-2 rounded-full bg-[var(--brand-yellow)]" />
        <span class="w-2 h-2 rounded-full bg-[#ffe681]" />
        <span class="w-2 h-2 rounded-full bg-[var(--brand-yellow)]" />
      </div>
      <div class="flex flex-col gap-3 max-w-[460px]">
        <h3 class="m-0 text-[30px] sm:text-[38px] font-black tracking-[-0.025em] text-[var(--heading-contrast)]">
          {{ t('home.noResultsTitle') }}
        </h3>
        <p class="m-0 text-lg text-secondary leading-[1.5]">
          {{ query?.trim() ? t('home.emptyFor', { query: query.trim() }) : t('home.empty') }}
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 px-7 py-4 min-h-14 rounded-2xl border border-transparent bg-[var(--brand-yellow)] text-[var(--brand-navy)] text-base font-black cursor-pointer shadow-[0_14px_28px_rgba(255,199,44,0.28)] transition-[background,border-color] duration-150 hover:bg-[var(--brand-yellow-deep)] focus-ring"
        @click="emit('clear')"
      >
        <svg viewBox="0 0 16 16" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" />
          <path d="M13.5 3.5v4h-4" />
        </svg>
        {{ t('home.browseAll') }}
      </button>
      <div class="flex flex-col gap-3 items-center">
        <p class="m-0 text-[11px] font-extrabold uppercase tracking-[0.16em] text-label">
          {{ t('home.suggestedCategories') }}
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            type="button"
            class="px-4 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-1)] text-sm font-bold text-secondary cursor-pointer hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-ring"
            @click="emit('clear')"
          >
            {{ t(`home.suggestions.${suggestion}`) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transition-delay: 0.05s;
}

.grid-leave-active {
  position: absolute;
  transition: opacity 0.12s ease, transform 0.1s ease;
}

.grid-move {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: 0.15s;
}

.grid-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.grid-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@media (prefers-reduced-motion: reduce) {
  .grid-enter-active,
  .grid-leave-active,
  .grid-move {
    transition: none;
  }
}
</style>
