---
name: Nimiq Pay Mini Apps
description: Public catalog of Nimiq Pay mini apps — a quiet shelf where every app glows in its own gradient.
colors:
  ink: "#0c0f24"
  paper-white: "#ffffff"
  mist: "#f4f4f8"
  midnight-blue: "oklch(0.2737 0.068 276.29)"
  nimiq-orange: "oklch(0.6769 0.1633 57)"
  arcade-gold: "oklch(0.7924 0.1593 85.61)"
  nimiq-blue: "oklch(0.5849 0.1438 244.29)"
  mint-green: "oklch(0.6932 0.1245 178.48)"
  evm-indigo: "#3451d1"
  evm-periwinkle: "#627eea"
typography:
  display:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "34px / 44px (sm+)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "22px / 26px (sm+)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Mulish, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  md: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "56px"
components:
  cta-primary:
    textColor: "#ffffff"
    rounded: "{rounded.2xl}"
    padding: "14px 20px"
  store-button:
    rounded: "{rounded.xl}"
    height: "48px"
    padding: "0 20px"
  card:
    rounded: "{rounded.2xl}"
    padding: "24px"
  featured-card:
    textColor: "#ffffff"
    rounded: "{rounded.3xl}"
    padding: "20px"
  filter-pill:
    rounded: "{rounded.full}"
    padding: "12px 20px"
  input-search:
    rounded: "{rounded.xl}"
    padding: "12px 14px 12px 42px"
  type-badge:
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "4px 10px 4px 8px"
---

# Design System: Nimiq Pay Mini Apps

## 1. Overview

**Creative North Star: "The Neon Arcade Shelf"**

The catalog is a quiet shelf in a dim arcade: the chrome (backgrounds, borders, text) stays near-monochrome — white or Nimiq midnight blue with alpha-tint surfaces — while every mini app glows like its own cabinet. Saturated color enters the page exclusively through the app-type gradients (gold for Nimiq, indigo for EVM, green for "all") and the apps' own logos. The shelf never competes with the cabinets.

The system is playful and tactile, not corporate. Every interactive element responds with a spring — cards lift, pills squish, the CTA breathes — because browsing here should feel like an app store, not a SaaS brochure. It explicitly rejects the corporate SaaS landing (hero-metric templates, identical icon-heading-text card grids) and the cluttered app store (banner noise, competing CTAs). One gradient action per view: "Open in Nimiq Pay".

**Key Characteristics:**
- Dual-theme via CSS `light-dark()` — white paper in light, Nimiq midnight blue in dark; every neutral is an alpha tint of ink or white, so themes stay in lockstep.
- Color is earned: saturated gradients belong to app types, never to chrome.
- Springy motion (motion-v) with `reduced-motion="user"` honored globally.
- Flat surfaces; shadows exist only as colored glow under gradient elements.

## 2. Colors

A near-monochrome shelf with three type-gradient voices that carry all saturation.

### Primary
- **Nimiq Orange** (oklch(0.6769 0.1633 57) light / oklch(0.772 0.1738 64.55) dark): the brand's focus voice. Focus rings, search-input focus border, active outlines. It marks "you are here", not decoration.

