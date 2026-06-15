<script setup lang="ts">
import type { MiniAppType } from '~~/server/utils/miniapps'
import { backgroundForType, labelForType } from '~/utils/miniAppType'

const props = withDefaults(defineProps<{
  type: MiniAppType
  variant?: 'pill' | 'dot'
}>(), {
  variant: 'pill',
})

const background = computed(() => backgroundForType(props.type))
const label = computed(() => labelForType(props.type))
</script>

<template>
  <span
    v-if="variant === 'pill'"
    class="inline-flex items-center self-start gap-1.5 py-1.5 pl-2.5 pr-3 rounded-full text-[10px] font-extrabold tracking-[0.1em] uppercase text-white"
    :style="{ background }"
  >
    <svg v-if="type === 'nimiq'" class="flex-shrink-0 inline-block fill-current" width="11" height="10" viewBox="0 0 63 56" fill="currentColor" aria-hidden="true">
      <path d="M62.1102 25.375 49.0238 2.625C48.0816.9975 46.3542 0 44.4872 0H18.3144c-1.867 0-3.5944.9975-4.5279 2.625L.700122 25.375c-.933496 1.6275-.933496 3.6225 0 5.25L13.7865 53.375C14.72 55.0025 16.4474 56 18.3144 56h26.1728c1.867 0 3.5944-.9975 4.5279-2.625l13.0864-22.75c.9422-1.6275.9422-3.6225.0087-5.25Z" />
    </svg>
    <svg v-else class="flex-shrink-0 inline-block fill-current" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.5 4.5 12.75 12 17l7.5-4.25L12 1.5Zm0 17.25-7.5-4.25L12 22.5l7.5-8L12 18.75Z" />
    </svg>
    {{ type.toUpperCase() }}
  </span>
  <span
    v-else
    class="inline-flex items-center self-start gap-1.5 text-[10px] font-bold tracking-[0.06em] uppercase text-tertiary"
  >
    <span
      class="w-1.5 h-1.5 rounded-full flex-shrink-0"
      :style="{ background }"
      aria-hidden="true"
    />
    {{ label }}
  </span>
</template>
