# Design System Strategy: The Kinetic Vitality Framework

## 1. Overview & Creative North Star: "The High-Performance Editorial"
The North Star for this design system is **Kinetic Vitality**. We are moving away from the static, "boxed-in" feel of traditional health apps and toward a high-end editorial experience that feels as energetic as a premium fitness editorial. 

The system rejects the "standard" mobile grid in favor of **intentional asymmetry and breathability**. By utilizing Plus Jakarta Sans in aggressive scale shifts—pairing massive display type with generous whitespace—we create an interface that feels authoritative yet light. We do not use lines to separate ideas; we use the tension between black high-impact typography and vibrant, glass-morphic surfaces to guide the user's eye.

## 2. Colors & Surface Architecture
The palette is built on high-contrast energy. We use black for structural authority and lime green for metabolic momentum.

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning. 
Structure must be defined through **Tonal Transitions**. Use `surface-container-low` (#f3f3f3) against a `surface` (#f9f9f9) background to define a zone. If a layout feels cluttered, increase the spacing (`spacing-8` or `spacing-10`) rather than adding a divider.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials:
*   **Base Layer:** `surface` (#f9f9f9) — The canvas.
*   **Section Layer:** `surface-container-low` (#f3f3f3) — Large content areas.
*   **Interactive Layer:** `surface-container-lowest` (#ffffff) — For cards that need to pop.
*   **The "Glass" Rule:** For floating CTAs or high-level navigation, use `surface-variant` at 60% opacity with a `backdrop-filter: blur(20px)`. This ensures the vibrant `primary` (#a3e635) accents bleed through the interface, maintaining a sense of depth.

### Signature Textures
Main CTAs should not be flat. Apply a subtle linear gradient from `primary` (#a3e635) to `primary-container` (#b2f746) at a 135-degree angle to give the "Lime" a pressurized, liquid feel.

## 3. Typography: Editorial Authority
We use **Plus Jakarta Sans** exclusively. The goal is a high "Type-to-Negative-Space" ratio.

*   **Display (LG/MD):** Used for daily caloric remaining or "Big Wins." Set to `ExtraBold` with `-0.02em` tracking. These elements should feel like they are "anchoring" the screen.
*   **Headlines:** Always `on-background` (#1a1c1c). Use `Headline-LG` for page titles to establish immediate hierarchy.
*   **Body:** `Body-LG` is the workhorse. Maintain high line-height (1.6) to ensure the diet data feels digestible, not clinical.
*   **Labels:** Use `Label-MD` in `SemiBold` for metadata. Keep these tight and secondary to the data they describe.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too "heavy" for a vitality-focused app. We use **Ambient Softness**.

*   **The Layering Principle:** Instead of shadows, drop a `surface-container-lowest` (#ffffff) card onto a `surface-container-low` (#f3f3f3) background. The 2% shift in brightness is enough for the human eye to perceive elevation without visual "noise."
*   **Ambient Shadows:** For high-priority floating elements (like a "Log Meal" FAB), use a shadow with a 40px blur, 0% spread, and 6% opacity of `on-surface` (#1a1c1c).
*   **The Ghost Border:** If contrast fails (e.g., white on light grey for accessibility), use the `outline-variant` (#c2cab0) at **15% opacity**. This creates a "suggestion" of a boundary that disappears into the background.

## 5. Components
### Buttons
*   **Primary:** Vibrant Lime (`primary-container`) with Black text (`on-primary-fixed`). 48px height minimum. 100% rounded (`rounded-full`) to contrast the sharp typography.
*   **Secondary (Water Tracking):** Exclusive Sky Blue (`secondary-container`) with White text. Use only for hydration-related actions.
*   **Tertiary:** Transparent background with `on-surface` bold text and a subtle `Glassmorphism` hover state.

### Cards & Lists
*   **Forbid Dividers:** Use `spacing-4` (1rem) of vertical whitespace or a background shift to `surface-container-highest` (#e2e2e2) for the active state.
*   **Glass Cards:** Use for "Daily Progress" summaries. Background: `surface` at 70% opacity + 12px blur + 10% `outline-variant` ghost border.

### Inputs & Progress
*   **Input Fields:** Ghost-style. No bottom line. Use `surface-container-low` as the fill with `rounded-md` (0.75rem).
*   **Progress Gauges:** Use heavy stroke weights (12pt+). The background track should be `surface-container-highest` and the progress fill should be the vibrant `primary` (#a3e635).

### Specialized Components
*   **Hydration Waves:** Use a 15% opacity `secondary` (#0058be) wave animation inside water-tracking cards to signify fluid motion.
*   **The "Macro-Bar":** A segmented horizontal bar using `primary` (Carbs), `secondary` (Fats), and `on-tertiary-container` (Protein) with `rounded-full` caps.

## 6. Do's and Don'ts
*   **DO:** Use asymmetrical padding. A card can have more padding at the bottom than the top to create a "weighted" editorial look.
*   **DO:** Use the vibrant `primary` (#a3e635) sparingly. If everything is green, nothing is important. Use it for "Action" and "Success" only.
*   **DON'T:** Use pure black (#000000) for long-form body text; use `on-surface` (#1a1c1c) to prevent eye strain while keeping headers "True Black" for impact.
*   **DON'T:** Ever use a standard 1px grey divider. If you need a break, use a `spacing-px` height box filled with `surface-container-highest` (#e2e2e2) that doesn't touch the edges of the screen.
*   **DO:** Ensure the `secondary` blue is never used for anything other than water. It is a cognitive shortcut for the user; don't break the mental model.