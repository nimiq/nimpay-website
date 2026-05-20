<script setup lang="ts">
// `/` is redirected at the edge by public/_redirects on Cloudflare Pages.
// This page is the SSG fallback when the edge redirect isn't in effect (dev, local preview).
definePageMeta({ layout: false })

const TARGET = 'https://www.nimiq.com/nimiq-pay/'

if (import.meta.server) {
  await navigateTo(TARGET, { external: true, redirectCode: 301 })
}
else {
  window.location.replace(TARGET)
}
</script>

<template>
  <noscript>
    <meta http-equiv="refresh" :content="`0; url=${'https://www.nimiq.com/nimiq-pay/'}`">
    <p>
    Redirecting to <a href="https://www.nimiq.com/nimiq-pay/">nimiq.com/nimiq-pay</a>…
    </p>
  </noscript>
</template>
