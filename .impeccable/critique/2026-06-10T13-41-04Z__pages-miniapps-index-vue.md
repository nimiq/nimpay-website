---
target: miniapps catalog (pages/miniapps/index.vue)
total_score: 26
p0_count: 0
p1_count: 3
timestamp: 2026-06-10T13-41-04Z
slug: pages-miniapps-index-vue
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | "Showing X of Y" + pill states good; no screen-reader announcement when results change |
| 2 | Match System / Real World | 3 | App-store mental model lands; "EVM" is unexplained jargon for crypto-curious consumers |
| 3 | User Control and Freedom | 2 | Search/filter state lives in component memory — lost on back-navigation, not URL-shareable |
| 4 | Consistency and Standards | 3 | Featured strip ignores the active filter, contradicting "Showing 0 of 9" |
| 5 | Error Prevention | 3 | Deeplink handling (OpenInPayCTA.vue) genuinely careful: modifier-click passthrough, iOS store fallback, visibility-abort |
| 6 | Recognition Rather Than Recall | 3 | Logos/badges/counts everywhere; stat labels map to filter labels |
| 7 | Flexibility and Efficiency | 2 | Double tab stops per card; no deep-linkable filtered views; no sort |
| 8 | Aesthetic and Minimalist Design | 4 | Restrained chrome, color discipline held; only wobble is the empty 3rd featured column at lg |
| 9 | Error Recovery | 2 | Empty state is one tertiary line, no "clear filters" action |
| 10 | Help and Documentation | 2 | Nothing explains what a "mini app" is or that "Open in Nimiq Pay" needs the app installed |
| **Total** | | **26/40** | **Acceptable — significant improvements needed before users are happy** |

## Anti-Patterns Verdict

**LLM assessment:** Largely clean. No gradient text, no glassmorphism, no side-stripes, no ghost cards; alpha-tint surfaces, 16px radii, and the one-gradient-CTA discipline read as deliberate system thinking. Two mild template tells: the uppercase tracked eyebrow recurs on hero, featured strip, and every detail-page section label ("ABOUT", "MORE MINI APPS", "WEBSITE", "SOURCE"); and the hero → stat-rail → featured shelf → search/grid scaffold is the stock directory layout. A fluent app-store user would trust the page.

**Deterministic scan:** `detect.mjs` over pages/components/layouts/app.vue/error.vue: exit 0, **0 findings**. In-browser detector on catalog + detail page: catalog printed only an advisory `single-font: only font used is mulish`; detail page printed "No anti-patterns found". The single-font note is a false positive in context — Mulish is the Nimiq brand typeface and the One Family Rule is an explicit DESIGN.md rule.

**Agreement:** Detector confirms the LLM's "clean" verdict. The LLM review caught everything that matters beyond the detector's reach: keyboard a11y, state persistence, and contrast on gradient surfaces (which the detector does not measure).

## Overall Impression

A disciplined, brand-true catalog whose visual system (Neon Arcade Shelf) is executed with real rigor — the weak spots are not visual but interactive: keyboard noise, lost filter state, an amputated mobile detail page, and small white text on gold/mint that misses AA. The single biggest opportunity: make the find→open loop survive navigation (URL-synced filters) and give mobile users the full detail page.

## What's Working

1. **Deeplink engineering as UX** (`components/miniapps/OpenInPayCTA.vue`): platform detection, Android intent URL, iOS custom-scheme + App Store fallback with visibility-based cancel. The most failure-prone moment of the product is the best-handled.
2. **Color system discipline**: chrome is pure alpha tints via `light-dark()`; saturated gradients only on type-coded surfaces. Body text on chrome computes ~6.8:1 light / ~8.2:1 dark. Both themes verified coherent.
3. **Type-coded wayfinding**: gold=Nimiq / indigo=EVM / mint=All carried consistently through featured cards, badges, filter pill, CTA gradient, and dot variants.

## Priority Issues

