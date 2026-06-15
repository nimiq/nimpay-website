---
name: Nimiq Pay
description: Nimiq Pay landing + mini-apps catalog — a sunny storefront where yellow sells the app and every mini app keeps its own gradient voice.
colors:
  brand-navy: "#20234b"
  brand-ink: "#151620"
  brand-yellow: "#ffc72c"
  brand-yellow-deep: "#f2b600"
  brand-blue: "#147af3"
  app-bg-light: "#f6f7f9"
  app-bg-dark: "#11142d"
  mist: "#f4f4f8"
  gold-gradient: "var(--colors-gold-gradient) (nimiq-css)"
  evm-indigo: "#3451d1"
  evm-periwinkle: "#4d66de"
  chip-blue-bg: "light-dark(#eaf3ff, rgb(20 122 243 / 0.18))"
  chip-blue-text: "light-dark(#1769e0, #8ec2ff)"
typography:
  display:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "42px / 58–66px (lg)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "34px / 48–72px (sm+)"
    fontWeight: 900
    lineHeight: 0.95–1
    letterSpacing: "-0.02em to -0.03em"
  title:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "18–30px"
    fontWeight: 900
    lineHeight: 1.05–1.25
  body:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "15–18px"
    fontWeight: 400
    lineHeight: 1.45–1.65
  label:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "10–11px"
    fontWeight: 800
    letterSpacing: "0.1–0.16em"
rounded:
  control: "10px"
  logo-tile: "14px"
  input: "16px (1rem, .mock-input & rounded-2xl buttons)"
  card: "28px"
  panel: "32px"
  hero-panel: "40px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "56px+ (gap-14 to gap-20)"
components:
  cta-primary:
    background: "var(--brand-navy)"
    textColor: "#ffffff"
    rounded: "16px (rounded-2xl)"
    shadow: "type-tinted glow (theme.ctaShadow)"
  cta-yellow:
    background: "var(--brand-yellow)"
    textColor: "var(--brand-navy)"
    rounded: "16px"
  store-button:
    background: "#000000 (light) + subtle white border (dark)"
    textColor: "#ffffff"
    rounded: "12px (rounded-xl)"
    height: "44–56px"
  card:
    background: "var(--surface-1)"
    border: "1px var(--border-subtle)"
    rounded: "28px"
    shadow: "var(--card-shadow)"
  featured-card:
    background: "app-type gradient + HexField + bottom scrim"
    textColor: "#ffffff over scrim; white/92 chip with navy text"
    rounded: "32px"
  type-badge:
    background: "app-type gradient (gold / EVM indigo)"
    textColor: "#ffffff"
    rounded: "full"
  chip:
    background: "var(--chip-blue-bg)"
    textColor: "var(--chip-blue-text)"
    rounded: "full"
---

# Design System: Nimiq Pay

## 1. Overview

**Creative North Star: "The Sunny Storefront"**

One site, two registers. The **landing** sells Nimiq Pay with the brand's own voice: big black-weight Mulish headlines, Nimiq-yellow hero and download panels, navy ink, and real app screenshots in phone frames. The **mini-apps catalog** is the store inside it: near-neutral chrome (white / deep navy-blue, alpha-tint surfaces) where each mini app keeps its own gradient identity (gold for Nimiq, indigo for EVM). Yellow sells the app; the gradients sell the apps.

**Key Characteristics:**
- Dual-theme via CSS `light-dark()` on every token in `app.vue` — **the only theme mechanism**. UnoCSS `dark:` variants do NOT work here (theme is `data-theme` + `color-scheme`, no `.dark` class); never use them.
- Brand yellow is a surface color (hero panel, download panel, marquee bands, CTAs) and always carries **navy ink text** — never white on yellow.
- Saturated mini-app gradients (gold / EVM indigo) appear only on type-coded elements: featured cards, type badges, asset chips, CTA glow.
- Springy motion (motion-v) under a global `MotionConfig reduced-motion="user"` in `app.vue`.

## 2. Colors