### Secondary
- **Arcade Gold** (oklch(0.7924 0.1593 85.61), used as `var(--colors-gold-gradient)`): the Nimiq app-type identity. Radial gradient on Nimiq-type badges, featured cards, and the Open-in-Pay CTA. Its glow (`--colors-gold-1100`) backs gold surfaces.
- **EVM Indigo → Periwinkle** (#3451d1 → #627eea, `--colors-evm-gradient`): the EVM app-type identity. Same roles for EVM-type apps.
- **Mint Green** (oklch(0.6932 0.1245 178.48), `--colors-green-gradient`): the "all" filter pill only.

### Neutral
- **Ink** (#0c0f24): light-theme text anchor. All light-theme neutrals are alpha tints of ink: text at 0.66–0.82, surfaces at 0.04–0.10, borders at 0.08–0.22.
- **Paper White** (#ffffff): light-theme page and header background.
- **Midnight Blue** (oklch(0.2737 0.068 276.29), `--colors-darkblue`): dark-theme page background. Dark-theme neutrals are white alpha tints on top of it.
- **Mist** (#f4f4f8): dark-theme text anchor; light-theme strip background.

### Named Rules
**The Shelf Rule.** Chrome is never saturated. Backgrounds, cards, borders, and text use only alpha tints of ink or white. If an element wants color, it must be an app-type gradient or an app's own logo — there is no third source of color.

**The One Cabinet Rule.** One gradient CTA per view. Store buttons, browser-fallback links, and secondary actions stay neutral so "Open in Nimiq Pay" is always the loudest thing on screen.

## 3. Typography

**Display Font:** Mulish (system-ui fallback) — supplied by nimiq-css preflight
**Body Font:** Mulish (same family, lighter weights)
**Label/Mono Font:** Fira Code (available via nimiq-css; rarely used in the catalog)

**Character:** One humanist sans in many weights. Warm and rounded enough to feel friendly, bold cuts tight enough to feel like product UI. Hierarchy comes from weight and size, never from a second family.

### Hierarchy
- **Display** (700, 34px mobile / 44px desktop, 1.05, -0.025em): page H1 only ("Mini Apps for Nimiq Pay").
- **Headline** (600, 22–26px, -0.01em): section headers like the featured-shelf subtitle.
- **Title** (700, 18px, leading-tight): card and detail app names.
- **Body** (400, 15–16px, 1.5): descriptions, interstitial copy. Secondary text drops to 82% alpha, tertiary to ~70%.
- **Label** (700, 10–12px, 0.04–0.12em tracking, uppercase): type badges, eyebrows, stat labels.

### Named Rules
**The One Family Rule.** Mulish does everything. Never introduce a second display face; reach for weight (400 → 600 → 700) and alpha (100% → 82% → 70%) instead.

## 4. Elevation

Flat by default, glow on color. Resting surfaces are alpha tints with 1px borders — no shadows. Shadow exists in exactly three places, and it is always either colored glow under a gradient element or the float of an overlay: the Open-in-Pay CTA (`0 10px 28px -14px <type-color at 50%>`), featured cards (`0 20px 56px -22px var(--card-glow)`, deepening on hover), and dropdowns (`--shadow-dropdown`, a soft dark float + 1px ring). Neutral cards communicate hover through border strengthening and surface tint (`--surface-1` → `--surface-2`), never through shadow.

### Shadow Vocabulary
- **CTA glow** (`box-shadow: 0 10px 28px -14px oklch(... / 0.5)`): under the gradient CTA, tinted to the app type.
- **Card glow** (`0 20px 56px -22px var(--card-glow)` → hover `0 36px 80px -18px`): under featured gradient cards only.
- **Dropdown float** (`--shadow-dropdown`): language/theme menus.

### Named Rules
**The Glow Rule.** A shadow must be tinted by the gradient it sits under, or it must belong to a floating overlay. A gray drop shadow on a flat neutral card is forbidden.

## 5. Components

Springy and tactile: every interactive element answers touch with a motion-v spring (stiffness 320–400, damping 18–30), and `MotionConfig reduced-motion="user"` quiets all of it for users who ask.

### Buttons
- **Shape:** generously rounded (16px, `rounded-2xl`) for the primary CTA; 12px for store buttons.
- **Primary (Open in Nimiq Pay):** app-type radial gradient background, white text, 600 weight, 14px 20px padding, type-tinted glow shadow. Spring hover (scale 1.02, y -1) and press (scale 0.97).
- **Store buttons (App Store / Google Play):** neutral — `--surface-1` fill, `--border-default` 1px border, 48px height; hover strengthens border and tint, springs y -2.
- **Tertiary (Continue in browser):** bare text link in tertiary color, hover shifts x +2 and brightens to primary text.
- **Hover / Focus:** all interactive elements use the `focus-ring` shortcut — 2px Nimiq Orange outline, 2px offset.

### Chips
- **Type badge (pill):** app-type gradient fill, white 700-weight 11px uppercase text with type icon, full-pill radius.
- **Type badge (dot):** 6px gradient dot + tertiary uppercase label, for dense contexts.
- **Filter pills:** full-pill toggle group on a `--surface-1` track; the active pill is a shared motion-v `layout-id` gradient that slides between options; inactive pills are transparent with default text.

### Cards / Containers
- **Corner Style:** 16px (`rounded-2xl`) for catalog cards; 24px (`rounded-3xl`) for featured gradient cards.
- **Background:** catalog cards `--surface-1` with `--border-subtle`; featured cards wear the full app-type gradient with a white hex-field texture and a bottom legibility scrim.
- **Shadow Strategy:** per the Glow Rule — neutral cards never; featured cards colored glow.
- **Hover:** spring lift (y -4, scale ~1.015) plus border/tint strengthen.
- **Internal Padding:** 24px catalog, 20px featured.

### Inputs / Fields
- **Style:** 12px radius, `--surface-1` fill, `--border-default` 1px border, 15px text, inline leading search icon, 44px min height.
- **Focus:** 2px Nimiq Orange outline (offset 2) and the border itself turns Nimiq Orange.

### Navigation
- **Header:** sticky, page-background fill with `--header-border` hairline; logo mark springs on hover (rotate -8°, scale 1.08). Theme and language switchers are quiet icon buttons; menus use `--dropdown-bg` and the dropdown float.
- **Footer:** hairline-topped, 13px tertiary text, underline-on-hover links.

### Featured Card (signature)
The full arcade cabinet: app-type radial gradient, `HexField` white hex pattern at 14% alpha, dark bottom scrim for text legibility, app logo + white type treatment, colored glow that deepens on hover. This is the catalog's hero moment — nothing else gets to be this loud.

## 6. Do's and Don'ts

### Do:
- **Do** keep chrome on alpha-tint neutrals (the Shelf Rule); let gradients and app logos be the only saturated color.
- **Do** give every interactive element a spring response (stiffness 320–400, damping 18–30) and rely on `MotionConfig reduced-motion="user"` to quiet it.
- **Do** use `light-dark()` pairs for every new color token so both themes ship together.
- **Do** keep exactly one gradient CTA per view (the One Cabinet Rule) — "Open in Nimiq Pay" always wins.
- **Do** use the `focus-ring` shortcut (2px Nimiq Orange, offset 2) on anything focusable.

### Don't:
- **Don't** build corporate SaaS landing patterns — hero-metric blocks, identical icon-heading-text card grids, stock-marketing tone. PRODUCT.md names these as anti-references.
- **Don't** clutter like a noisy app store: no ad banners, ranking spam, or competing CTAs next to Open-in-Pay.
- **Don't** put gray drop shadows on flat neutral cards; shadows are colored glows under gradients or overlay floats only (the Glow Rule).
- **Don't** introduce a second font family, gradient text (`background-clip: text`), glassmorphism, or colored side-stripe borders.
- **Don't** hardcode single-theme colors; a hex without a `light-dark()` partner breaks the dark theme.
- **Don't** use empty `<span>`/`<p>` for decorative elements — nimiq-css preflight hides empty spans; use `<div>`.
