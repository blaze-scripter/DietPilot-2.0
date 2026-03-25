/**
 * DietPilot 2.0 — IndexedDB Storage Service
 *
 * All user data lives here. The backend stores nothing.
 * Schema: profiles, daily_logs, weight_entries, reminders
 */

const DB_NAME = 'dietpilot';
const DB_VERSION = 2;

// ───── Open / Upgrade DB ─────────────────────────────────────────────────────
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('profiles')) {
        db.createObjectStore('profiles', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('daily_logs')) {
        const ls = db.createObjectStore('daily_logs', { keyPath: 'id', autoIncrement: true });
        ls.createIndex('date', 'date', { unique: false });
        ls.createIndex('profile_id', 'profile_id', { unique: false });
      }
      if (!db.objectStoreNames.contains('weight_entries')) {
        const ws = db.createObjectStore('weight_entries', { keyPath: 'id', autoIncrement: true });
        ws.createIndex('profile_id', 'profile_id', { unique: false });
        ws.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains('reminders')) {
        const rs = db.createObjectStore('reminders', { keyPath: 'id', autoIncrement: true });
        rs.createIndex('profile_id', 'profile_id', { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db: IDBDatabase, stores: string | string[], mode: IDBTransactionMode = 'readonly') {
  return db.transaction(stores, mode);
}

function getAll<T>(store: IDBObjectStore): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

function get<T>(store: IDBObjectStore, key: IDBValidKey): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

function getAllByIndex<T>(store: IDBObjectStore, indexName: string, value: IDBValidKey): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const req = store.index(indexName).getAll(value);
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

function put(store: IDBObjectStore, value: any): Promise<IDBValidKey> {
  return new Promise((resolve, reject) => {
    const req = store.put(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function del(store: IDBObjectStore, key: IDBValidKey): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function add(store: IDBObjectStore, value: any): Promise<IDBValidKey> {
  return new Promise((resolve, reject) => {
    const req = store.add(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ───── Helpers ───────────────────────────────────────────────────────────────
function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ───── BMR / TDEE / Macro Calculator ────────────────────────────────────────
const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};
const GOAL_ADJ: Record<string, number> = { lose_fat: -500, maintain: 0, bulk: 300 };
const MACRO_SPLITS: Record<string, { protein: number; carbs: number; fat: number }> = {
  lose_fat: { protein: 0.4, carbs: 0.3, fat: 0.3 },
  maintain: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  bulk: { protein: 0.3, carbs: 0.5, fat: 0.2 },
};
const MIN_CALORIES = 1200;

export function calculateTargets(form: any) {
  const { weight_kg, height_cm, age, gender, activity_level, goal } = form;
  const bmr =
    gender === 'female'
      ? 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
      : 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  const tdee = bmr * (ACTIVITY_MULTIPLIERS[activity_level] || 1.375);
  const rawCals = tdee + (GOAL_ADJ[goal] || 0);
  const calories = Math.max(Math.round(rawCals), MIN_CALORIES);
  const split = MACRO_SPLITS[goal] || MACRO_SPLITS.maintain;
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories,
    protein: Math.round((calories * split.protein) / 4),
    carbs: Math.round((calories * split.carbs) / 4),
    fat: Math.round((calories * split.fat) / 9),
  };
}

// ───── Profile API ───────────────────────────────────────────────────────────
export const profileStorage = {
  async get(): Promise<any | null> {
    const db = await openDB();
    const store = tx(db, 'profiles').objectStore('profiles');
    const all = await getAll<any>(store);
    return all[0] ?? null;
  },

  async save(data: any): Promise<any> {
    const db = await openDB();
    const now = new Date().toISOString();
    const existing = await this.get();
    const profile = existing
      ? { ...existing, ...data, updated_at: now }
      : { ...data, id: 1, created_at: now, updated_at: now };
    const t = tx(db, 'profiles', 'readwrite').objectStore('profiles');
    await put(t, profile);
    return profile;
  },

  async clear(): Promise<void> {
    const db = await openDB();
    const t = tx(db, 'profiles', 'readwrite').objectStore('profiles');
    const all = await getAll<any>(t);
    for (const p of all) await del(t, p.id);
  },
};

// ───── Daily Log API ─────────────────────────────────────────────────────────
async function getOrCreateLog(date: string, profileId = 1): Promise<any> {
  const db = await openDB();
  const store = tx(db, 'daily_logs').objectStore('daily_logs');
  const all = await getAllByIndex<any>(store, 'date', date);
  const existing = all.find((l) => l.profile_id === profileId);
  if (existing) return existing;
  // Create new empty log
  const profile = await profileStorage.get();
  const targets = profile?.targets || {};
  const newLog = {
    date,
    profile_id: profileId,
    target_calories: targets.calories || 2000,
    target_protein_g: targets.protein || 120,
    target_carbs_g: targets.carbs || 200,
    target_fat_g: targets.fat || 55,
    meals: [
      { id: uuid(), type: 'breakfast', time: '', foods: [] },
      { id: uuid(), type: 'lunch', time: '', foods: [] },
      { id: uuid(), type: 'snack', time: '', foods: [] },
      { id: uuid(), type: 'dinner', time: '', foods: [] },
    ],
    water_glasses: 0,
    water_target: 8,
  };
  const wdb = await openDB();
  const wt = tx(wdb, 'daily_logs', 'readwrite').objectStore('daily_logs');
  const id = await add(wt, newLog);
  return { ...newLog, id };
}

export const dailyLogStorage = {
  async get(date = todayStr()): Promise<any> {
    return getOrCreateLog(date);
  },

  async updateWater(date: string, glasses: number): Promise<any> {
    const log = await getOrCreateLog(date);
    const updated = { ...log, water_glasses: glasses };
    const db = await openDB();
    const store = tx(db, 'daily_logs', 'readwrite').objectStore('daily_logs');
    await put(store, updated);
    return updated;
  },

  async addFood(date: string, mealType: string, food: any): Promise<any> {
    const log = await getOrCreateLog(date);
    const newFood = { ...food, id: uuid() };
    const meals = log.meals.map((m: any) =>
      m.type === mealType
        ? { ...m, foods: [...(m.foods || []), newFood], time: new Date().toTimeString().slice(0, 5) }
        : m
    );
    const updated = { ...log, meals };
    const db = await openDB();
    const store = tx(db, 'daily_logs', 'readwrite').objectStore('daily_logs');
    await put(store, updated);
    return updated;
  },

  async removeFood(date: string, mealType: string, foodId: string): Promise<any> {
    const log = await getOrCreateLog(date);
    const meals = log.meals.map((m: any) =>
      m.type === mealType ? { ...m, foods: (m.foods || []).filter((f: any) => f.id !== foodId) } : m
    );
    const updated = { ...log, meals };
    const db = await openDB();
    const store = tx(db, 'daily_logs', 'readwrite').objectStore('daily_logs');
    await put(store, updated);
    return updated;
  },

  async moveFood(date: string, foodId: string, fromMeal: string, toMeal: string): Promise<any> {
    const log = await getOrCreateLog(date);
    const fromSlot = log.meals.find((m: any) => m.type === fromMeal);
    const food = fromSlot?.foods?.find((f: any) => f.id === foodId);
    if (!food) return log;
    const meals = log.meals.map((m: any) => {
      if (m.type === fromMeal) return { ...m, foods: m.foods.filter((f: any) => f.id !== foodId) };
      if (m.type === toMeal) return { ...m, foods: [...m.foods, { ...food, id: uuid() }] };
      return m;
    });
    const updated = { ...log, meals };
    const db = await openDB();
    const store = tx(db, 'daily_logs', 'readwrite').objectStore('daily_logs');
    await put(store, updated);
    return updated;
  },

  async getRange(dates: string[]): Promise<any[]> {
    return Promise.all(dates.map((d) => this.get(d)));
  },
};

// ───── Weight Entries API ────────────────────────────────────────────────────
export const weightStorage = {
  async list(): Promise<any[]> {
    const db = await openDB();
    const store = tx(db, 'weight_entries').objectStore('weight_entries');
    const all = await getAll<any>(store);
    return all.sort((a, b) => a.date.localeCompare(b.date));
  },

  async add(data: { date: string; weight_kg: number; note?: string }): Promise<any> {
    const db = await openDB();
    const store = tx(db, 'weight_entries', 'readwrite').objectStore('weight_entries');
    const entry = { ...data, profile_id: 1 };
    const id = await add(store, entry);
    return { ...entry, id };
  },
};

// ───── Reminders API ────────────────────────────────────────────────────────
export const reminderStorage = {
  async list(): Promise<any[]> {
    const db = await openDB();
    const store = tx(db, 'reminders').objectStore('reminders');
    return getAll<any>(store);
  },

  async create(data: any): Promise<any> {
    const db = await openDB();
    const store = tx(db, 'reminders', 'readwrite').objectStore('reminders');
    const reminder = { ...data, profile_id: 1, enabled: true };
    const id = await add(store, reminder);
    return { ...reminder, id };
  },

  async update(id: number, data: any): Promise<any> {
    const db = await openDB();
    const store = tx(db, 'reminders', 'readwrite').objectStore('reminders');
    const existing = await get<any>(store, id);
    if (!existing) throw new Error('Reminder not found');
    const updated = { ...existing, ...data };
    await put(store, updated);
    return updated;
  },

  async delete(id: number): Promise<void> {
    const db = await openDB();
    const store = tx(db, 'reminders', 'readwrite').objectStore('reminders');
    await del(store, id);
  },
};

// ───── Clear All Data ────────────────────────────────────────────────────────
export async function clearAllData(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
