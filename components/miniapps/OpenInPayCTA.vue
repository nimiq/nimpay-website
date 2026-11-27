<script setup lang="ts">
import type { MiniAppType } from '~~/server/utils/miniapps'
import { motion } from 'motion-v'
import { buildAndroidIntentUrl, detectMobilePlatform, openIosCustomSchemeWithStoreFallback } from '~~/utils/deeplink'
import { themeForType } from '~/utils/miniAppType'

const props = withDefaults(defineProps<{
  deeplink: string
  fallbackUrl: string
  type?: MiniAppType
  compact?: boolean
}>(), { compact: false })

const { t, locale, defaultLocale } = useI18n()
// localePath re-parses the deeplink: `?flag` becomes `?flag=`, `%20` becomes `+` and `%23` becomes `#`.
const localizedDeeplink = computed(() => locale.value === defaultLocale ? props.deeplink : `/${locale.value}${props.deeplink}`)
const theme = computed(() => props.type ? themeForType(props.type) : undefined)

// Same-origin Universal Links / App Links are blocked by Safari and Chrome.
// Re-dispatch via platform-specific schemes that bypass the block.
function onOpenInApp(e: MouseEvent) {
  // Allow modifier/middle clicks to keep their default behavior (new tab etc.).
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const platform = detectMobilePlatform()
  if (!platform) return
  e.preventDefault()
  if (platform === 'android') {
    window.location.href = buildAndroidIntentUrl(props.deeplink)
    return
  }
  openIosCustomSchemeWithStoreFallback(props.fallbackUrl)
}

const btnBase = 'inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-black no-underline text-base focus-ring'
const primary = `${btnBase} bg-[var(--brand-navy)] text-white shadow-[var(--button-shadow)]`
const link = 'inline-flex items-center justify-center min-h-12 px-5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-default)] text-secondary font-black text-sm no-underline hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] focus-ring'
</script>

<template>
  <div class="flex flex-col gap-3.5 items-stretch">
    <motion.a
      :href="localizedDeeplink"
      :class="primary"
      :style="{ boxShadow: theme?.ctaShadow }"
      :while-hover="{ scale: 1.02, y: -1 }"
      :while-press="{ scale: 0.97 }"
      :transition="{ type: 'spring', stiffness: 380, damping: 22 }"
      @click="onOpenInApp"
    >
      <svg viewBox="0 0 24 24" class="w-5 h-5 rotate-180" aria-hidden="true">
        <path
          d="M12 3v12m0 0-4-4m4 4 4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      {{ compact ? t('cta.openInPay') : t('cta.openInWallet') }}
    </motion.a>
    <StoreButtons v-if="!compact" />
    <motion.a
      :href="fallbackUrl"
      :class="link"
      target="_blank"
      rel="noopener"
      :while-hover="{ x: 2 }"
      :transition="{ type: 'spring', stiffness: 380, damping: 22 }"
    >
      {{ t('cta.continueInBrowser') }}
    </motion.a>
  </div>
</template>
