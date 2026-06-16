<script setup lang="ts">
import { motion, useReducedMotion, useScroll } from 'motion-v'
import homeNim480 from '~/assets/screenshots/home-nim-480.webp'
import homeUsdt480 from '~/assets/screenshots/home-usdt-480.webp'
import miniAppsFlow480 from '~/assets/screenshots/mini-apps-flow-480.webp'

const SLIDES = [
  { step: 'step1', src: homeNim480, scan: false },
  { step: 'step2', src: homeUsdt480, scan: false },
  { step: 'step3', src: '', scan: true },
  { step: 'step4', src: miniAppsFlow480, scan: false },
]
const STEP_COUNT = SLIDES.length

const { t } = useI18n()
const reduced = useReducedMotion()
const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const activeStepIndex = shallowRef(0)
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ['start start', 'end end'],
})

// One source of truth for both the desktop stepper and the mobile carousel.
const slides = computed(() => SLIDES.map((slide, index) => ({
  index,
  scan: slide.scan,
  src: slide.src,
  title: t(`landing.how.${slide.step}.title`),
  body: t(`landing.how.${slide.step}.body`),
})))

function updateActiveStep(progress: number) {
  activeStepIndex.value = Math.min(STEP_COUNT - 1, Math.max(0, Math.floor(progress * STEP_COUNT)))
}

// Desktop only: jump to a step — set index for instant border move, then scroll
// the page so the scroll watcher lands in that step's band (keeps them in sync).
function goToStep(i: number) {
  activeStepIndex.value = i
  const el = sectionRef.value
  if (!el)
    return
  const scrollable = el.offsetHeight - window.innerHeight
  if (scrollable <= 0)
    return
  const sectionTop = window.scrollY + el.getBoundingClientRect().top
  const targetProgress = (i + 0.5) / STEP_COUNT // center of step i's band
  window.scrollTo({
    top: sectionTop + targetProgress * scrollable,
    behavior: reduced.value ? 'auto' : 'smooth',
  })
}

// The scroll-pinned choreography is a desktop affordance. On mobile the section
// is a plain swipe carousel, so the scroll watcher must NOT drive activeStepIndex
// there (it would dim steps and swap a floating phone for no reason).
let stopScrollWatch: (() => void) | undefined
function bindScrollWatch(isDesktop: boolean) {
  stopScrollWatch?.()
  stopScrollWatch = undefined
  if (isDesktop) {
    updateActiveStep(scrollYProgress.get())
    stopScrollWatch = scrollYProgress.on('change', updateActiveStep)
  }
}

// Mobile carousel: scroll-snap track + IntersectionObserver-synced dots.
const trackRef = useTemplateRef<HTMLElement>('trackRef')
const carouselIndex = shallowRef(0)
let io: IntersectionObserver | undefined

function scrollToSlide(i: number) {
  const track = trackRef.value
  const slide = track?.children[i] as HTMLElement | undefined
  if (!track || !slide)
    return
  track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: reduced.value ? 'auto' : 'smooth' })
}

onMounted(() => {
  const mql = window.matchMedia('(min-width: 1024px)')
  bindScrollWatch(mql.matches)
  mql.addEventListener('change', e => bindScrollWatch(e.matches))

  const track = trackRef.value
  if (track) {
    io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting)
          continue
        const idx = Number((entry.target as HTMLElement).dataset.index)
        if (!Number.isNaN(idx))
          carouselIndex.value = idx
      }
    }, { root: track, threshold: 0.6 })
    for (const child of track.children) io.observe(child)
  }
})