1. **[P1] Double tab stop on every card** — `MiniAppCard.vue:12`, `MiniAppDetail.vue:61`: motion.div with `:while-press` gets `tabindex="0"` from motion-v, so keyboard users hit a focusable non-interactive DIV before each link (9 extra stops on the grid, default focus ring, activates nothing). **Fix:** `tabindex="-1"` on the motion.div or move gestures onto the link element. **Suggested command:** $impeccable polish
2. **[P1] Mobile detail page amputates Website / Source / Report** — `MiniAppDetail.vue:86`: the aside is `hidden md:flex`; at 390px (the primary audience) users cannot see the app URL, source repo, or reach the abuse-report flow. **Fix:** render the dl + report link inline below About on mobile; keep only the CTA in the fixed bar. **Suggested command:** $impeccable adapt
3. **[P1] Filter/search state lost on back-navigation** — `useMiniAppFilter` is per-mount refs; filter "Nimiq" → open app → back = filter reset, scroll lost. **Fix:** sync `search`/`type` to URL query params; also makes filtered views shareable. **Suggested command:** $impeccable harden
4. **[P2] Small white text on gold/mint fails AA** — active filter pill label on mint ≈ 2.4:1, NIMIQ badge white-on-gold ≈ 2:1, featured-card description on gold ≈ 3.9–4.3:1 even with scrim. **Fix:** dark ink text on gold/mint pills (Nimiq brand already pairs dark-blue on gold), or deepen the featured scrim band. **Suggested command:** $impeccable audit
5. **[P2] Empty state is a dead end and self-contradicting** — `MiniAppGrid.vue:24` is one tertiary line while featured cards above still show apps next to "Showing 0 of 9". **Fix:** add "Clear search & filters" button, echo the query, and collapse or filter the featured strip at zero results. **Suggested command:** $impeccable harden

## Persona Red Flags

**Casey (one-handed mobile, mid-task):** search sits below hero + two full-width featured cards (~1.5 screens of scroll at 390px) — slow path for "I know what I want". On detail page she cannot report a sketchy app or verify its URL (P1 #2). Returning from a detail resets her filter (P1 #3).

**Jordan (crypto-curious first-timer):** "EVM" unexplained in stat rail, filter toggle, and badges — the page's primary taxonomy is insider jargon. "community-curated nimiq/awesome list" in the hero subtitle is GitHub-speak. Nothing tells him tapping "Open in Nimiq Pay" requires the app until the fallback fires.

**Sam (screen reader / keyboard):** 9 phantom DIV tab stops in the grid (P1 #1). Zero `aria-live`/`role=status` — search/filter changes and the empty state are silent. Grid section has no h2 (card h3s nest under "Hand-picked apps to try first"). Card accessible names are run-on dumps ("EVM EVM Mini Wallet @Albermonte Lightweight, mobile-first wallet…"). LanguageSwitcher chevron SVG receives keyboard focus.

## Minor Observations

- Featured strip with exactly 2 apps leaves an empty third column at `lg:grid-cols-3` (`MiniAppFeaturedStrip.vue:26`).
- `MiniAppDetail.vue:119` sets `aria-hidden="false"` — no-op attribute, remove.
- Grid `TransitionGroup` enter delay (0.18s) makes filter responses feel laggier than the springy pill promises.
- "Showing 9 of 9" is noise in the default state; show count only when filtered.
- Card footer label "Open →" is ambiguous — it opens the detail page, not the app; collides with the real "Open in Nimiq Pay" one level deeper. "Details" or "View" is honest.
- Cards without a developer lose the `@handle` line, so type-line rhythm varies card to card.

## Questions to Consider

1. If the success metric is "open in Pay fast," why is the deeplink CTA two taps away for every app — should featured (or grid) cards carry a direct "Open in Pay" affordance?
2. The taxonomy is chain-first (Nimiq/EVM) — but does the user think in chains, or in jobs (games, wallets, trading)? At 9 apps it doesn't matter; at 90, is "EVM" the shelf label you want?
3. The catalog renders identically whether you arrive from inside Nimiq Pay or from a cold web link — should in-app visitors get a tighter view (no store buttons, no "what is Nimiq Pay")?
