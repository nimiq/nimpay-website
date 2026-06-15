<script setup lang="ts">
const { t } = useI18n()
const REPEAT_COUNT = 8

const rows = computed(() => [
  {
    key: 'yellow',
    class: 'bg-[var(--brand-yellow)] text-[#000000] rotate-[-1.5deg]',
    items: [
      t('landing.marquee.selfCustodial'),
      t('landing.marquee.miniApps'),
      t('landing.marquee.zeroFees'),
    ],
  },
  {
    key: 'black',
    class: 'bg-[#000000] text-[#ffffff] rotate-[1.5deg] -mt-3',
    items: [
      t('landing.marquee.secureWallet'),
      t('landing.marquee.globalAccess'),
      t('landing.marquee.scanPay'),
    ],
  },
])
</script>

<template>
  <section class="w-screen ml-[calc(50%-50vw)] py-20 overflow-hidden">
    <div class="max-w-[760px] mx-auto px-5 text-center mb-16">
      <p class="m-0 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand-yellow-deep)]">
        {{ t('landing.marquee.label') }}
      </p>
      <h2 class="mt-5 mb-0 text-[42px] sm:text-[64px] font-black leading-[0.95] tracking-[-0.025em] text-balance text-[var(--text-primary)]">
        {{ t('landing.marquee.title') }}
      </h2>
      <p class="mt-5 mb-0 text-lg text-secondary leading-[1.5]">
        {{ t('landing.marquee.body') }}
      </p>
    </div>
    <div
      v-for="row in rows"
      :key="row.key"
      class="relative w-[115vw] -ml-[7.5vw] py-7 shadow-[0_24px_50px_rgba(32,35,75,0.12)]"
      :class="row.class"
    >
      <div class="marquee-line flex w-max">
        <ul
          v-for="copy in REPEAT_COUNT"
          :key="copy"
          class="list-none p-0 m-0 flex items-center"
          :aria-hidden="copy > 1 ? 'true' : undefined"
        >
          <li
            v-for="item in row.items"
            :key="item"
            class="flex items-center gap-10 mr-10 whitespace-nowrap text-[42px] sm:text-[68px] font-black uppercase leading-none tracking-[0.01em]"
          >
            <span>{{ item }}</span>
            <span class="w-9 h-9 rounded-lg border-4 border-current opacity-40 rotate-45" aria-hidden="true" />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-line {
  animation: landing-marquee 32s linear infinite;
}

@keyframes landing-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-12.5%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-line {
    animation: none;
  }
}
</style>
