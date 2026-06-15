<script setup lang="ts">
import { motion } from 'motion-v'

const route = useRoute()
const localePath = useLocalePath()

const isLanding = computed(() => route.path === localePath('/'))
const showSubmit = computed(() => route.path.includes('/miniapps'))
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header
      class="flex items-center justify-between gap-3 px-5 py-4 sm:px-8 border-b border-[var(--header-border)] sticky top-0 z-50 bg-[var(--header-bg)] backdrop-blur-xl"
    >
      <div class="flex items-center gap-4 sm:gap-7 min-w-0">
        <NuxtLink :to="$localePath('/')" class="flex items-center gap-2.5 no-underline shrink-0" aria-label="Nimiq Pay">
          <NimiqPayLogo v-if="isLanding" class="h-7 w-auto block" />
          <template v-else>
            <motion.span
              class="w-8 h-8 rounded-lg grid place-items-center overflow-hidden shadow-[0_10px_24px_rgba(255,199,44,0.28)]"
              aria-hidden="true"
              tabindex="-1"
              :while-hover="{ rotate: -8, scale: 1.08 }"
              :while-press="{ scale: 0.92 }"
              :transition="{ type: 'spring', stiffness: 380, damping: 18 }"
            >
              <img src="/header-mark.svg" alt="" class="w-full h-full block">
            </motion.span>
          </template>
        </NuxtLink>
        <nav class="flex items-center gap-1 sm:gap-2">
          <NuxtLink
            :to="$localePath('/miniapps')"
            class="nav-link inline-flex items-center min-h-11 px-2.5 py-1.5 rounded-lg text-[14px] font-semibold text-secondary no-underline hover:text-[var(--text-primary)] focus-ring"
          >
            {{ $t('nav.miniApps') }}
          </NuxtLink>
          <a
            href="https://nimiq.dev"
            target="_blank"
            rel="noopener"
            class="nav-link inline-flex items-center min-h-11 px-2.5 py-1.5 rounded-lg text-[14px] font-semibold text-secondary no-underline hover:text-[var(--text-primary)] focus-ring"
          >
            {{ $t('nav.developers') }}
          </a>
          <a
            href="https://www.nimiq.com/blog/"
            target="_blank"
            rel="noopener"
            class="nav-link inline-flex items-center min-h-11 px-2.5 py-1.5 rounded-lg text-[14px] font-semibold text-secondary no-underline hover:text-[var(--text-primary)] focus-ring"
          >
            {{ $t('nav.blog') }}
          </a>
        </nav>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <NuxtLink
          v-if="isLanding"
          to="#download"
          class="hidden md:inline-flex items-center justify-center h-10 px-5 rounded-full bg-[light-dark(#000000,#ffffff)] text-[light-dark(#ffffff,var(--brand-ink))] text-sm font-extrabold no-underline shadow-[var(--button-shadow)] hover:bg-[light-dark(var(--brand-navy),rgba(255,255,255,0.9))] focus-ring"
        >
          {{ $t('nav.downloadApp') }}
        </NuxtLink>
        <NuxtLink
          v-else-if="showSubmit"
          :to="$localePath('/miniapps/submit')"
          class="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-xl bg-[var(--surface-2)] text-[var(--text-primary)] text-sm font-extrabold no-underline hover:bg-[var(--surface-hover)] focus-ring"
        >
          {{ $t('nav.submitApp') }}
        </NuxtLink>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </header>
    <EcosystemBanner v-if="route.meta.ecosystemBanner" />
    <main class="flex-1 px-5 py-8 sm:px-8 sm:py-12 max-w-[1280px] w-full mx-auto">
      <slot />
    </main>
    <footer class="px-8 py-6 border-t border-[var(--header-border)] text-center text-[13px] text-tertiary">
      <p class="my-1">
        {{ $t('footer.source') }} <a href="https://github.com/nimiq/awesome" target="_blank" rel="noopener" class="inline-block py-2 no-underline hover:underline focus-ring rounded">nimiq/awesome</a>
      </p>
      <p class="my-1">
        <a href="https://nimiq.com" target="_blank" rel="noopener" class="inline-block py-2 no-underline hover:underline focus-ring rounded">nimiq.com</a> ·
        <a href="https://www.nimiq.com/nimiq-pay/" target="_blank" rel="noopener" class="inline-block py-2 no-underline hover:underline focus-ring rounded">{{ $t('footer.aboutPay') }}</a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.nav-link.router-link-active {
  color: var(--text-primary);
  text-decoration: underline;
  text-decoration-color: var(--brand-yellow);
  text-decoration-thickness: 2px;
  text-underline-offset: 9px;
}
</style>
