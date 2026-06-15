<script setup lang="ts">
import type { NuxtError } from '#app'
import { motion } from 'motion-v'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()

// error.vue renders outside app.vue, so the theme attribute must be applied here too
const { mode } = useTheme()
useHead({ htmlAttrs: { 'data-theme': () => mode.value ?? undefined } })

const isNotFound = computed(() => props.error.statusCode === 404)
const errorKind = computed(() => isNotFound.value ? 'NOT_FOUND' : 'INTERNAL_ERROR')

function handleClearError() {
  clearError({ redirect: localePath('/miniapps') })
}
</script>

<template>
  <div class="relative min-h-screen grid place-items-center bg-[var(--app-bg)] px-6 py-12 overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(255,199,44,0.14),transparent_30%),radial-gradient(circle_at_82%_45%,rgba(20,122,243,0.12),transparent_32%)]" aria-hidden="true" />
    <div class="relative max-w-[520px] text-center flex flex-col items-center gap-4">
      <BrokenHex :size="140" />
      <p class="m-0 mt-3 font-mono text-xs tracking-[0.14em] text-tertiary">
        ERR / {{ error.statusCode }} / {{ errorKind }}
      </p>
      <h1 class="m-0 mt-2 text-[42px] sm:text-[56px] font-black tracking-[-0.03em] leading-[0.98] text-[var(--heading-contrast)]">
        {{ isNotFound ? t('error.notFoundTitle') : t('error.genericTitle') }}
      </h1>
      <p class="m-0 max-w-[36ch] text-secondary text-[15px] leading-[1.5]">
        {{ isNotFound ? t('error.notFoundBody') : (error.message || t('error.genericBody')) }}
      </p>
      <div class="flex flex-wrap items-center justify-center gap-2.5 mt-4">
        <motion.button
          class="inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-2xl border-none bg-[var(--brand-navy)] text-white font-black cursor-pointer hover:brightness-[1.08] focus-ring"
          :while-hover="{ scale: 1.03, y: -1 }"
          :while-press="{ scale: 0.97 }"
          :transition="{ type: 'spring', stiffness: 380, damping: 20 }"
          @click="handleClearError"
        >
          {{ t('error.backToDirectory') }}
        </motion.button>
        <motion.a
          href="https://github.com/nimiq/awesome"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1.5 min-h-12 px-6 py-3 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-default)] text-inherit no-underline font-black hover:bg-[var(--surface-2)] focus-ring"
          :while-hover="{ y: -1 }"
          :while-press="{ scale: 0.97 }"
          :transition="{ type: 'spring', stiffness: 380, damping: 20 }"
        >
          {{ t('error.submitApp') }}
          <span aria-hidden="true">-></span>
        </motion.a>
      </div>
    </div>
  </div>
</template>
