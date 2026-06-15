<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width: number
  height: number
  /** Eager-load with high fetch priority (hero LCP image). */
  priority?: boolean
  bezelRadius?: string
  screenRadius?: string
  bezelPadding?: string
}>(), {
  priority: false,
  bezelRadius: '48px',
  screenRadius: '38px',
  bezelPadding: '10px',
})

const phoneStyle = computed<Record<string, string>>(() => ({
  '--phone-bezel-radius': props.bezelRadius,
  '--phone-screen-radius': props.screenRadius,
  '--phone-bezel-padding': props.bezelPadding,
}))
</script>

<template>
  <div class="phone-bezel border border-[var(--border-strong)]" :style="phoneStyle">
    <div class="phone-screen relative overflow-hidden">
      <img
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        class="block w-full h-auto"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined"
        :decoding="priority ? undefined : 'async'"
      >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.phone-bezel {
  background: light-dark(#0c0f24, #05060f);
  border-radius: var(--phone-bezel-radius);
  padding: var(--phone-bezel-padding);
}

.phone-screen {
  border-radius: var(--phone-screen-radius);
}
</style>