onUnmounted(() => {
  stopScrollWatch?.()
  io?.disconnect()
})
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

    <!-- Desktop: scroll-pinned stepper -->
    <div class="hidden lg:grid lg:grid-cols-[1fr_0.85fr] gap-10 items-center rounded-[40px] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 sm:p-10 shadow-[var(--card-shadow)] overflow-hidden lg:sticky lg:top-28">
      <ol class="list-none p-0 m-0 flex flex-col gap-7">
        <li
          v-for="slide in slides"
          :key="slide.index"
          role="button"
          tabindex="0"
          :aria-current="slide.index === activeStepIndex ? 'step' : undefined"
          class="relative cursor-pointer rounded-[28px] p-6 sm:p-8 flex gap-5 border border-transparent transition-[opacity,background] duration-300 focus-ring"
          :class="slide.index === activeStepIndex ? 'bg-[var(--card-hover-bg)] opacity-100' : 'opacity-55'"
          @click="goToStep(slide.index)"
          @keydown.enter.prevent="goToStep(slide.index)"
          @keydown.space.prevent="goToStep(slide.index)"
        >
          <motion.div
            v-if="slide.index === activeStepIndex"
            layout-id="how-step-border"
            class="absolute inset-0 rounded-[28px] border-2 border-[var(--brand-yellow)] pointer-events-none"
            :transition="reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }"
          />
          <span
            class="w-10 h-10 rounded-2xl grid place-items-center shrink-0 text-base font-black"
            :class="slide.index === activeStepIndex ? 'bg-[var(--brand-yellow)] text-[#000000]' : 'bg-[var(--surface-2)] text-label'"
          >
            {{ slide.index + 1 }}
          </span>
          <div class="flex flex-col gap-3">
            <h3 class="m-0 text-2xl font-black tracking-[-0.02em] text-[var(--text-primary)]">
              {{ slide.title }}
            </h3>
            <p class="m-0 text-base text-secondary leading-[1.5]">
              {{ slide.body }}
            </p>
            <StoreButtons v-if="slide.index === 0" class="mt-2 max-w-[360px]" />
          </div>
        </li>
      </ol>
      <div class="relative min-h-[520px] grid place-items-end">
        <div class="relative w-full max-w-[300px] h-[652px] mx-auto lg:mr-12 -mb-20">
          <motion.div
            v-for="slide in slides"
            :key="slide.index"
            class="absolute inset-0"
            :initial="false"
            :animate="slide.index === activeStepIndex ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 }"
            :transition="reduced ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 24 }"
            :aria-hidden="slide.index === activeStepIndex ? undefined : true"
          >
            <LandingScannerShot
              v-if="slide.scan"
              :alt="slide.title"
              class="w-full"
            />
            <LandingPhoneShot
              v-else
              :src="slide.src"
              :alt="slide.title"
              :width="480"
              :height="1043"
              class="w-full"
            />
          </motion.div>
        </div>
      </div>
    </div>

    <!-- Mobile: swipe carousel -->
    <div class="lg:hidden">
      <div
        ref="trackRef"
        class="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-5 px-5"
        role="group"
        aria-roledescription="carousel"
        :aria-label="t('landing.how.title')"
      >
        <div
          v-for="slide in slides"
          :key="slide.index"
          :data-index="slide.index"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${slide.index + 1} / ${STEP_COUNT}: ${slide.title}`"
          class="snap-center shrink-0 w-full flex flex-col gap-6 rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 shadow-[var(--card-shadow)]"
        >
          <div class="flex gap-4 items-start">
            <span class="w-10 h-10 rounded-2xl grid place-items-center shrink-0 text-base font-black bg-[var(--brand-yellow)] text-[#000000]">
              {{ slide.index + 1 }}
            </span>
            <div class="flex flex-col gap-2 min-w-0">
              <h3 class="m-0 text-2xl font-black tracking-[-0.02em] text-[var(--text-primary)]">
                {{ slide.title }}
              </h3>
              <p class="m-0 text-base text-secondary leading-[1.5]">
                {{ slide.body }}
              </p>
            </div>
          </div>
          <StoreButtons v-if="slide.index === 0" />
          <div class="relative mx-auto w-full max-w-[260px]">
            <LandingScannerShot
              v-if="slide.scan"
              :alt="slide.title"
              class="w-full"
            />
            <LandingPhoneShot
              v-else
              :src="slide.src"
              :alt="slide.title"
              :width="480"
              :height="1043"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-4 mt-6">
        <button
          type="button"
          class="w-11 h-11 grid place-items-center rounded-full border border-[var(--border-default)] bg-[var(--surface-1)] text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed focus-ring"
          :disabled="carouselIndex === 0"
          :aria-label="t('landing.how.prev')"
          @click="scrollToSlide(carouselIndex - 1)"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div class="flex items-center gap-2.5">
          <button
            v-for="slide in slides"
            :key="slide.index"
            type="button"
            class="h-2.5 rounded-full transition-all duration-200 focus-ring"
            :class="slide.index === carouselIndex ? 'w-6 bg-[var(--brand-yellow)]' : 'w-2.5 bg-[var(--border-strong)]'"
            :aria-label="t('landing.how.goToStep', { step: slide.title })"
            :aria-current="slide.index === carouselIndex ? 'true' : undefined"
            @click="scrollToSlide(slide.index)"
          />
        </div>
        <button
          type="button"
          class="w-11 h-11 grid place-items-center rounded-full border border-[var(--border-default)] bg-[var(--surface-1)] text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed focus-ring"
          :disabled="carouselIndex === STEP_COUNT - 1"
          :aria-label="t('landing.how.next')"
          @click="scrollToSlide(carouselIndex + 1)"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  </section>
</template>
