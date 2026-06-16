<script setup lang="ts">
import type { MiniAppType, SubmitPayload } from '~~/shared/submit'
import { MAX_DESCRIPTION_LENGTH, MAX_LOGO_BYTES, requiresDeveloper, SUBMIT_CONFIRMATION } from '~~/shared/submit'

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('submit.title'),
  description: () => t('submit.body'),
  ogTitle: () => t('submit.title'),
  ogDescription: () => clampDescription(t('submit.body')),
  // Runtime form (prerender:false) — use the static brand image, not a
  // build-time generated card.
  ogImage: '/og-default.png',
})

const form = reactive({
  name: '',
  url: '',
  type: '' as '' | MiniAppType,
  description: '',
  source: '',
  developer: '',
  confirmation: false,
  company: '', // honeypot
})

const logo = ref<{ svg: string, name: string, preview: string } | null>(null)
const logoError = ref('')

const turnstileToken = ref('')
const status = ref<'idle' | 'submitting' | 'error' | 'success'>('idle')
const errorMessage = ref('')
const prUrl = ref('')

const descriptionLength = computed(() => form.description.trim().length)
const descriptionOver = computed(() => descriptionLength.value > MAX_DESCRIPTION_LENGTH)
const needsDeveloper = computed(() => requiresDeveloper({ logoSvg: logo.value?.svg, developer: form.developer }))

const previewType = computed(() => form.type || null)

const canSubmit = computed(() =>
  form.name.trim()
  && form.url.trim().startsWith('https://')
  && form.type
  && form.description.trim()
  && !descriptionOver.value
  && form.developer.trim()
  && form.confirmation
  && turnstileToken.value
  && !needsDeveloper.value
  && status.value !== 'submitting',
)

function onLogoChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  logoError.value = ''
  if (!file) return
  if (file.type !== 'image/svg+xml' && !file.name.toLowerCase().endsWith('.svg')) {
    logoError.value = t('submit.upload.invalid')
    input.value = ''
    return
  }
  if (file.size > MAX_LOGO_BYTES) {
    logoError.value = t('submit.upload.tooLarge')
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    if (logo.value) URL.revokeObjectURL(logo.value.preview)
    logo.value = { svg: String(reader.result ?? ''), name: file.name, preview: URL.createObjectURL(file) }
  }
  reader.readAsText(file)
}

function removeLogo() {
  logoError.value = ''
  if (logo.value) {
    URL.revokeObjectURL(logo.value.preview)
    logo.value = null
  }
}

onBeforeUnmount(() => {
  if (logo.value) URL.revokeObjectURL(logo.value.preview)
})

async function onSubmit() {
  if (!canSubmit.value) return
  status.value = 'submitting'
  errorMessage.value = ''

  const payload: SubmitPayload = {
    name: form.name.trim(),
    url: form.url.trim(),
    type: form.type as MiniAppType,
    description: form.description.trim(),
    source: form.source.trim() || undefined,
    developer: form.developer.trim(),
    logoSvg: logo.value?.svg || undefined,
    confirmation: true,
    turnstileToken: turnstileToken.value,
    company: form.company,
  }

  try {
    const res = await $fetch<{ url: string }>('/api/submit-app', { method: 'POST', body: payload })
    prUrl.value = res.url
    status.value = 'success'
  }
  catch (err) {
    status.value = 'error'
    errorMessage.value = (err as { statusMessage?: string })?.statusMessage || t('submit.error')
  }
}

const field = 'w-full min-h-12 px-4 py-3.5 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-2)] text-inherit text-[15px] font-semibold transition-colors duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--brand-yellow)] focus:border-[var(--brand-yellow)]'
const labelClass = 'text-[13px] font-extrabold text-[var(--text-primary)]'
</script>

