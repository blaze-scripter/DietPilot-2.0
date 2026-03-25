# Design System Document

## 1. Overview & Creative North Star: "The Living Bio-Glass"
This design system is engineered to move beyond the static utility of traditional diet apps, positioning itself as a premium, editorial digital companion. The Creative North Star, **"The Living Bio-Glass,"** envisions the interface as a series of translucent, intelligent layers that feel as fresh and organic as the nutrition they track. 

We break the "standard template" look through **intentional asymmetry** and **tonal depth**. Rather than rigid, boxed-in grids, we use expansive white space and overlapping glass components to create a sense of breathing room. The layout mimics a high-end health journal—bold, energetic, and unapologetically modern.

---

## 2. Colors: Vibrancy & Tonal Sophistication
The palette is rooted in life-giving greens, balanced by a neutral, airy foundation. 

### The Palette
*   **Primary:** `#426500` (Deep Lime) | **Primary Container:** `#b8fd4b` (Electric Lime)
*   **Secondary:** `#3f6600` | **Secondary Container:** `#acf847`
*   **Tertiary (Success/Vitality):** `#006947` (Emerald) | **Tertiary Container:** `#69f6b8`
*   **Surface Foundation:** `#f6f6f6` (Off-white)
*   **Error:** `#b02500` (Refined Terracotta)

### Color Execution Rules
*   **The "No-Line" Rule:** 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined through background color shifts. Use `surface-container-low` for large sections and `surface-container-highest` for high-importance cards.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers. A `surface-container-lowest` card should sit atop a `surface-container-low` background to create a soft, natural lift.
*   **The "Glass & Gradient" Rule:** Floating action elements must utilize glassmorphism (surface colors at 60-80% opacity with a `16px` backdrop-blur). 
*   **Signature Textures:** For hero components or "Daily Intake" rings, use a subtle linear gradient transitioning from `primary` to `primary_container` (top-left to bottom-right). This provides a "soul" that flat hex codes cannot achieve.

---

## 3. Typography: Editorial Authority
The typography system pairs the high-energy, geometric personality of **Plus Jakarta Sans** with the functional clarity of **Inter**.

*   **Display & Headlines (Plus Jakarta Sans):** Used for "Big Moments"—daily calorie totals, motivational headings, and macro percentages. Bold or ExtraBold weights are required to create a "thick" visual anchor against the light glass backgrounds.
*   **Body & Titles (Inter):** Used for lists, descriptions, and data labels. Inter’s neutral architecture provides the necessary balance to the expressive headlines.
*   **The Contrast Rule:** Maintain a high contrast ratio between `display-lg` (3.5rem) and `body-sm` (0.75rem). This typographic "stretch" creates the premium editorial feel found in luxury magazines.

---

## 4. Elevation & Depth: Atmospheric Layering
We reject drop shadows in favor of **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** Depth is achieved by stacking `surface-container` tiers. 
    *   *Layer 0 (Background):* `surface`
    *   *Layer 1 (Section):* `surface-container-low`
    *   *Layer 2 (Interactive Card):* `surface-container-lowest` (pure white)
*   **Ambient Shadows:** When a "floating" glass effect is required, shadows must be extra-diffused. 
    *   *Value:* `0px 20px 40px rgba(45, 47, 47, 0.06)`. 
    *   The shadow should never be pure black; use a tinted version of `on-surface` to mimic natural light refraction.
*   **The "Ghost Border":** If a container requires further definition (e.g., on a photo background), use a "Ghost Border" of `outline-variant` at **15% opacity**.
*   **Glassmorphism:** For the bottom navigation bar and "Quick Add" modals, use a backdrop blur of `16px` combined with a semi-transparent `inverse_surface` (for dark mode nav) or `surface_container_lowest` (for light mode cards).

---

## 5. Components: Fluidity & Softness
All components follow a strictly rounded logic, moving away from harsh corners to evoke a sense of health and approachable technology.

*   **Buttons:** 
    *   *Primary:* `primary_container` background with `on_primary_fixed` text. Roundedness: `full`.
    *   *States:* On hover, shift to `primary_fixed_dim`. 
*   **Cards:** Forbid divider lines. Separate content using `3.5rem` (Spacing 10) of vertical white space or subtle background shifts between `surface-container` levels. Corner radius: `lg` (2rem).
*   **Macro Bars:** Use `surface-variant` for the track background. The "fill" should be a vibrant gradient. Ensure the ends are `full` rounded.
*   **Progress Rings:** A thick stroke (minimum `12px`) using the `primary` token. The "unfilled" portion should be `surface-container-highest` at 40% opacity.
*   **Bottom Navigation:** A "floating" glass island. Use a dark glass effect (`inverse_surface` at 85% opacity) with a `16px` blur. This creates a high-contrast anchor for the vibrant lime icons.
*   **Selection Chips:** Use `secondary_container` for the active state and `surface-container-high` for inactive. No borders; only tonal shifts.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use intentional asymmetry. Place a large `display-md` headline off-center to create visual interest.
*   **DO** use "Natural Spacing." Allow elements to breathe with at least `1.4rem` (Spacing 4) of internal padding on cards.
*   **DO** use high-quality food photography that bleeds edge-to-edge behind glass layers.

### Don't:
*   **DON'T** use 1px solid dividers or borders. They "break" the glass illusion and look dated.
*   **DON'T** use generic drop shadows. If it looks like a standard Material Design shadow, it is too heavy.
*   **DON'T** clutter the screen. If a piece of information isn't vital to the user's current "flight path," hide it or use a lower-tier typography scale.
*   **DON'T** use "Default Blue" for links. All interactive accents must remain within the Lime and Emerald spectrum.