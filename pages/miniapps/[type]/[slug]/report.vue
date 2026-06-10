<script setup lang="ts">
import type { ReportPayload } from '~~/shared/report'
import { findMiniApp, isMiniAppType } from '~~/server/utils/miniapps'
import { REPORT_CATEGORIES, REPORT_CONFIRMATION, REPORT_SEVERITIES } from '~~/shared/report'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const { data: apps } = await useMiniApps()

const typeParam = String(route.params.type ?? '')
const slugParam = String(route.params.slug ?? '')

if (!isMiniAppType(typeParam)) {
  throw createError({ statusCode: 404, statusMessage: 'Unknown mini app type', fatal: true })
}

const app = computed(() => findMiniApp(apps.value, typeParam, slugParam))

if (!app.value) {
  throw createError({ statusCode: 404, statusMessage: 'Mini app not found', fatal: true })
}

const detailPath = computed(() => localePath(`/miniapps/${typeParam}/${slugParam}`))

useSeoMeta({
  title: () => `${t('report.title')} · ${app.value!.name}`,
  robots: 'noindex',
})

const form = reactive({
  target: app.value.url,
  category: '',
  summary: '',
  evidence: '',
  severity: '',
  contact: '',
  confirmation: false,
  company: '', // honeypot
})

const turnstileToken = ref('')
const status = ref<'idle' | 'submitting' | 'error' | 'success'>('idle')
const errorMessage = ref('')
const issueUrl = ref('')

const canSubmit = computed(() =>
  form.target.trim()
  && form.category
  && form.summary.trim()
  && form.severity
  && form.confirmation
  && turnstileToken.value
  && status.value !== 'submitting',
)

async function onSubmit() {
  if (!canSubmit.value) return
  status.value = 'submitting'
  errorMessage.value = ''

  const payload: ReportPayload = {
    appName: app.value!.name,
    appType: typeParam,
    appSlug: slugParam,
    target: form.target.trim(),
    category: form.category as ReportPayload['category'],
    summary: form.summary.trim(),
    evidence: form.evidence.trim() || undefined,
    severity: form.severity as ReportPayload['severity'],
    contact: form.contact.trim() || undefined,
    confirmation: true,
    turnstileToken: turnstileToken.value,
    company: form.company,
  }

  try {
    const res = await $fetch<{ url: string }>('/api/report', { method: 'POST', body: payload })
    issueUrl.value = res.url
    status.value = 'success'
  }
  catch {
    status.value = 'error'
    errorMessage.value = t('report.error')
  }
}

const field = 'w-full min-h-11 px-3.5 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-1)] text-inherit text-[15px] transition-colors duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--colors-orange-1100)] focus:border-[var(--colors-orange-1100)]'
const labelClass = 'text-[13px] font-semibold text-[var(--text-primary)]'
</script>

