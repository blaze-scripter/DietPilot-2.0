
# Track Bite — Premium Mobile UI Overhaul

## Overview
Rebuild the frontend as a premium mobile-first fitness/nutrition app matching the Stitch "veridian glass" design system. Uses mock data throughout (no backend). Three priority screens: Dashboard, Welcome/Onboarding, and Weekly Stats.

## Design System Setup
- **Primary color**: Lime/Green (`#a3e635`) with gradient variants
- **Glassmorphism tokens**: `bg-white/70 backdrop-blur-md border border-white/50 shadow-sm` as reusable utility classes
- **Background**: Soft off-white (`#f5f5f0`) with subtle gradient overlays
- **Typography**: Clean, iOS-style with semibold headings and regular body text
- **Safe-area insets**: `pt-[max(env(safe-area-inset-top),2.5rem)]` and `pb-[max(env(safe-area-inset-bottom),5rem)]` on all page wrappers
- **Border radius**: Generous rounding (`rounded-2xl`, `rounded-3xl`) for cards

## Screen 1: Welcome / Onboarding Flow
- **Welcome screen**: Full-screen hero with app name "Track Bite", tagline, lime-green CTA button, clean illustration/icon
- **Basics Profile step**: Glass card with name, age, gender, height/weight inputs styled as pill-shaped fields
- **Health Info step**: Glass card with health conditions checklist, toggle switches, lime-green accent highlights
- Multi-step progress indicator (dots or segmented bar) at top
- Route: `/onboarding` with step-based state management

## Screen 2: Dashboard (`/`)
- **Top section**: Greeting ("Good Morning, [Name]"), date display
- **Calorie Ring**: Large circular SVG donut chart showing consumed vs. goal calories, centered number
- **Macro Bars**: Three horizontal progress bars (Protein, Carbs, Fat) with green gradient fills inside glass cards
- **Meal Summary Cards**: Horizontally scrollable cards (Breakfast, Lunch, Dinner, Snack) with Unsplash food images, calorie count per meal
- **Quick Action FAB**: Floating "+" button (lime-green) for adding meals

## Screen 3: Weekly Stats (`/stats`)
- **Header**: "Weekly Stats" with date range selector
- **Main chart area**: Bar chart or line chart showing daily calorie intake (7 days) built with SVG/CSS
- **Summary cards row**: Glass cards showing averages (Avg Calories, Avg Protein, Streak days)
- **Breakdown section**: Macro distribution donut chart with legend

## Layout & Navigation
- **Bottom Navigation Bar**: 4 tabs (Dashboard, Meals, Stats, Profile) with lime-green active indicator, glass background, safe-area bottom padding
- **DashboardLayout wrapper**: Applies safe-area insets, background color, and renders bottom nav
- All pages wrapped in this layout

## Mock Data Layer
- Create `src/data/mockData.ts` with sample user profile, daily meals, weekly stats, macro targets
- All components read from this mock data (easy to swap for real API later)

## File Structure
```
src/
  components/
    layout/BottomNav.tsx
    layout/DashboardLayout.tsx
    dashboard/CalorieRing.tsx
    dashboard/MacroBar.tsx
    dashboard/MealCard.tsx
    stats/WeeklyChart.tsx
    stats/MacroDonut.tsx
    onboarding/OnboardingStep.tsx
  pages/
    Index.tsx (Dashboard)
    Stats.tsx
    Onboarding.tsx
  data/mockData.ts
```

## Key Technical Notes
- All data visualization (rings, charts, bars) built with pure SVG + Tailwind — no charting library needed
- Mobile-first: designed at 390px width, responsive up
- Smooth transitions between onboarding steps with CSS animations
- Glass card component reused across all screens for consistency
