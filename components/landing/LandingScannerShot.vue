<script setup lang="ts">
import scannerActive480 from '~/assets/screenshots/scanner-active-480.webp'

defineProps<{ alt: string }>()
</script>

<template>
  <LandingPhoneShot
    :src="scannerActive480"
    :alt="alt"
    :width="480"
    :height="1043"
  />
</template>