<template>
  <div v-if="app" class="w-full max-w-[600px] mx-auto px-5 py-10 md:py-16 flex flex-col gap-8">
    <NuxtLink :to="detailPath" class="text-sm text-tertiary no-underline self-start hover:text-[var(--text-primary)] focus-ring rounded">
      ← {{ app.name }}
    </NuxtLink>

    <header class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <MiniAppLogo :logo="app.logo" :url="app.url" :name="app.name" size="sm" />
        <div class="flex flex-col gap-1 min-w-0">
          <span class="text-[15px] font-semibold truncate">{{ app.name }}</span>
          <MiniAppTypeBadge :type="app.type" variant="dot" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="m-0 text-3xl font-bold tracking-[-0.02em] text-wrap-balance">
          {{ t('report.title') }}
        </h1>
        <p class="m-0 text-[15px] leading-[1.6] text-secondary">
          {{ t('report.description') }}
        </p>
      </div>
    </header>

    <Transition name="swap" mode="out-in">
      <!-- Success -->
      <section v-if="status === 'success'" key="success" class="flex flex-col items-center text-center gap-4 py-8 px-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)]">
        <span class="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--colors-green-400,rgba(33,188,114,0.16))] text-[var(--colors-green,#21bc72)]">
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <div class="flex flex-col gap-1.5">
          <h2 class="m-0 text-xl font-bold">
            {{ t('report.successTitle') }}
          </h2>
          <p class="m-0 text-[15px] leading-[1.6] text-secondary max-w-[46ch]">
            {{ t('report.successBody') }}
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 mt-2">
          <a :href="issueUrl" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold text-sm no-underline transition-colors duration-150 hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)] focus-ring">
            {{ t('report.viewReport') }} →
          </a>
          <NuxtLink :to="detailPath" class="inline-flex items-center justify-center px-5 py-3 rounded-xl text-tertiary font-medium text-sm no-underline hover:text-[var(--text-primary)] focus-ring">
            {{ t('report.backToApp') }}
          </NuxtLink>
        </div>
      </section>

      <!-- Form -->
      <form v-else key="form" class="flex flex-col gap-6" novalidate @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2">
          <label for="report-target" :class="labelClass">{{ t('report.fields.target') }}</label>
          <input id="report-target" v-model="form.target" type="url" inputmode="url" :class="field" required>
        </div>

        <div class="flex flex-col gap-2">
          <label for="report-category" :class="labelClass">{{ t('report.fields.category') }}</label>
          <select id="report-category" v-model="form.category" :class="field" required>
            <option value="" disabled>
              {{ t('report.choose') }}
            </option>
            <option v-for="c in REPORT_CATEGORIES" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-2">
          <label for="report-summary" :class="labelClass">{{ t('report.fields.summary') }}</label>
          <textarea id="report-summary" v-model="form.summary" rows="4" :placeholder="t('report.summaryPlaceholder')" :class="`${field} resize-y`" required />
        </div>

        <div class="flex flex-col gap-2">
          <label for="report-evidence" :class="labelClass">
            {{ t('report.fields.evidence') }}
            <span class="font-normal text-tertiary">{{ t('report.optional') }}</span>
          </label>
          <textarea id="report-evidence" v-model="form.evidence" rows="2" :class="`${field} resize-y`" />
        </div>

        <div class="flex flex-col gap-2">
          <label for="report-severity" :class="labelClass">{{ t('report.fields.severity') }}</label>
          <select id="report-severity" v-model="form.severity" :class="field" required>
            <option value="" disabled>
              {{ t('report.choose') }}
            </option>
            <option v-for="s in REPORT_SEVERITIES" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-2">
          <label for="report-contact" :class="labelClass">
            {{ t('report.fields.contact') }}
            <span class="font-normal text-tertiary">{{ t('report.optional') }}</span>
          </label>
          <input id="report-contact" v-model="form.contact" type="email" autocomplete="email" :placeholder="t('report.contactPlaceholder')" :class="field">
        </div>

        <!-- Honeypot: hidden from users, catches bots -->
        <div class="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
          <label for="report-company">Company</label>
          <input id="report-company" v-model="form.company" type="text" tabindex="-1" autocomplete="off">
        </div>

        <label class="flex items-start gap-3 cursor-pointer">
          <input v-model="form.confirmation" type="checkbox" class="mt-0.5 w-4 h-4 shrink-0 accent-[var(--colors-orange-1100)] focus-ring rounded" required>
          <span class="text-[13px] leading-[1.5] text-secondary">{{ REPORT_CONFIRMATION }}</span>
        </label>

        <NuxtTurnstile v-model="turnstileToken" />

        <p v-if="status === 'error'" role="alert" class="m-0 text-sm text-[var(--colors-red,#d94432)]">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="!canSubmit"
          class="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-2xl font-semibold text-base text-white bg-[var(--colors-orange-1100)] no-underline transition-[filter,opacity] duration-150 hover:brightness-[1.05] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100 focus-ring"
        >
          <svg v-if="status === 'submitting'" viewBox="0 0 24 24" class="w-5 h-5 animate-spin" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-opacity="0.3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
          </svg>
          {{ status === 'submitting' ? t('report.submitting') : t('report.submit') }}
        </button>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .swap-enter-active,
  .swap-leave-active {
    transition: opacity 0.15s ease;
  }
  .swap-enter-from,
  .swap-leave-to {
    transform: none;
  }
}
</style>
