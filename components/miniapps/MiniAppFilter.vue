<script setup lang="ts">
import type { CategoryFilter, TypeFilter } from '~~/composables/useMiniAppFilter'
import { LayoutGroup, motion } from 'motion-v'
import {
  Label,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  ToggleGroupItem,
  ToggleGroupRoot,
} from 'reka-ui'
import { isMiniAppCategory, MINI_APP_CATEGORIES } from '~/utils/miniApps'
import { backgroundForFilter } from '~/utils/miniAppType'

const props = defineProps<{ search: string, type: TypeFilter, category: CategoryFilter, total: number, visible: number, isFiltering: boolean }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:type': [value: TypeFilter]
  'update:category': [value: CategoryFilter]
}>()

const { t } = useI18n()
const types = computed<{ value: TypeFilter, label: string }[]>(() => [
  { value: 'all', label: t('filter.all') },
  { value: 'nimiq', label: t('filter.nimiq') },
  { value: 'evm', label: t('filter.evm') },
])
const categories = computed<{ value: CategoryFilter, label: string }[]>(() => [
  { value: 'all', label: t('filter.allCategories') },
  ...MINI_APP_CATEGORIES.map(value => ({ value, label: t(`categories.${value}`) })),
])

const pillBackground = computed(() => backgroundForFilter(props.type))

function onTypeChange(value: unknown) {
  if (typeof value !== 'string' || !value) return
  emit('update:type', value as TypeFilter)
}

function onCategoryChange(value: unknown) {
  if (value !== 'all' && !isMiniAppCategory(value)) return
  emit('update:category', value)
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(260px,1fr)_auto_220px] gap-5 items-center">
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
          class="w-full min-h-14 pl-12 pr-4 py-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-1)] text-inherit text-[15px] font-semibold shadow-[0_10px_30px_rgba(32,35,75,0.04)] transition-colors duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--brand-yellow)] focus:border-[var(--brand-yellow)]"
          @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        >
      </label>
    </Label>
    <div class="w-full lg:w-auto">
      <LayoutGroup>
        <ToggleGroupRoot
          type="single"
          :model-value="type"
          :aria-label="t('filter.typeLabel')"
          class="flex w-full lg:inline-flex lg:w-auto p-1.5 bg-[var(--surface-2)] rounded-2xl min-h-14"
          @update:model-value="onTypeChange"
        >
          <ToggleGroupItem
            v-for="opt in types"
            :key="opt.value"
            as-child
            :value="opt.value"
          >
            <motion.button
              class="relative flex-1 lg:flex-none px-2 lg:px-8 py-3 min-h-11 rounded-xl border-none bg-transparent text-sm font-extrabold text-center cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--brand-yellow)]"
              :class="type === opt.value ? 'text-white' : 'text-tertiary'"
              :while-press="{ scale: 0.93 }"
              :transition="{ type: 'spring', stiffness: 400, damping: 22 }"
            >
              <motion.div
                v-if="type === opt.value"
                layout-id="filter-pill"
                class="absolute inset-0 rounded-xl z-0"
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
    <div class="w-full lg:w-[220px]">
      <SelectRoot :model-value="category" @update:model-value="onCategoryChange">
        <SelectTrigger
          :aria-label="t('filter.categoryLabel')"
          class="category-select-trigger flex items-center gap-2.5 w-full h-14 px-4 rounded-2xl border-none bg-[var(--surface-2)] text-tertiary text-[15px] font-extrabold cursor-pointer transition-colors duration-150 hover:bg-[var(--surface-3)] data-[state=open]:bg-[var(--surface-3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-yellow)]"
        >
          <svg viewBox="0 0 24 24" class="shrink-0 w-[18px] h-[18px] text-tertiary" aria-hidden="true">
            <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h5.38a2 2 0 0 1 1.42.59l7.11 7.11a2 2 0 0 1 0 2.83l-4.88 4.88a2 2 0 0 1-2.83 0L4.59 12.3A2 2 0 0 1 4 10.88V5.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
            <circle cx="8" cy="8" r="1.25" fill="currentColor" />
          </svg>
          <SelectValue class="min-w-0 flex-1 truncate text-left" />
          <SelectIcon as-child>
            <svg viewBox="0 0 20 20" class="category-select-chevron shrink-0 w-4 h-4 text-tertiary transition-transform duration-150" aria-hidden="true">
              <path d="m6 8 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </SelectIcon>
        </SelectTrigger>

        <SelectPortal>
          <SelectContent
            position="popper"
            align="end"
            :side-offset="8"
            :body-lock="false"
            class="z-[1000] w-[var(--reka-select-trigger-width)] max-h-[min(26rem,var(--reka-select-content-available-height))] overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--dropdown-bg)] shadow-[var(--shadow-dropdown)]"
          >
            <SelectScrollUpButton class="flex h-9 items-center justify-center bg-[var(--dropdown-bg)] text-tertiary">
              <svg viewBox="0 0 20 20" class="w-4 h-4" aria-hidden="true">
                <path d="m6 12 4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </SelectScrollUpButton>
            <SelectViewport class="p-1.5">
              <SelectItem
                v-for="option in categories"
                :key="option.value"
                :value="option.value"
                class="relative flex items-center min-h-11 py-2.5 pl-3 pr-9 rounded-xl text-sm font-bold text-secondary cursor-pointer outline-none select-none transition-colors duration-150 data-[highlighted]:bg-[var(--surface-3)] data-[highlighted]:text-[var(--text-primary)] data-[state=checked]:bg-[var(--surface-2)] data-[state=checked]:text-[var(--text-primary)]"
              >
                <SelectItemText>{{ option.label }}</SelectItemText>
                <SelectItemIndicator class="absolute right-3 grid place-items-center text-[var(--brand-yellow-deep)]">
                  <svg viewBox="0 0 20 20" class="w-4 h-4" aria-hidden="true">
                    <path d="m4.5 10 3.5 3.5 7.5-7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </SelectItemIndicator>
              </SelectItem>
            </SelectViewport>
            <SelectScrollDownButton class="flex h-9 items-center justify-center bg-[var(--dropdown-bg)] text-tertiary">
              <svg viewBox="0 0 20 20" class="w-4 h-4" aria-hidden="true">
                <path d="m6 8 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </SelectScrollDownButton>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </div>
    <div role="status" class="lg:col-span-3 m-0 text-[13px] whitespace-nowrap text-tertiary">
      <span v-if="isFiltering">{{ t('filter.count', { visible, total }) }}</span>
    </div>
  </div>
</template>

<style scoped>
.category-select-trigger[data-state='open'] .category-select-chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .category-select-chevron {
    transition: none;
  }
}
</style>
