<script setup lang="ts">
import { getFaviconUrl } from '~~/utils/deeplink'

const props = withDefaults(defineProps<{ logo: string, url: string, name: string, size?: 'sm' | 'md' | 'lg' }>(), {
  size: 'md',
})

// 0 = upstream logo, 1 = favicon fallback, 2 = letter placeholder
const stage = ref(props.logo ? 0 : 1)

watch(() => [props.logo, props.url], () => {
  stage.value = props.logo ? 0 : 1
})

const src = computed(() => {
  if (stage.value === 0) return props.logo
  if (stage.value === 1) return getFaviconUrl(props.url)
  return ''
})

function onError() {
  if (stage.value < 2) stage.value++
}

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-14 h-14 rounded-[14px]'
    case 'lg': return 'w-28 h-28 rounded-3xl'
    default: return 'w-16 h-16 rounded-[14px]'
  }
})
const placeholderTextClass = computed(() => props.size === 'lg' ? 'text-[44px]' : 'text-[28px]')
</script>

<template>
  <div class="grid place-items-center bg-[var(--surface-2)] overflow-hidden flex-shrink-0" :class="sizeClasses">
    <img v-if="src" :src="src" :alt="`${name} logo`" class="w-full h-full object-contain" loading="lazy" @error="onError">
    <div v-else class="font-bold text-[var(--text-muted)]" :class="placeholderTextClass" aria-hidden="true">
      {{ name.slice(0, 1) }}
    </div>
  </div>
</template>
