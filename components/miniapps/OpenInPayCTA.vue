<script setup lang="ts">
import type { MiniAppType } from '~~/server/utils/miniapps'
import { motion } from 'motion-v'
import { APP_STORE_URL, buildAndroidIntentUrl, buildIosCustomSchemeUrl, detectMobilePlatform, IOS_STORE_FALLBACK_MS, PLAY_STORE_URL } from '~~/utils/deeplink'
import { themeForType } from '~/utils/miniAppType'

const props = withDefaults(defineProps<{
  deeplink: string
  fallbackUrl: string
  type: MiniAppType
  compact?: boolean
}>(), { compact: false })

const { t } = useI18n()
const localePath = useLocalePath()
const localizedDeeplink = computed(() => localePath(props.deeplink))
const theme = computed(() => themeForType(props.type))

// Same-origin Universal Links / App Links are blocked by Safari and Chrome.
// Re-dispatch via platform-specific schemes that bypass the block.
function onOpenInApp(e: MouseEvent) {
  // Allow modifier/middle clicks to keep their default behavior (new tab etc.).
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const platform = detectMobilePlatform()
  if (!platform) return
  e.preventDefault()
  if (platform === 'android') {
    window.location.href = buildAndroidIntentUrl(props.fallbackUrl)
    return
  }
  // iOS custom schemes fail silently when the app is not installed. Schedule a
  // store fallback that fires only if the page is still visible (i.e. the app
  // did not take over and backgrounded Safari).
  const fallbackTimer = window.setTimeout(() => {
    if (!document.hidden) window.location.href = APP_STORE_URL
  }, IOS_STORE_FALLBACK_MS)
  const cancel = () => {
    if (document.hidden) window.clearTimeout(fallbackTimer)
  }
  document.addEventListener('visibilitychange', cancel, { once: true })
  window.location.href = buildIosCustomSchemeUrl(props.fallbackUrl)
}

const btnBase = 'inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold no-underline text-base transition-[transform,filter] duration-150 active:scale-[0.98] hover:brightness-[1.05]'
const primary = `${btnBase} text-white`
const link = 'inline-flex items-center justify-center bg-transparent text-tertiary font-medium text-sm no-underline hover:text-[var(--text-primary)] focus-ring rounded'
const storeBtn = 'flex items-center justify-center gap-2 h-12 px-5 w-full min-w-min rounded-xl bg-[var(--surface-1)] border border-[var(--border-default)] text-[var(--text-primary)] no-underline transition-[background,border-color] duration-150 hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] focus-ring'
</script>

<template>
  <div class="flex flex-col gap-3.5 items-stretch">
    <motion.a
      :href="localizedDeeplink"
      :class="primary"
      :style="{ background: theme.gradient, boxShadow: theme.ctaShadow }"
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
      {{ t('cta.openInPay') }}
    </motion.a>
    <div v-if="!compact" class="grid grid-cols-2 gap-2.5">
      <motion.a
        :href="APP_STORE_URL"
        :class="storeBtn"
        :aria-label="t('cta.installIOS')"
        target="_blank"
        rel="noopener"
        :while-hover="{ y: -2 }"
        :while-press="{ scale: 0.97 }"
        :transition="{ type: 'spring', stiffness: 380, damping: 22 }"
      >
        <svg viewBox="0 0 640 640" class="w-6 h-6 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M496 96L144 96C117.5 96 96 117.5 96 144L96 496C96 522.5 117.5 544 144 544L496 544C522.5 544 544 522.5 544 496L544 144C544 117.5 522.5 96 496 96zM223 448.5C217.5 458.1 205.2 461.3 195.7 455.8C186.1 450.3 182.9 438 188.4 428.5L202.7 403.8C218.8 398.9 232 402.7 242.3 415.2L223 448.5zM361.9 394.6L180 394.6C169 394.6 160 385.6 160 374.6C160 363.6 169 354.6 180 354.6L231 354.6L296.4 241.4L275.9 206C270.4 196.4 273.7 184.2 283.2 178.7C292.8 173.2 305 176.5 310.5 186L319.4 201.4L328.3 186C333.8 176.4 346.1 173.2 355.6 178.7C365.2 184.2 368.4 196.5 362.9 206L277.1 354.6L339.2 354.6C359.4 354.6 370.7 378.3 361.9 394.6zM460 394.6L431 394.6L450.6 428.5C456.1 438.1 452.8 450.3 443.3 455.8C433.7 461.3 421.5 458 416 448.5C383.1 391.6 358.5 348.8 342 320.4C325.3 291.4 337.2 262.4 349.1 252.6C362.2 275.3 381.8 309.3 408 354.6L460 354.6C471 354.6 480 363.6 480 374.6C480 385.7 471 394.6 460 394.6z" />
        </svg>
        <span class="text-[15px] font-bold whitespace-nowrap">{{ t('cta.appStore') }}</span>
      </motion.a>
      <motion.a
        :href="PLAY_STORE_URL"
        :class="storeBtn"
        :aria-label="t('cta.installAndroid')"
        target="_blank"
        rel="noopener"
        :while-hover="{ y: -2 }"
        :while-press="{ scale: 0.97 }"
        :transition="{ type: 'spring', stiffness: 380, damping: 22 }"
      >
        <svg viewBox="0 0 640 640" class="w-6 h-6 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M389.6 298.3L168.9 77L449.7 238.2L389.6 298.3zM111.3 64C98.3 70.8 89.6 83.2 89.6 99.3L89.6 540.6C89.6 556.7 98.3 569.1 111.3 575.9L367.9 319.9L111.3 64zM536.5 289.6L477.6 255.5L411.9 320L477.6 384.5L537.7 350.4C555.7 336.1 555.7 303.9 536.5 289.6zM168.9 563L449.7 401.8L389.6 341.7L168.9 563z" />
        </svg>
        <span class="text-[15px] font-bold whitespace-nowrap">{{ t('cta.googlePlay') }}</span>
      </motion.a>
    </div>
    <motion.a
      :href="fallbackUrl"
      :class="link"
      target="_blank"
      rel="noopener"
      :while-hover="{ x: 2 }"
      :transition="{ type: 'spring', stiffness: 380, damping: 22 }"
    >
      {{ t('cta.continueInBrowser') }} →
    </motion.a>
  </div>
</template>
