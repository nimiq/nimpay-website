<script setup lang="ts">
const props = defineProps<{ count: number }>()

const { t } = useI18n()

const facts = computed(() => [
  t('landing.facts.free'),
  t('landing.facts.selfCustodial'),
  t('landing.facts.miniApps', { count: props.count }),
  t('landing.facts.currencies'),
  t('landing.facts.acceptance'),
])

const DOT_COLORS = ['#7db7ff', '#ffc72c', '#7db7ff']
const REPEAT_COUNT = 8
</script>

<template>
  <div class="w-screen ml-[calc(50%-50vw)] py-4 bg-[var(--strip-bg)] border-y border-[var(--border-subtle)] overflow-hidden">
    <div class="facts-marquee flex w-max">
      <ul
        v-for="copy in REPEAT_COUNT"
        :key="copy"
        class="list-none m-0 p-0 flex items-center"
        :aria-hidden="copy > 1 ? 'true' : undefined"
      >
        <li v-for="(fact, i) in facts" :key="fact" class="flex items-center gap-2.5 mr-8 whitespace-nowrap">
          <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: DOT_COLORS[i % 3] }" />
          <span class="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--chip-blue-text)]">{{ fact }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.facts-marquee {
  animation: facts-marquee 28s linear infinite;
}
@keyframes facts-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-12.5%); }
}
@media (prefers-reduced-motion: reduce) {
  .facts-marquee {
    animation: none;
    width: 100%;
  }
  .facts-marquee > ul:last-child {
    display: none;
  }
  .facts-marquee > ul:first-child {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    row-gap: 8px;
  }
}
</style>
