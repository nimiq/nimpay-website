<script setup lang="ts">
import { motion } from 'motion-v'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header
      class="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 border-b border-[var(--header-border)] sticky top-0 z-10 bg-[var(--header-bg)]"
    >
      <NuxtLink :to="$localePath('/miniapps')" class="flex items-center gap-2.5 no-underline">
        <motion.span
          class="w-8 h-8 rounded-lg grid place-items-center overflow-hidden shadow-[0_8px_20px_rgba(224,135,0,0.24)]"
          aria-hidden="true"
          tabindex="-1"
          :while-hover="{ rotate: -8, scale: 1.08 }"
          :while-press="{ scale: 0.92 }"
          :transition="{ type: 'spring', stiffness: 380, damping: 18 }"
        >
          <img src="/header-mark.svg" alt="" class="w-full h-full block">
        </motion.span>
        <span class="font-bold text-base">Nimiq Pay</span>
        <span class="hidden sm:inline text-[13px] text-tertiary pl-2 border-l border-[var(--border-strong)] ml-1">Mini Apps</span>
      </NuxtLink>
      <div class="flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </header>
    <main class="flex-1 px-5 py-8 sm:px-8 sm:py-12 max-w-[1200px] w-full mx-auto">
      <slot />
    </main>
    <footer class="px-8 py-6 border-t border-[var(--header-border)] text-center text-[13px] text-tertiary">
      <p class="my-1">
        {{ $t('footer.source') }} <a href="https://github.com/nimiq/awesome" target="_blank" rel="noopener" class="inline-block py-2 no-underline hover:underline">nimiq/awesome</a>
      </p>
      <p class="my-1">
        <a href="https://nimiq.com" target="_blank" rel="noopener" class="inline-block py-2 no-underline hover:underline">nimiq.com</a> ·
        <a href="https://www.nimiq.com/nimiq-pay/" target="_blank" rel="noopener" class="inline-block py-2 no-underline hover:underline">{{ $t('footer.aboutPay') }}</a>
      </p>
    </footer>
  </div>
</template>
