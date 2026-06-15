<script setup lang="ts">
import { motion, useReducedMotion, useScroll } from 'motion-v'
import homeNim480 from '~/assets/screenshots/home-nim-480.webp'
import homeUsdt480 from '~/assets/screenshots/home-usdt-480.webp'
import miniAppsFlow480 from '~/assets/screenshots/mini-apps-flow-480.webp'

const STEPS = ['step1', 'step2', 'step3', 'step4'] as const

const { t } = useI18n()
const reduced = useReducedMotion()
const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const activeStepIndex = shallowRef(0)
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ['start start', 'end end'],
})

const phoneShots = computed(() => [
  { key: 'step1', src: homeNim480, alt: t('landing.how.step1.title') },
  { key: 'step2', src: homeUsdt480, alt: t('landing.how.step2.title') },
  { key: 'scan', src: '', alt: t('landing.how.step3.title') },
  { key: 'step4', src: miniAppsFlow480, alt: t('landing.how.step4.title') },
])

function updateActiveStep(progress: number) {
  activeStepIndex.value = Math.min(STEPS.length - 1, Math.max(0, Math.floor(progress * STEPS.length)))
}

// Jump to a step on click/keyboard: set index for instant border move, then scroll
// the page so the scroll watcher lands in that step's band (keeps them in sync).
function goToStep(i: number) {
  activeStepIndex.value = i
  const el = sectionRef.value
  if (!el)
    return
  const scrollable = el.offsetHeight - window.innerHeight
  if (scrollable <= 0)
    return // short layout (mobile): index set is enough, no scroll fight
  const sectionTop = window.scrollY + el.getBoundingClientRect().top
  const targetProgress = (i + 0.5) / STEPS.length // center of step i's band
  window.scrollTo({
    top: sectionTop + targetProgress * scrollable,
    behavior: reduced.value ? 'auto' : 'smooth',
  })
}

let stopScrollWatch: (() => void) | undefined

onMounted(() => {
  updateActiveStep(scrollYProgress.get())
  stopScrollWatch = scrollYProgress.on('change', updateActiveStep)
})

onUnmounted(() => stopScrollWatch?.())
</script>

<template>
  <section id="scan-pay-go" ref="sectionRef" class="scroll-mt-28 flex flex-col gap-14 lg:min-h-[340vh]">
    <header class="max-w-[940px] mx-auto text-center flex flex-col gap-5">
      <p class="m-0 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--brand-yellow-deep)]">
        {{ t('landing.how.label') }}
      </p>
      <h2 class="m-0 text-[48px] sm:text-[68px] font-black leading-[0.95] tracking-[-0.025em] text-balance text-[var(--text-primary)]">
        {{ t('landing.how.title') }}
      </h2>
      <p class="m-0 text-lg text-secondary leading-[1.5]">
        {{ t('landing.how.body') }}
      </p>
    </header>
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-10 items-center rounded-[40px] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 sm:p-10 shadow-[var(--card-shadow)] overflow-hidden lg:sticky lg:top-28">
      <ol class="list-none p-0 m-0 flex flex-col gap-7">
        <li
          v-for="(step, i) in STEPS"
          :key="step"
          role="button"
          tabindex="0"
          :aria-current="i === activeStepIndex ? 'step' : undefined"
          class="relative cursor-pointer rounded-[28px] p-6 sm:p-8 flex gap-5 border border-transparent transition-[opacity,background] duration-300 focus-ring"
          :class="i === activeStepIndex ? 'bg-[var(--card-hover-bg)] opacity-100' : 'opacity-55'"
          @click="goToStep(i)"
          @keydown.enter.prevent="goToStep(i)"
          @keydown.space.prevent="goToStep(i)"
        >
          <motion.div
            v-if="i === activeStepIndex"
            layout-id="how-step-border"
            class="absolute inset-0 rounded-[28px] border-2 border-[var(--brand-yellow)] pointer-events-none"
            :transition="reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }"
          />
          <span
            class="w-10 h-10 rounded-2xl grid place-items-center shrink-0 text-base font-black"
            :class="i === activeStepIndex ? 'bg-[var(--brand-yellow)] text-[#000000]' : 'bg-[var(--surface-2)] text-label'"
          >
            {{ i + 1 }}
          </span>
          <div class="flex flex-col gap-3">
            <h3 class="m-0 text-2xl font-black tracking-[-0.02em] text-[var(--text-primary)]">
              {{ t(`landing.how.${step}.title`) }}
            </h3>
            <p class="m-0 text-base text-secondary leading-[1.5]">
              {{ t(`landing.how.${step}.body`) }}
            </p>
            <StoreButtons v-if="i === 0" class="mt-2 max-w-[360px]" />
          </div>
        </li>
      </ol>
      <div class="relative min-h-[520px] grid place-items-end">
        <div class="relative w-full max-w-[300px] h-[652px] mx-auto lg:mr-12 -mb-20">
          <motion.div
            v-for="(shot, i) in phoneShots"
            :key="shot.key"
            class="absolute inset-0"
            :initial="false"
            :animate="i === activeStepIndex ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 }"
            :transition="reduced ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 24 }"
            :aria-hidden="i === activeStepIndex ? undefined : true"
          >
            <LandingScannerShot
              v-if="shot.key === 'scan'"
              :alt="shot.alt"
              class="w-full"
            />
            <LandingPhoneShot
              v-else
              :src="shot.src"
              :alt="shot.alt"
              :width="480"
              :height="1043"
              class="w-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
</template>
