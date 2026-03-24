// ===== API BASE =====
const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || 'API request failed');
  }
  return res.json();
}

// ===== PROFILE =====
export const profileApi = {
  get: () => request<any>('/profile'),
  create: (data: any) => request<any>('/profile', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) => request<any>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// ===== DAILY LOG =====
export const dailyLogApi = {
  get: (date?: string) => request<any>(`/daily-log${date ? `/${date}` : ''}`),
  addFood: (date: string, data: { meal_type: string; food: any }) =>
    request<any>(`/daily-log/${date}/meals`, { method: 'POST', body: JSON.stringify(data) }),
  removeFood: (date: string, mealId: string, foodId: string) =>
    request<any>(`/daily-log/${date}/meals/${mealId}/foods/${foodId}`, { method: 'DELETE' }),
  moveFood: (date: string, data: { food_id: string; from_meal_type: string; to_meal_type: string }) =>
    request<any>(`/daily-log/${date}/meals/move`, { method: 'PUT', body: JSON.stringify(data) }),
  updateWater: (date: string, glasses: number) =>
    request<any>(`/daily-log/${date}/water`, { method: 'PUT', body: JSON.stringify({ glasses }) }),
};

// ===== FOODS =====
export const foodsApi = {
  search: (query: string) => request<any[]>(`/foods/search?q=${encodeURIComponent(query)}`),
  suggestions: (mealType?: string) =>
    request<any[]>(`/foods/suggestions${mealType ? `?meal_type=${mealType}` : ''}`),
};

// ===== EXERCISES =====
export const exercisesApi = {
  getAll: (category?: string, difficulty?: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (difficulty) params.set('difficulty', difficulty);
    const qs = params.toString();
    return request<any[]>(`/exercises${qs ? `?${qs}` : ''}`);
  },
};

// ===== REMINDERS =====
export const remindersApi = {
  list: () => request<any[]>('/reminders'),
  create: (data: any) => request<any>('/reminders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<any>(`/reminders/${id}`, { method: 'DELETE' }),
};

// ===== WEIGHT =====
export const weightApi = {
  list: () => request<any[]>('/weight-entries'),
  add: (data: { date: string; weight_kg: number; note?: string }) =>
    request<any>('/weight-entries', { method: 'POST', body: JSON.stringify(data) }),
};

// ===== HEALTH TIPS =====
export const healthApi = {
  getTips: (condition: string) => request<any[]>(`/health-tips/${condition}`),
};

// ===== TARGETS =====
export const targetsApi = {
  calculate: (data: any) => request<any>('/calculate-targets', { method: 'POST', body: JSON.stringify(data) }),
};
