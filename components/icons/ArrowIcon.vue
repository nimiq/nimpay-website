<script setup lang="ts">
withDefaults(defineProps<{ direction?: 'right' | 'top-right' }>(), {
  direction: 'right',
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    class="inline-block w-3 h-3 shrink-0"
  >
    <path
      v-if="direction === 'top-right'"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M3.657 1.887h6.363V8.25M8.91 3.279l-7.497 7.5"
    />
    <path
      v-else
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M1.5 6h8.5M6.75 2.75 10 6 6.75 9.25"
    />
  </svg>
</template>
