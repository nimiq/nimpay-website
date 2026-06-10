<script setup lang="ts">
import { MotionConfig } from 'motion-v'

const localeHead = useLocaleHead()
const { mode, resolved } = useTheme()

useHead({
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs?.lang ?? 'en',
    'data-theme': () => mode.value ?? undefined,
  },
  link: () => localeHead.value.link ?? [],
  meta: () => [
    ...(localeHead.value.meta ?? []),
    { name: 'theme-color', content: resolved.value === 'light' ? '#ffffff' : '#1f2348' },
  ],
})
</script>

<template>
  <MotionConfig reduced-motion="user">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </MotionConfig>
</template>

<style>
:root {
  color-scheme: light dark;
  --app-bg: light-dark(#ffffff, var(--colors-darkblue));
  --app-fg: light-dark(#0c0f24, #f4f4f8);
  --header-bg: light-dark(#ffffff, var(--colors-darkblue));
  --header-border: light-dark(rgb(12 15 36 / 0.08), rgb(255 255 255 / 0.05));
  --surface-1: light-dark(rgb(12 15 36 / 0.04), rgb(255 255 255 / 0.04));
  --surface-2: light-dark(rgb(12 15 36 / 0.06), rgb(255 255 255 / 0.06));
  --surface-3: light-dark(rgb(12 15 36 / 0.08), rgb(255 255 255 / 0.08));
  --surface-hover: light-dark(rgb(12 15 36 / 0.10), rgb(255 255 255 / 0.10));
  --border-subtle: light-dark(rgb(12 15 36 / 0.08), rgb(255 255 255 / 0.08));
  --border-default: light-dark(rgb(12 15 36 / 0.14), rgb(255 255 255 / 0.12));
  --border-strong: light-dark(rgb(12 15 36 / 0.22), rgb(255 255 255 / 0.18));
  --text-primary: light-dark(#0c0f24, #f4f4f8);
  --text-secondary: light-dark(rgb(12 15 36 / 0.82), rgb(255 255 255 / 0.82));
  --text-tertiary: light-dark(rgb(12 15 36 / 0.68), rgb(255 255 255 / 0.70));
  --text-label: light-dark(rgb(12 15 36 / 0.74), rgb(255 255 255 / 0.78));
  --text-muted: light-dark(rgb(12 15 36 / 0.72), rgb(255 255 255 / 0.74));
  --text-faint: light-dark(rgb(12 15 36 / 0.66), rgb(255 255 255 / 0.66));
  --dropdown-bg: light-dark(#ffffff, #141732);
  --strip-bg: light-dark(rgb(244 244 248 / 1), rgb(41 44 77 / 1));
  --colors-evm-gradient: radial-gradient(100% 100% at 100% 100%, #3451D1 0%, #4D66DE 100%);
  --shadow-dropdown:
    light-dark(0 18px 48px rgb(12 15 36 / 0.12), 0 18px 48px rgb(0 0 0 / 0.5)),
    light-dark(0 0 0 1px rgb(12 15 36 / 0.06), 0 0 0 1px rgb(255 255 255 / 0.04));
}
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }
html, body, #__nuxt {
  min-height: 100%;
  background: var(--app-bg);
  color: var(--app-fg);
  -webkit-font-smoothing: antialiased;
  transition: background-color 180ms ease, color 180ms ease;
}

/* Shared-element morph for mini app logo + name (see useMiniAppViewTransition) */
::view-transition-old(miniapp-logo),
::view-transition-new(miniapp-logo) {
  animation-duration: 0.28s;
}
::view-transition-old(miniapp-badge),
::view-transition-new(miniapp-badge) {
  animation-duration: 0.28s;
}
/* keep text snapshots crisp while morphing between very different sizes */
::view-transition-old(miniapp-name),
::view-transition-new(miniapp-name),
::view-transition-old(miniapp-description),
::view-transition-new(miniapp-description),
::view-transition-old(miniapp-developer),
::view-transition-new(miniapp-developer) {
  animation-duration: 0.28s;
  height: 100%;
  object-fit: contain;
  object-position: left center;
}
</style>
