/**
 * DietPilot 2.0 — API Service Layer
 *
 * - User data (profile, logs, weight, reminders) → IndexedDB via storage.ts
 * - Food search → Flask /api/food (USDA proxy)
 * - Exercise search → Flask /api/exercises (Wger proxy)
 */

import {
  profileStorage,
  dailyLogStorage,
  weightStorage,
  reminderStorage,
  calculateTargets,
} from './storage';

// ── Flask proxy base URL (food + exercises only) ─────────────────────────────
const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '';
const FLASK_BASE = `${BASE_URL}/api`;

async function flaskGet<T>(path: string): Promise<T> {
  const res = await fetch(`${FLASK_BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// ── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
  get: () => profileStorage.get().then((p) => { if (!p) throw new Error('No profile'); return p; }),
  create: (data: any) => {
    const targets = calculateTargets(data);
    return profileStorage.save({ ...data, targets });
  },
  update: (data: any) => {
    const targets = calculateTargets(data);
    return profileStorage.save({ ...data, targets });
  },
};

// ── Daily Log ─────────────────────────────────────────────────────────────────
export const dailyLogApi = {
  get: (date?: string) => dailyLogStorage.get(date),
  addFood: (_date: string, data: { meal_type: string; food: any }) =>
    dailyLogStorage.addFood(_date, data.meal_type, data.food),
  removeFood: (date: string, mealType: string, foodId: string) =>
    dailyLogStorage.removeFood(date, mealType, foodId),
  moveFood: (date: string, data: { food_id: string; from_meal_type: string; to_meal_type: string }) =>
    dailyLogStorage.moveFood(date, data.food_id, data.from_meal_type, data.to_meal_type),
  updateWater: (date: string, glasses: number) => dailyLogStorage.updateWater(date, glasses),
  getRange: (dates: string[]) => dailyLogStorage.getRange(dates),
};

// ── Foods (USDA via Flask + Indian Food Library) ─────────────────────────────
import { searchIndianFoods } from '@/data/indianFoods';

export const foodsApi = {
  search: async (query: string): Promise<any[]> => {
    // Search local Indian food DB first (instant)
    const indianResults = searchIndianFoods(query).map((f) => ({
      name: f.name,
      servingSize: f.serving_size,
      servingUnit: f.serving_unit,
      serving_size: f.serving_size,
      serving_unit: f.serving_unit,
      calories: f.calories,
      protein: f.protein_g,
      protein_g: f.protein_g,
      carbs: f.carbs_g,
      carbs_g: f.carbs_g,
      fat: f.fat_g,
      fat_g: f.fat_g,
      source: 'indian',
      category: f.category,
    }));

    // Try USDA search in parallel (may fail if backend is down)
    let usdaResults: any[] = [];
    try {
      usdaResults = await flaskGet<any[]>(`/food?query=${encodeURIComponent(query)}`);
    } catch {
      // USDA unavailable — still return Indian results
    }

    // Indian results first, then USDA
    return [...indianResults, ...usdaResults];
  },
};

// ── Exercises (Wger via Flask) ───────────────────────────────────────────────
export const exercisesApi = {
  getAll: (category?: string, _difficulty?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    const qs = params.toString();
    return flaskGet<any[]>(`/exercises${qs ? `?${qs}` : ''}`);
  },
};

// ── Reminders ────────────────────────────────────────────────────────────────
export const remindersApi = {
  list: () => reminderStorage.list(),
  create: (data: any) => reminderStorage.create(data),
  update: (id: number, data: any) => reminderStorage.update(id, data),
  delete: (id: number) => reminderStorage.delete(id),
};

// ── Weight ───────────────────────────────────────────────────────────────────
export const weightApi = {
  list: () => weightStorage.list(),
  add: (data: { date: string; weight_kg: number; note?: string }) => weightStorage.add(data),
};

// ── Targets (now computed client-side) ───────────────────────────────────────
export const targetsApi = {
  calculate: (data: any) => Promise.resolve(calculateTargets(data)),
};

// ── Health Tips (removed: backend gone; keep stub for compatibility) ──────────
export const healthApi = {
  getTips: (_condition: string): Promise<any[]> => Promise.resolve([]),
};