<template>
  <article class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-12 lg:gap-16 items-start">
    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-5">
        <NuxtLink :to="localePath('/miniapps')" class="self-start text-sm font-bold text-tertiary no-underline hover:text-[var(--text-primary)] focus-ring rounded">
          ← {{ t('submit.backToApps') }}
        </NuxtLink>
        <h1 class="m-0 text-[42px] sm:text-[54px] font-black leading-[0.98] tracking-[-0.025em] text-[var(--heading-contrast)]">
          {{ t('submit.title') }}
        </h1>
        <p class="m-0 text-lg text-secondary leading-[1.5] max-w-[720px]">
          {{ t('submit.body') }}
        </p>
      </div>

      <Transition name="swap" mode="out-in">
        <!-- Success -->
        <section v-if="status === 'success'" key="success" class="flex flex-col items-center text-center gap-4 py-10 px-8 rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-1)] shadow-[var(--card-shadow)]">
          <span class="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--colors-green-400,rgba(33,188,114,0.16))] text-[var(--colors-green,#21bc72)]">
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
          <div class="flex flex-col gap-1.5">
            <h2 class="m-0 text-xl font-bold">
              {{ t('submit.successTitle') }}
            </h2>
            <p class="m-0 text-[15px] leading-[1.6] text-secondary max-w-[46ch]">
              {{ t('submit.successBody') }}
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 mt-2">
            <a :href="prUrl" target="_blank" rel="noopener" class="group inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold text-sm no-underline transition-colors duration-150 hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)] focus-ring">
              {{ t('submit.viewPr') }}
              <ArrowIcon direction="top-right" class="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <NuxtLink :to="localePath('/miniapps')" class="inline-flex items-center justify-center px-5 py-3 rounded-xl text-tertiary font-medium text-sm no-underline hover:text-[var(--text-primary)] focus-ring">
              {{ t('submit.backToApps') }}
            </NuxtLink>
          </div>
          <p role="note" class="m-0 mt-2 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-2 text-[13px] leading-[1.5] text-tertiary max-w-[46ch]">
            <svg viewBox="0 0 24 24" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>{{ t('submit.watchPrBody') }}</span>
          </p>
        </section>

        <!-- Form -->
        <form v-else key="form" class="flex flex-col gap-6 rounded-[32px] bg-[var(--surface-1)] border border-[var(--border-subtle)] p-6 sm:p-10 shadow-[var(--card-shadow)]" novalidate @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="sm:col-span-2 flex flex-col gap-2">
              <label for="submit-name" :class="labelClass">{{ t('submit.fields.name') }}</label>
              <input id="submit-name" v-model="form.name" type="text" :placeholder="t('submit.placeholders.name')" :class="field" required>
            </div>

            <div class="flex flex-col gap-2">
              <label for="submit-type" :class="labelClass">{{ t('submit.fields.type') }}</label>
              <select id="submit-type" v-model="form.type" :class="field" required>
                <option value="" disabled>
                  {{ t('submit.choose') }}
                </option>
                <option value="nimiq">
                  {{ t('submit.types.nimiq') }}
                </option>
                <option value="evm">
                  {{ t('submit.types.evm') }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label for="submit-url" :class="labelClass">{{ t('submit.fields.url') }}</label>
              <input id="submit-url" v-model="form.url" type="url" inputmode="url" :placeholder="t('submit.placeholders.url')" :class="field" required>
            </div>

            <div class="sm:col-span-2 flex flex-col gap-2">
              <label for="submit-description" class="flex items-center justify-between" :class="labelClass">
                <span>{{ t('submit.fields.description') }}</span>
                <span class="text-[12px] font-bold tabular-nums" :class="descriptionOver ? 'text-[var(--colors-red,#d94432)]' : 'text-tertiary'">
                  {{ t('submit.descriptionHint', { count: descriptionLength }) }}
                </span>
              </label>
              <textarea id="submit-description" v-model="form.description" rows="3" :placeholder="t('submit.placeholders.description')" :class="`${field} resize-y`" required />
            </div>

            <div class="flex flex-col gap-2">
              <label for="submit-source" :class="labelClass">
                {{ t('submit.fields.source') }}
                <span class="font-normal text-tertiary">{{ t('submit.optional') }}</span>
              </label>
              <input id="submit-source" v-model="form.source" type="url" inputmode="url" :placeholder="t('submit.placeholders.source')" :class="field">
            </div>

            <div class="flex flex-col gap-2">
              <label for="submit-developer" :class="labelClass">{{ t('submit.fields.developer') }}</label>
              <input id="submit-developer" v-model="form.developer" type="text" autocomplete="off" :placeholder="t('submit.placeholders.developer')" :class="field" required>
            </div>
          </div>

          <div class="border-t border-[var(--border-subtle)]" />

          <div class="flex flex-col gap-4">
            <h2 class="m-0 text-lg font-black text-[var(--heading-contrast)]">
              {{ t('submit.visuals') }}
              <span class="text-[13px] font-normal text-tertiary">{{ t('submit.optional') }}</span>
            </h2>

            <div v-if="logo" class="flex items-center gap-4 rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-2)] p-4">
              <div class="w-14 h-14 rounded-2xl bg-[var(--surface-1)] grid place-items-center overflow-hidden flex-shrink-0">
                <img :src="logo.preview" alt="" class="w-full h-full object-contain">
              </div>
              <span class="text-sm font-semibold truncate flex-1 min-w-0">{{ logo.name }}</span>
              <button type="button" class="text-sm font-bold text-tertiary hover:text-[var(--text-primary)] bg-transparent border-none cursor-pointer focus-ring rounded px-1" @click="removeLogo">
                {{ t('submit.upload.remove') }}
              </button>
            </div>

            <label v-else class="rounded-[24px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)] min-h-[150px] grid place-items-center text-center p-6 cursor-pointer hover:border-[var(--brand-yellow)] transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--brand-yellow)]">
              <div class="flex flex-col items-center gap-3">
                <span class="w-12 h-12 rounded-2xl bg-[light-dark(#fff7d3,rgb(255,199,44,0.14))] text-[var(--brand-yellow-deep)] grid place-items-center" aria-hidden="true">
                  <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                <strong>{{ t('submit.upload.title') }}</strong>
                <span class="text-sm text-tertiary">{{ t('submit.upload.body') }}</span>
              </div>
              <input type="file" accept="image/svg+xml,.svg" class="sr-only" @change="onLogoChange">
            </label>

            <p v-if="logoError" role="alert" class="m-0 text-sm text-[var(--colors-red,#d94432)]">
              {{ logoError }}
            </p>
            <p v-else-if="needsDeveloper" class="m-0 text-sm text-[var(--colors-orange,#fa7268)]">
              {{ t('submit.upload.developerRequired') }}
            </p>
          </div>

          <!-- Honeypot: hidden from users, catches bots -->
          <div class="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
            <label for="submit-company">Company</label>
            <input id="submit-company" v-model="form.company" type="text" tabindex="-1" autocomplete="off">
          </div>

          <!-- Mobile-only live preview: sits before the confirm/captcha/submit block (desktop keeps it in the sticky aside). -->
          <div class="lg:hidden">
            <MiniAppSubmitPreview
              :logo="logo?.preview ?? ''"
              :url="form.url"
              :name="form.name"
              :type="previewType"
              :description="form.description"
            />
          </div>

          <label class="flex items-start gap-3 cursor-pointer">
            <input v-model="form.confirmation" type="checkbox" class="mt-0.5 w-4 h-4 shrink-0 accent-[var(--brand-yellow)] focus-ring rounded" required>
            <span class="text-[13px] leading-[1.5] text-secondary">{{ SUBMIT_CONFIRMATION }}</span>
          </label>

          <NuxtTurnstile v-model="turnstileToken" />

          <p v-if="status === 'error'" role="alert" class="m-0 text-sm text-[var(--colors-red,#d94432)]">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="!canSubmit"
            class="group inline-flex items-center justify-center gap-2 w-full px-5 py-4 rounded-2xl font-black text-base text-white bg-[var(--brand-navy)] no-underline transition-[filter,opacity] duration-150 hover:brightness-[1.05] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100 focus-ring"
          >
            <svg v-if="status === 'submitting'" viewBox="0 0 24 24" class="w-5 h-5 animate-spin" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-opacity="0.3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            </svg>
            {{ status === 'submitting' ? t('submit.submitting') : t('submit.submit') }}
            <ArrowIcon v-if="status !== 'submitting'" class="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </button>
        </form>
      </Transition>
    </section>

    <aside class="lg:sticky lg:top-28 flex flex-col gap-8">
      <!-- Desktop preview lives in the sticky aside; on mobile it renders inside the form instead. -->
      <div class="hidden lg:block">
        <MiniAppSubmitPreview
          :logo="logo?.preview ?? ''"
          :url="form.url"
          :name="form.name"
          :type="previewType"
          :description="form.description"
        />
      </div>

      <div class="rounded-[24px] bg-[var(--brand-navy)] text-white p-6 shadow-[var(--card-shadow)]">
        <h3 class="m-0 text-lg font-black text-white">
          {{ t('submit.tipTitle') }}
        </h3>
        <p class="mt-3 mb-0 text-sm leading-[1.55] text-white/86">
          {{ t('submit.tipBody') }}
        </p>
        <p class="mt-5 pt-5 mb-0 border-t border-white/15 flex items-start gap-2 text-sm leading-[1.55] text-white/86">
          <svg viewBox="0 0 24 24" class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>{{ t('submit.watchPrBody') }}</span>
        </p>
      </div>
    </aside>
  </article>
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
