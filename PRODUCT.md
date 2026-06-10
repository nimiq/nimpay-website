# Product

## Register

product

## Users

Nimiq Pay app users (crypto-curious consumers, not developers) discovering mini apps they can open and pay with inside Nimiq Pay. They arrive from the app, from shared deeplinks, or from search; usually on mobile, mid-task, wanting to find and open an app quickly. Secondary: mini app builders checking how their listing looks.

## Product Purpose

Public, statically generated catalog of Nimiq Pay mini apps at `nimpay.app/miniapps`. It exists to make the ecosystem browsable: featured picks, type filters, search, per-app detail pages, and deeplink interstitials that hand off into the Nimiq Pay app (with app-store fallback). Success = a visitor finds a relevant mini app and opens it in Nimiq Pay with minimal friction. Data is sourced at build time from `nimiq/awesome`; stale data fails the build rather than shipping.

## Brand Personality

Playful, vibrant, app-store-like. Browsing should feel like flipping through a fun, curated app store — energetic discovery with featured picks — while staying inside the established Nimiq brand language (nimiq-css tokens, Nimiq orange/gold warmth). Friendly motion (springy hover states already in use) over static corporate stillness.

## Anti-references

- Corporate SaaS landing pages: hero-metric templates, identical icon-heading-text card grids, stock-photo marketing tone.
- Cluttered app stores: ad banners, ranking spam, dense competing CTAs. Curation over noise — one clear "Open in Nimiq Pay" action per app.

## Design Principles

1. **Open-in-Pay is the job.** Every screen funnels toward opening a mini app in Nimiq Pay; nothing competes with that action.
2. **The apps carry the color.** Mini app logos and identities are the visual stars; the catalog chrome stays on Nimiq tokens and lets listings pop.
3. **Playful, not noisy.** Energy comes from motion and featured curation, not from banner clutter or competing widgets.
4. **Mobile-first handoff.** Most visitors are on a phone mid-task; deeplink flows and touch targets are designed before desktop niceties.
5. **Build-time truth.** The catalog reflects `nimiq/awesome` exactly; never decorate around missing or stale data.

## Accessibility & Inclusion

Best-effort, no formal WCAG target. Keep the basics: readable contrast on text, keyboard-reachable filters and links, `prefers-reduced-motion` alternatives for springy/animated elements (motion-v effects), focus-visible rings (already a `focus-ring` shortcut in uno.config.ts).
