<script setup lang="ts">
import { motion } from 'motion-v'
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'

const route = useRoute()
const localePath = useLocalePath()

const isLanding = computed(() => route.path === localePath('/'))
const showSubmit = computed(() => route.path.includes('/miniapps'))

const menuOpen = ref(false)
// Safety net for anchor links (e.g. #download) that DialogClose can't always catch.
watch(() => route.fullPath, () => { menuOpen.value = false })
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header
      class="flex items-center justify-between gap-2 sm:gap-3 px-4 py-4 sm:px-8 border-b border-[var(--header-border)] sticky top-0 z-50 bg-[var(--header-bg)] backdrop-blur-xl"
    >
      <div class="flex items-center gap-3 sm:gap-7 min-w-0">
        <NuxtLink :to="$localePath('/')" class="flex items-center min-h-11 gap-2.5 no-underline shrink-0" aria-label="Nimiq Pay">
          <!-- Landing shows the wordmark on sm+; everywhere else (and landing on mobile) shows the compact hex mark to save header width. -->
          <NimiqPayLogo v-if="isLanding" class="hidden sm:block h-7 w-auto" />
          <motion.span
            class="w-8 h-8 rounded-lg grid place-items-center overflow-hidden shadow-[0_10px_24px_rgba(255,199,44,0.28)]"
            :class="isLanding ? 'sm:hidden' : ''"
            aria-hidden="true"
            tabindex="-1"
            :while-hover="{ rotate: -8, scale: 1.08 }"
            :while-press="{ scale: 0.92 }"
            :transition="{ type: 'spring', stiffness: 380, damping: 18 }"
          >
            <img src="/header-mark.svg" alt="" class="w-full h-full block">
          </motion.span>
        </NuxtLink>
        <nav class="flex items-center gap-1 sm:gap-2">
          <NuxtLink
            :to="$localePath('/miniapps')"
            class="nav-link inline-flex items-center whitespace-nowrap shrink-0 min-h-11 px-2 sm:px-2.5 py-1.5 rounded-lg text-[14px] font-semibold text-secondary no-underline hover:text-[var(--text-primary)] focus-ring"
          >
            {{ $t('nav.miniApps') }}
          </NuxtLink>
          <a
            href="https://nimiq.dev"
            target="_blank"
            rel="noopener"
            class="nav-link hidden sm:inline-flex items-center min-h-11 px-2.5 py-1.5 rounded-lg text-[14px] font-semibold text-secondary no-underline hover:text-[var(--text-primary)] focus-ring"
          >
            {{ $t('nav.developers') }}
          </a>
          <a
            href="https://www.nimiq.com/blog/"
            target="_blank"
            rel="noopener"
            class="nav-link hidden sm:inline-flex items-center min-h-11 px-2.5 py-1.5 rounded-lg text-[14px] font-semibold text-secondary no-underline hover:text-[var(--text-primary)] focus-ring"
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
        <DialogRoot v-model:open="menuOpen">
          <DialogTrigger
            class="sm:hidden w-11 h-11 grid place-items-center rounded-lg text-secondary hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] focus-ring"
            :aria-label="$t('nav.menu')"
          >
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay class="menu-overlay fixed inset-0 z-[60] bg-[rgba(13,16,32,0.45)] backdrop-blur-sm" />
            <DialogContent
              class="menu-drawer fixed top-0 right-0 bottom-0 z-[70] w-[80%] max-w-[320px] flex flex-col gap-1 p-5 bg-[var(--app-bg)] border-l border-[var(--header-border)] shadow-[-24px_0_60px_-30px_rgba(13,16,32,0.5)] pt-[max(1.25rem,env(safe-area-inset-top))] pr-[max(1.25rem,env(safe-area-inset-right))]"
              :aria-describedby="undefined"
            >
              <div class="flex items-center justify-between mb-3">
                <DialogTitle class="m-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-label">
                  {{ $t('nav.menu') }}
                </DialogTitle>
                <DialogClose
                  class="w-11 h-11 -mr-2 grid place-items-center rounded-lg text-secondary hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] focus-ring"
                  :aria-label="$t('nav.closeMenu')"
                >
                  <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </DialogClose>
              </div>
              <DialogClose as-child>
                <a
                  href="https://nimiq.dev"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center min-h-12 px-3 rounded-xl text-base font-bold text-secondary no-underline hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] focus-ring"
                >
                  {{ $t('nav.developers') }}
                </a>
              </DialogClose>
              <DialogClose as-child>
                <a
                  href="https://www.nimiq.com/blog/"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center min-h-12 px-3 rounded-xl text-base font-bold text-secondary no-underline hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] focus-ring"
                >
                  {{ $t('nav.blog') }}
                </a>
              </DialogClose>
              <DialogClose v-if="isLanding" as-child>
                <NuxtLink
                  to="#download"
                  class="flex items-center justify-center min-h-12 mt-3 px-4 rounded-xl bg-[light-dark(#000000,#ffffff)] text-[light-dark(#ffffff,var(--brand-ink))] text-base font-extrabold no-underline focus-ring"
                >
                  {{ $t('nav.downloadApp') }}
                </NuxtLink>
              </DialogClose>
              <DialogClose v-else-if="showSubmit" as-child>
                <NuxtLink
                  :to="$localePath('/miniapps/submit')"
                  class="flex items-center justify-center min-h-12 mt-3 px-4 rounded-xl bg-[var(--surface-2)] text-[var(--text-primary)] text-base font-extrabold no-underline hover:bg-[var(--surface-hover)] focus-ring"
                >
                  {{ $t('nav.submitApp') }}
                </NuxtLink>
              </DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
      </div>
    </header>
    <EcosystemBanner v-if="route.meta.ecosystemBanner" />
    <main class="flex-1 px-5 py-8 sm:px-8 sm:py-12 max-w-[1280px] w-full mx-auto">
      <slot />
    </main>
    <footer class="px-8 py-6 border-t border-[var(--header-border)] text-center text-[13px] text-tertiary">
      <p class="my-1">
        {{ $t('footer.source') }} <a href="https://github.com/nimiq/awesome" target="_blank" rel="noopener" class="inline-flex items-center min-h-11 px-1 no-underline hover:underline focus-ring rounded">nimiq/awesome</a>
      </p>
      <p class="my-1 flex flex-wrap items-center justify-center gap-x-2">
        <a href="https://nimiq.com" target="_blank" rel="noopener" class="inline-flex items-center min-h-11 px-1 no-underline hover:underline focus-ring rounded">nimiq.com</a>
        <span aria-hidden="true">·</span>
        <a href="https://www.nimiq.com/nimiq-pay/" target="_blank" rel="noopener" class="inline-flex items-center min-h-11 px-1 no-underline hover:underline focus-ring rounded">{{ $t('footer.aboutPay') }}</a>
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

@keyframes menu-overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes menu-overlay-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes menu-drawer-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes menu-drawer-out {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

.menu-overlay[data-state="open"] { animation: menu-overlay-in 0.2s ease-out; }
.menu-overlay[data-state="closed"] { animation: menu-overlay-out 0.15s ease-in; }
.menu-drawer[data-state="open"] { animation: menu-drawer-in 0.26s cubic-bezier(0.22, 1, 0.36, 1); }
.menu-drawer[data-state="closed"] { animation: menu-drawer-out 0.2s ease-in; }

@media (prefers-reduced-motion: reduce) {
  .menu-overlay[data-state],
  .menu-drawer[data-state] {
    animation-duration: 0.01ms;
  }
}
</style>
