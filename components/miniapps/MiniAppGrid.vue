<script setup lang="ts">
import type { MiniApp } from '~~/server/utils/miniapps'

defineProps<{ apps: MiniApp[] }>()
const { t } = useI18n()
</script>

<template>
  <div>
    <TransitionGroup
      v-if="apps.length"
      tag="ul"
      name="grid"
      class="relative list-none p-0 m-0 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5"
    >
      <li
        v-for="app in apps"
        :key="`${app.type}/${app.slug}`"
        class="h-full"
      >
        <MiniAppCard :app="app" />
      </li>
    </TransitionGroup>
    <p v-else class="text-center py-12 text-tertiary">
      {{ t('home.empty') }}
    </p>
  </div>
</template>

<style scoped>
.grid-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transition-delay: 0.18s;
}

.grid-leave-active {
  position: absolute;
  transition: opacity 0.12s ease, transform 0.1s ease;
}

.grid-move {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: 0.15s;
}

.grid-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.grid-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