### Primary
- **Brand Yellow** (`--brand-yellow` #ffc72c → `--brand-yellow-deep` #f2b600, `--brand-yellow-gradient`): hero/download panels, marquee, primary "browse" CTA. Text on yellow is always `--brand-navy` (~9:1).
- **Brand Navy** (`--brand-navy` #20234b): primary action color (Open in Wallet, Continue button), heading color in light theme, tip-card surface.

### Secondary
- **Gold gradient** (`--colors-gold-gradient`, nimiq-css): Nimiq-type identity. The chain chips (type badge, filter switch, supported-assets) keep white text on the gradient — a deliberate brand choice, kept over strict AA.
- **EVM indigo gradient** (`--colors-evm-gradient` #3451d1→#4d66de): EVM-type identity. Text on indigo is white.
- **Brand Blue** (`--brand-blue` #147af3): feature-card tint, blue chips (`--chip-blue-bg/text`).

### Neutrals
All neutrals are `light-dark()` pairs in `app.vue:28-100`: `--app-bg`, `--surface-1/2/3`, `--surface-hover`, `--card-hover-bg`, `--border-subtle/default/strong`, `--text-primary/secondary/tertiary/label/muted/faint`, `--heading-contrast` (navy in light, mist in dark), `--dropdown-bg`, `--strip-bg`.

### Named Rules
**The Navy-on-Yellow Rule.** Yellow surfaces always carry navy ink text. White on yellow/gold is forbidden (≈1.8–2:1).

**The Chain-Chip Rule.** Type-coded chips (type badge, filter switch pill, supported-assets) wear the chain gradient (gold for Nimiq, indigo for EVM, green for "all") with **white text**. This is a fixed brand identity — don't recolor it for contrast.

**The light-dark() Rule.** Every color literal in a component must be theme-safe: either a `var(--…)` token or an inline `light-dark(light, dark)` pair. A bare hex without a dark partner breaks the dark theme. **Never use `dark:` utilities** — they silently no-op.

**Heading colors are explicit.** nimiq-css preflight assigns headings their own color; on colored surfaces (navy/gold cards) always set `text-white` / ink explicitly on the h-element, not just on the parent.

## 3. Typography

**One family: Mulish** (system-ui fallback), weight-driven hierarchy (400 → 700 → 800 → 900). Fira Code only for URLs/source paths (`font-mono` in MiniAppMetaPanel).

- **Display** (900, 42–66px, -0.02em, `text-balance`): page h1s.
- **Headline** (900, 34–72px, -0.02 to -0.03em): section h2s.
- **Title** (900, 18–30px): card and panel titles.
- **Body** (400–600, 15–18px, 1.45–1.65): `--text-secondary` for supporting copy.
- **Label** (800, 10–11px, 0.1–0.16em tracking, uppercase): chips, badges, field labels, `--text-label`.

## 4. Elevation

Soft and generous: `--card-shadow` (22px/70px navy-tinted in light, black in dark) on white cards is the default. Colored glows appear under colored elements: yellow glow under the download panel and header mark, `--card-glow` (type-tinted) under featured cards, `theme.ctaShadow` under the Open-in-Wallet CTA. The detail CTA card wears a signature neo-brutalist offset: `border-2 border-navy` + `shadow-[14px_14px_0_var(--brand-navy)]`.

## 5. Components

Springs: stiffness 320–400, damping 18–26, via motion-v. Global reduced-motion handling in `app.vue`; CSS animations get their own `@media (prefers-reduced-motion)` blocks (see MiniAppGrid, LandingFaq, marquees).

- **Primary CTA (Open in Wallet / Open in Nimiq Pay):** navy fill, white text, rounded-2xl, type-tinted glow, spring hover (scale 1.02, y -1) press (0.97). One per view.
- **Yellow CTA (Browse All Apps):** yellow fill, navy text, yellow-tinted shadow.
- **Store buttons:** black fill (`bg-[#000000]` — `bg-black` is not in the preset palette and silently fails), white text, subtle white border in dark theme; `onGradient` variant is white with ink text.
- **Cards:** `--surface-1` + `--border-subtle` + `--card-shadow`, rounded-[28px]; hover = `--card-hover-bg` + border-default + spring lift.
- **Panels:** rounded-[32px]; hero-scale panels rounded-[40px].
- **Featured cards:** type gradient + white HexField texture + bottom scrim `rgba(0,0,0,0.68→transparent)`; white text over the scrim, white/92 chip with navy text, white "Details" pill.
- **Type badges:** chain-gradient pill, white text, 10px/800/uppercase; dot variant for dense rows.
- **Filter switch:** reka-ui ToggleGroup on a `--surface-2` track; active pill is a shared `layout-id` chain-gradient (gold/indigo/green via `backgroundForFilter`) with white text that slides between options.
- **Chips:** `--chip-blue-bg/text` for informational labels (preview, invite, feature labels).
- **Inputs:** 16px radius, `--surface-2` fill, `--border-default`, placeholder `--text-tertiary`; focus = orange `focus-ring` (2px `--colors-orange-1100`, offset 2).
- **Nav:** sticky blurred header, `min-h-11` links, yellow underline on active (`router-link-active`), springy logo mark.
- **Disabled:** opacity 50–60 + `cursor-not-allowed` (mock submit flow).

### Radius scale
10 (controls) / 14 (logo tiles) / 16 (inputs, buttons) / 24 (small cards) / 28 (cards) / 32 (panels) / 40 (hero panels) / full (pills). No other values.

## 6. Do's and Don'ts

### Do:
- **Do** pair every new color with `light-dark()` and test both themes — `data-theme` + system fallback.
- **Do** use `themeForType()` / `backgroundForFilter()` for anything type-coded (gradient, glow, ctaShadow); chain chips always use white text on the gradient.
- **Do** keep the `focus-ring` shortcut on every focusable; use `-outline-offset-2` inside `overflow-hidden` containers (see LandingFaq).
- **Do** keep one navy "open" CTA per view; "Details" is the only label for links to detail pages.
- **Do** apply the theme in standalone roots: `error.vue` must call `useTheme()` + `useHead({ htmlAttrs })` itself (it renders outside `app.vue`).

### Don't:
- **Don't** use `dark:` UnoCSS variants — they never apply in this setup.
- **Don't** use `bg-black`/palette color names that aren't in the nimiq-css/wind4 theme — use arbitrary hex (`bg-[#000000]`) or tokens.
- **Don't** put white text on yellow or gold, or gray text on colored surfaces.
- **Don't** introduce a second font family, gradient text, glassmorphism, or side-stripe borders.
- **Don't** rely on inherited color for headings on colored cards — preflight overrides it; set the heading color explicitly.
- **Don't** use empty `<span>`/`<p>` for decorative elements — nimiq-css preflight hides empty spans; use `<div>`.
