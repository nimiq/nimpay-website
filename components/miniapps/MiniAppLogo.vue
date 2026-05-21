<script setup lang="ts">
import { getFaviconUrl } from '~~/utils/deeplink'

type LogoStage = 'logo' | 'favicon' | 'placeholder'
type LogoSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{ logo: string, url: string, name: string, size?: LogoSize }>(), {
  size: 'md',
})

const SIZE_CLASSES: Record<LogoSize, string> = {
  sm: 'w-14 h-14 rounded-[14px]',
  md: 'w-16 h-16 rounded-[14px]',
  lg: 'w-28 h-28 rounded-3xl',
}

const initialStage = (): LogoStage => props.logo ? 'logo' : 'favicon'
const stage = ref<LogoStage>(initialStage())

watch([() => props.logo, () => props.url], () => {
  stage.value = initialStage()
})

const src = computed(() => {
  if (stage.value === 'logo') return props.logo
  if (stage.value === 'favicon') return getFaviconUrl(props.url)
  return ''
})

function onError() {
  if (stage.value === 'logo') stage.value = 'favicon'
  else if (stage.value === 'favicon') stage.value = 'placeholder'
}
</script>

<template>
  <div class="grid place-items-center bg-[var(--surface-2)] overflow-hidden flex-shrink-0" :class="SIZE_CLASSES[size]">
    <img v-if="src" :src="src" :alt="`${name} logo`" class="w-full h-full object-contain" loading="lazy" @error="onError">
    <div v-else class="font-bold text-[var(--text-muted)]" :class="size === 'lg' ? 'text-[44px]' : 'text-[28px]'" aria-hidden="true">
      {{ name.slice(0, 1) }}
    </div>
  </div>
</template>
