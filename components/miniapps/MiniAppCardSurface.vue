<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { MiniAppCategory, MiniAppType } from '~/utils/miniApps'

defineProps<{
  logo: string
  url: string
  name: string
  type: MiniAppType | null
  category: MiniAppCategory | null
  description: string
  developer?: string | null
  logoStyle?: StyleValue
  typeBadgeStyle?: StyleValue
  nameStyle?: StyleValue
  developerStyle?: StyleValue
  descriptionStyle?: StyleValue
}>()
</script>

<template>
  <div class="flex flex-col gap-5 h-full min-h-[210px] p-6 rounded-[28px] bg-[var(--surface-1)] border border-[var(--border-subtle)] text-inherit shadow-[var(--card-shadow)] transition-[border-color,background,box-shadow] duration-200 group-hover:border-[var(--border-strong)] group-hover:bg-[var(--card-hover-bg)] group-hover:shadow-[0_28px_70px_rgba(32,35,75,0.12)]">
    <div class="flex items-start justify-between gap-3">
      <MiniAppLogo :logo="logo" :url="url" :name="name" size="sm" :style="logoStyle" />
      <div v-if="category || type" class="flex flex-wrap items-center justify-end gap-2">
        <MiniAppCategoryBadge v-if="category" :category="category" class="self-center" />
        <MiniAppTypeBadge v-if="type" :type="type" class="!self-center" :style="typeBadgeStyle" />
      </div>
    </div>
    <div class="flex flex-col gap-2 flex-1">
      <h3 class="m-0 text-xl font-black leading-tight line-clamp-2 break-words text-[var(--text-primary)]" :style="nameStyle">
        {{ name }}
      </h3>
      <p v-if="developer" class="m-0 text-xs font-extrabold uppercase tracking-[0.08em] text-tertiary truncate" :style="developerStyle">
        {{ developer }}
      </p>
      <p class="mt-auto mb-0 text-sm leading-[1.45] text-secondary line-clamp-3" :style="descriptionStyle">
        {{ description }}
      </p>
    </div>
  </div>
</template>
