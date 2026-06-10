<script setup lang="ts">
import type { TypeFilter } from '~~/composables/useMiniAppFilter'
import { LayoutGroup, motion } from 'motion-v'
import { Label, ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import { backgroundForFilter } from '~/utils/miniAppType'

const props = defineProps<{ search: string, type: TypeFilter, total: number, visible: number }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:type': [value: TypeFilter]
}>()

const { t } = useI18n()
const types: { value: TypeFilter, label: string }[] = [
  { value: 'all', label: t('filter.all') },
  { value: 'nimiq', label: t('filter.nimiq') },
  { value: 'evm', label: t('filter.evm') },
]

const pillBackground = computed(() => backgroundForFilter(props.type))

function onTypeChange(value: unknown) {
  if (typeof value !== 'string' || !value) return
  emit('update:type', value as TypeFilter)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-[minmax(220px,1fr)_auto_auto] gap-4 items-center">
    <Label as-child>
      <label class="relative flex items-center">
        <span class="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0,0,0,0)]">{{ t('filter.searchLabel') }}</span>
        <svg viewBox="0 0 24 24" class="absolute left-3.5 w-[18px] h-[18px] text-tertiary pointer-events-none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="m21 21-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input
          :value="search"
          type="search"
          :placeholder="t('filter.searchPlaceholder')"
          class="w-full min-h-11 pl-10.5 pr-3.5 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-1)] text-inherit text-[15px] transition-colors duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--colors-orange-1100)] focus:border-[var(--colors-orange-1100)]"
          @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        >
      </label>
    </Label>
    <div class="overflow-x-auto scrollbar-none -mx-1 px-1 sm:overflow-visible">
      <LayoutGroup>
        <ToggleGroupRoot
          type="single"
          :model-value="type"
          :aria-label="t('filter.typeLabel')"
          class="inline-flex p-1 bg-[var(--surface-1)] rounded-full"
          @update:model-value="onTypeChange"
        >
          <ToggleGroupItem
            v-for="opt in types"
            :key="opt.value"
            as-child
            :value="opt.value"
          >
            <motion.button
              class="relative px-5 py-3 min-h-11 rounded-full border-none bg-transparent text-sm font-bold cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--colors-orange-1100)]"
              :class="{ 'text-white': type === opt.value }"
              :while-press="{ scale: 0.93 }"
              :transition="{ type: 'spring', stiffness: 400, damping: 22 }"
            >
              <motion.div
                v-if="type === opt.value"
                layout-id="filter-pill"
                class="absolute inset-0 rounded-full z-0"
                :style="{ background: pillBackground }"
                :transition="{ type: 'spring', stiffness: 360, damping: 30 }"
                aria-hidden="true"
              />
              <span class="relative z-1">{{ opt.label }}</span>
            </motion.button>
          </ToggleGroupItem>
        </ToggleGroupRoot>
      </LayoutGroup>
    </div>
    <p role="status" class="m-0 text-[13px] whitespace-nowrap text-tertiary">
      {{ t('filter.count', { visible, total }) }}
    </p>
  </div>
</template>
