<script setup lang="ts">
// Redirect people looking for the Mini Apps Competition entry form.
const { t } = useI18n()

const COMPETITION_URL = 'https://miniappscompetition.com/submit'
</script>

<template>
  <aside
    class="flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:pr-6 rounded-2xl border border-[light-dark(#f6d3bd,rgba(250,140,90,0.30))] bg-[light-dark(#fff6ee,rgba(250,140,80,0.10))]"
  >
    <span
      class="flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-[light-dark(#ffe6d3,rgba(250,140,80,0.18))] text-[var(--colors-orange,#f2760f)]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" class="w-[22px] h-[22px]" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    </span>

    <div class="flex flex-col gap-1 min-w-0 flex-1">
      <p class="m-0 text-[15px] font-extrabold text-[var(--text-primary)]">
        {{ t('submit.competition.title') }}
      </p>
      <p class="m-0 text-sm leading-[1.5] text-secondary">
        {{ t('submit.competition.body') }}
      </p>
    </div>

    <a
      :href="COMPETITION_URL"
      target="_blank"
      rel="noopener"
      class="group inline-flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto min-h-11 px-4 rounded-xl bg-[light-dark(#f2760f,rgba(250,140,80,0.16))] text-[light-dark(#ffffff,#ffb787)] font-bold text-sm no-underline transition-[filter,background-color] duration-150 hover:brightness-[1.05] focus-ring"
    >
      {{ t('submit.competition.cta') }}
      <ArrowIcon direction="top-right" class="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  </aside>
</template>
