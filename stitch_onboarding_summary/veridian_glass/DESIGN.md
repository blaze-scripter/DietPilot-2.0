# Design System Document

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"Luminous Vitality."** It is an editorial-inspired, high-performance interface that rejects the static nature of traditional grids in favor of a layered, breathable, and hyper-modern aesthetic. By combining pure white space with the ethereal depth of glassmorphism, we create an environment that feels both scientifically precise and organically inviting.

The core philosophy is **Intentional Translucency**. We move beyond standard UI by treating the interface as a physical stack of frosted lenses. This creates a signature "High-End Editorial" look through heavy-weight typography (Plus Jakarta Sans), high-contrast black ink on white paper, and vibrant lime accents that signal progress and growth.

---

## 2. Colors
Our color palette is rooted in high-contrast neutrality, punctuated by specialized functional accents.

### Core Palette
*   **Surface (Pure Canvas):** `#ffffff` (Background) / `#f9f9f9` (Surface Bright). The background is always pure and expansive.
*   **Typography (Ink):** `#1a1c1c` (On-Surface). High contrast is non-negotiable for that editorial feel.
*   **Primary (Vitality Lime):** `#a3e635` (Primary Container) / `#446900` (Primary). Reserved strictly for goals, progress indicators, and successful completion states.
*   **Secondary (Hydration Blue):** `#3b82f6` (Secondary). This color is isolated and used **only** for water intake and hydration-related elements to provide instant semantic recognition.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined through:
1.  **Tonal Shifts:** Placing a `surface-container-low` card on a `surface` background.
2.  **Negative Space:** Utilizing our spacing scale (e.g., `8` or `10`) to create "visual gutters."

### The "Glass & Gradient" Rule
To achieve professional polish, main CTAs and progress bars should utilize subtle gradients (e.g., `primary` to `primary-container`). Floating navigation bars and search bars must use Glassmorphism:
*   **Fills:** Semi-transparent white (`#ffffff` at 60-80% opacity).
*   **Effect:** `backdrop-blur` (20px-40px).
*   **Border:** See "Ghost Borders" in the Elevation section.

---

## 3. Typography
We use **Plus Jakarta Sans** as our sole typeface. It provides a geometric yet friendly personality that aligns with health and wellness.

*   **Display (Lg/Md):** 3.5rem / 2.75rem. Used for massive, unapologetic hero numbers (e.g., daily calorie totals). Bold weight only.
*   **Headline (Lg/Md):** 2rem / 1.75rem. Used for section titles. High contrast against body text.
*   **Title (Md/Sm):** 1.125rem / 1rem. Used for card headers and primary navigation labels.
*   **Body (Lg/Md):** 1rem / 0.875rem. Used for descriptions and secondary data points.
*   **Label (Md):** 0.75rem. Used for metadata and overlines.

**Editorial Style Note:** Always lean into larger-than-standard font sizes for primary data. If a user has completed 68% of a goal, that "68%" should be a `Display-Lg` element, asserting dominance over the layout.

---

## 4. Elevation & Depth
We eschew traditional drop shadows for **Tonal Layering** and **Ambient Depth**.

### The Layering Principle
Depth is achieved by stacking `surface-container` tiers. 
*   **Level 0:** `surface` (The pure white base).
*   **Level 1:** `surface-container-low` (Nested sections or background groups).
*   **Level 2:** `surface-container-lowest` (Floating cards with subtle glass effects).

### Ambient Shadows
Shadows should never look like "black glows." They must be:
*   **Color:** A tinted version of `on-surface` (e.g., `#1a1c1c` at 4-6% opacity).
*   **Blur:** Extra-large (30px - 60px) to simulate natural, soft ambient light.

### The "Ghost Border"
When a container requires a boundary for accessibility, use a **Ghost Border**: the `outline-variant` token at 15% opacity. It should feel like a whisper of a line, not a structural cage.

---

## 5. Components

### Navigation & Search Bars
Floating elements at the top or bottom of the screen must utilize the **Glassmorphism** spec. Use `xl` (3rem) rounding to create a "pill" aesthetic that feels soft to the touch. The profile avatar should be integrated into the right-hand side of the header glass bar.

### Buttons
*   **Primary:** `primary-container` fill with `on-primary-container` text. High roundness (`full`). No shadow, or a very soft ambient shadow.
*   **Tertiary:** Transparent background with `plusJakartaSans` Bold text. Used for "See All" or "Cancel" actions.

### Cards & Progress
*   **Goal Cards:** Utilize a `surface-container-low` background. Use the Vitality Lime (`#a3e635`) for the progress arc or bar.
*   **Hydration Cards:** Use the Hydration Blue (`#3b82f6`) exclusively for the water wave or droplet icons.
*   **Spacing over Lines:** Never use dividers within a card. Use a spacing of `3` or `4` to separate header text from content.

### Inputs
*   **Search Fields:** Glassmorphic fill, high roundness (`full`), with a subtle "Ghost Border." Placeholder text should be `body-md` in `on-surface-variant`.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. Let a progress ring overlap the edge of a card to create dynamic energy.
*   **Do** prioritize "white space as a feature." If the layout feels crowded, increase the spacing scale by two increments.
*   **Do** use high-quality imagery (e.g., fresh food) that peeks through glassmorphic overlays.

### Don't
*   **Don't** use 1px solid black borders. This kills the "Luminous" quality of the system.
*   **Don't** use Hydration Blue for anything other than water. It is a dedicated functional signifier.
*   **Don't** use small corner radii. Everything must be `lg` (2rem) or `xl` (3rem) to maintain the friendly, premium feel.
*   **Don't** use "Grey." Use the surface-container tiers to create depth without making the UI look muddy or "dirty."