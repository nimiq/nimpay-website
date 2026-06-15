<script setup lang="ts">
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'

const FAQ_KEYS = ['cost', 'custody', 'where', 'currencies', 'miniapps', 'account'] as const

const { t } = useI18n()
</script>

<template>
  <section class="flex flex-col gap-8 w-full max-w-[860px] mx-auto">
    <h2 class="m-0 text-[40px] sm:text-[56px] font-black tracking-[-0.025em] leading-[0.98] text-center text-balance text-[var(--text-primary)]">
      {{ t('landing.faq.title') }}
    </h2>
    <AccordionRoot type="single" collapsible class="rounded-[32px] bg-[var(--surface-1)] border border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)] shadow-[var(--card-shadow)] overflow-hidden">
      <AccordionItem v-for="key in FAQ_KEYS" :key="key" :value="key">
        <AccordionHeader as="h3" class="m-0">
          <AccordionTrigger class="faq-trigger flex w-full items-center justify-between gap-4 py-5 px-6 bg-transparent border-none cursor-pointer text-left text-base sm:text-lg font-black text-[var(--text-primary)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--colors-orange-1100)]">
            {{ t(`landing.faq.items.${key}.q`) }}
            <svg viewBox="0 0 16 16" class="faq-chevron w-4 h-4 shrink-0 text-tertiary" aria-hidden="true">
              <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent class="faq-content overflow-hidden">
          <p class="m-0 px-6 pb-5 text-[15px] sm:text-base text-secondary leading-[1.55]">
            {{ t(`landing.faq.items.${key}.a`) }}
          </p>
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  </section>
</template>

<style scoped>
.faq-chevron {
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.faq-trigger[data-state='open'] .faq-chevron {
  transform: rotate(180deg);
}
@media (prefers-reduced-motion: no-preference) {
  .faq-content[data-state='open'] {
    animation: faq-slide-down 220ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .faq-content[data-state='closed'] {
    animation: faq-slide-up 180ms cubic-bezier(0.22, 1, 0.36, 1);
  }
}
@keyframes faq-slide-down {
  from { height: 0; }
  to { height: var(--reka-accordion-content-height); }
}
@keyframes faq-slide-up {
  from { height: var(--reka-accordion-content-height); }
  to { height: 0; }
}
</style>
