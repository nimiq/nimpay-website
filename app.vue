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

// Site-wide OG/Twitter defaults; pages override per-key as needed.
useSeoMeta({ ogSiteName: 'Nimiq Pay', ogType: 'website', twitterCard: 'summary_large_image' })
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
  --brand-navy: #20234b;
  --brand-ink: #151620;
  --brand-yellow: #ffc72c;
  --brand-yellow-deep: #f2b600;
  --brand-blue: #147af3;
  --brand-yellow-gradient: linear-gradient(135deg, var(--brand-yellow) 0%, var(--brand-yellow-deep) 100%);
  --chip-blue-bg: light-dark(#eaf3ff, rgb(20 122 243 / 0.18));
  --chip-blue-text: light-dark(#1769e0, #8ec2ff);
  --heading-contrast: light-dark(var(--brand-navy), #f4f4f8);
  --card-hover-bg: light-dark(#ffffff, rgb(255 255 255 / 0.08));
  /* Neo-brutal offset edge for the detail CTA card: navy reads on the light bg,
     but blends into the dark navy bg — give dark a lifted periwinkle partner. */
  --cta-edge: light-dark(var(--brand-navy), #454bb0);
  --app-bg: light-dark(#f6f7f9, #11142d);
  --app-fg: light-dark(var(--brand-ink), #f4f4f8);
  --header-bg: light-dark(rgb(255 255 255 / 0.88), rgb(17 20 45 / 0.88));
  --header-border: light-dark(rgb(32 35 75 / 0.08), rgb(255 255 255 / 0.06));
  --surface-1: light-dark(#ffffff, rgb(255 255 255 / 0.05));
  --surface-2: light-dark(#f0f2f5, rgb(255 255 255 / 0.08));
  --surface-3: light-dark(#e9edf3, rgb(255 255 255 / 0.12));
  --surface-hover: light-dark(#eaedf2, rgb(255 255 255 / 0.12));
  --border-subtle: light-dark(rgb(32 35 75 / 0.08), rgb(255 255 255 / 0.08));
  --border-default: light-dark(rgb(32 35 75 / 0.13), rgb(255 255 255 / 0.14));
  --border-strong: light-dark(rgb(32 35 75 / 0.22), rgb(255 255 255 / 0.22));
  --text-primary: light-dark(var(--brand-ink), #f4f4f8);
  --text-secondary: light-dark(rgb(32 37 54 / 0.72), rgb(255 255 255 / 0.82));
  --text-tertiary: light-dark(rgb(32 37 54 / 0.58), rgb(255 255 255 / 0.70));
  --text-label: light-dark(rgb(32 37 54 / 0.50), rgb(255 255 255 / 0.72));
  --text-muted: light-dark(rgb(32 37 54 / 0.64), rgb(255 255 255 / 0.74));
  --text-faint: light-dark(rgb(32 37 54 / 0.48), rgb(255 255 255 / 0.60));
  --dropdown-bg: light-dark(#ffffff, #171a37);
  --strip-bg: light-dark(#eaf3ff, rgb(41 44 77 / 1));
  --card-shadow: light-dark(0 22px 70px rgb(32 35 75 / 0.08), 0 22px 70px rgb(0 0 0 / 0.34));
  --button-shadow: 0 14px 34px rgb(32 35 75 / 0.12);
  --colors-evm-gradient: radial-gradient(100% 100% at 100% 100%, #3451D1 0%, #4D66DE 100%);
  --shadow-dropdown:
    light-dark(0 18px 48px rgb(32 35 75 / 0.14), 0 18px 48px rgb(0 0 0 / 0.5)),
    light-dark(0 0 0 1px rgb(32 35 75 / 0.06), 0 0 0 1px rgb(255 255 255 / 0.04));
}
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }
html, body, #__nuxt {
  min-height: 100%;
  background: var(--app-bg);
  color: var(--app-fg);
  -webkit-font-smoothing: antialiased;
  transition: background-color 180ms ease, color 180ms ease;
  font-feature-settings: "ss01" on, "cv01" on;
}
/* Full-bleed landing strips are 100vw wide; clip the scrollbar-width overhang. */
html, body {
  overflow-x: clip;
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
