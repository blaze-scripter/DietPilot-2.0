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

// ── Foods (USDA via Flask) ───────────────────────────────────────────────────
export const foodsApi = {
  search: (query: string) =>
    flaskGet<any[]>(`/food?query=${encodeURIComponent(query)}`),
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
