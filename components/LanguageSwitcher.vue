<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'
import type { LocaleCode } from '~~/nuxt.config'
import { motion } from 'motion-v'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'

const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const open = ref(false)

const localeList = computed(() => locales.value as LocaleObject<LocaleCode>[])
const currentLocale = computed(() =>
  localeList.value.find(l => l.code === locale.value),
)
</script>

<template>
  <DropdownMenuRoot v-model:open="open">
    <DropdownMenuTrigger as-child>
      <motion.button
        type="button"
        class="inline-flex items-center gap-1.5 min-h-11 py-2.5 pl-3 pr-2.5 rounded-[10px] border border-[var(--border-default)] bg-[var(--surface-1)] text-inherit text-xs font-semibold cursor-pointer transition-colors duration-150 hover:bg-[var(--surface-3)] hover:border-[var(--border-strong)] data-[state=open]:bg-[var(--surface-3)] data-[state=open]:border-[var(--border-strong)] focus-ring"
        :aria-label="t('nav.language')"
        :while-hover="{ y: -1 }"
        :while-press="{ scale: 0.96 }"
        :transition="{ type: 'spring', stiffness: 380, damping: 22 }"
      >
        <LocaleFlag v-if="currentLocale" :code="currentLocale.code" :size="24" />
        <motion.svg
          viewBox="0 0 24 24"
          class="w-3.5 h-3.5 opacity-70"
          aria-hidden="true"
          :animate="{ rotate: open ? 180 : 0 }"
          :transition="{ type: 'spring', stiffness: 360, damping: 26 }"
        >
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </motion.svg>
      </motion.button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="8"
        align="end"
        class="lang-dropdown-content min-w-[180px] p-1.5 bg-[var(--dropdown-bg)] border border-[var(--border-default)] rounded-2xl z-[1000] shadow-[var(--shadow-dropdown)]"
      >
        <DropdownMenuItem
          v-for="l in localeList"
          :key="l.code"
          as-child
          :data-active="l.code === locale"
        >
          <NuxtLink
            :to="switchLocalePath(l.code) || '/'"
            class="lang-dropdown-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-inherit no-underline text-sm cursor-pointer outline-none select-none transition-colors duration-100 hover:bg-[var(--surface-3)] focus-visible:bg-[var(--surface-3)] data-[highlighted]:bg-[var(--surface-3)]"
          >
            <LocaleFlag :code="l.code" :size="22" />
            <span class="flex-1 font-medium">{{ l.name }}</span>
            <svg
              v-if="l.code === locale"
              viewBox="0 0 24 24"
              class="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path d="m5 12 5 5L20 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </NuxtLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style>
.lang-dropdown-content {
  transform-origin: var(--reka-dropdown-menu-content-transform-origin, top right);
}
.lang-dropdown-content[data-state='open'] {
  animation: lang-pop-in 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
.lang-dropdown-content[data-state='closed'] {
  animation: lang-pop-out 0.12s ease-in;
}
@keyframes lang-pop-in {
  from { opacity: 0; transform: translateY(-6px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes lang-pop-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-4px) scale(0.97); }
}
[data-active='true'] > .lang-dropdown-item {
  color: var(--colors-orange-1100, #f6831f);
}
</style>
