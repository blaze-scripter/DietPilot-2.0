import { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/main';
import { dailyLogApi, healthApi } from '@/services/api';
import { Droplets, Plus, Minus, ChevronRight, Heart, Dumbbell } from 'lucide-react';

export default function Dashboard() {
  const { profile, dailyLog, refreshLog, navigate } = useApp();
  const [healthTips, setHealthTips] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadTips() {
      if (!profile?.health_conditions?.length) return;
      try {
        const allTips: any[] = [];
        for (const c of profile.health_conditions) {
          const tips = await healthApi.getTips(c);
          allTips.push(...tips);
        }
        setHealthTips(allTips.slice(0, 4));
      } catch { /* ignore */ }
    }
    loadTips();
  }, [profile]);

  const totals = useMemo(() => {
    if (!dailyLog?.meals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return dailyLog.meals.reduce(
      (acc: any, meal: any) => {
        (meal.foods || []).forEach((f: any) => {
          acc.calories += f.calories || 0;
          acc.protein += f.protein_g || 0;
          acc.carbs += f.carbs_g || 0;
          acc.fat += f.fat_g || 0;
        });
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [dailyLog]);

  const targets = profile?.targets || { calories: 2000, protein: 120, carbs: 200, fat: 55 };
  const calPct = Math.min((totals.calories / targets.calories) * 100, 100);
  const waterGlasses = dailyLog?.water_glasses || 0;
  const waterTarget = dailyLog?.water_target || 8;

  const mealSlots = ['breakfast', 'lunch', 'snack', 'dinner'];
  const mealEmojis: Record<string, string> = { breakfast: '🌅', lunch: '☀️', snack: '🍿', dinner: '🌙' };

  const getMealFoods = (type: string) => {
    if (!dailyLog?.meals) return [];
    const meal = dailyLog.meals.find((m: any) => m.type === type);
    return meal?.foods || [];
  };

  const handleWater = async (delta: number) => {
    const newVal = Math.max(0, Math.min(waterGlasses + delta, 20));
    try {
      await dailyLogApi.updateWater(new Date().toISOString().split('T')[0], newVal);
      await refreshLog();
    } catch { /* ignore */ }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6 animate-fadeIn">
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Welcome,</p>
          <h1 className="text-2xl font-extrabold tracking-tight">{profile?.name || 'User'} 👋</h1>
        </div>
        <div className="badge badge-lime capitalize">
          {profile?.goal?.replace('_', ' ') || 'Goal'}
        </div>
      </div>

      <div className="glass-card p-6 mb-4 animate-slideUp">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
              <circle
                cx="80" cy="80" r="70" fill="transparent" stroke="var(--primary)"
                strokeWidth="12" strokeDasharray={440} strokeDashoffset={440 - (calPct / 100) * 440}
                strokeLinecap="round" className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold">{Math.round(totals.calories)}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">/ {targets.calories} kcal</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Prot', val: totals.protein, tgt: targets.protein, color: 'bg-red-400' },
            { label: 'Carb', val: totals.carbs, tgt: targets.carbs, color: 'bg-blue-400' },
            { label: 'Fat', val: totals.fat, tgt: targets.fat, color: 'bg-orange-400' },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-[10px] font-bold mb-1">
                <span>{m.label}</span>
                <span>{Math.round(m.val)}g</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${m.color}`}
                  style={{ width: `${Math.min((m.val / m.tgt) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold">Today's Meals</h2>
          <button onClick={() => navigate('/meals')} className="text-xs font-bold text-lime-600">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {mealSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => navigate('/meals', { state: { selectedMealType: slot } })}
              className="glass-card-flat p-4 text-left"
            >
              <div className="text-xl mb-1">{mealEmojis[slot]}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{slot}</div>
              <div className="text-lg font-extrabold">{Math.round(getMealFoods(slot).reduce((s, f) => s + f.calories, 0))} kcal</div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Droplets className="text-blue-500" />
          </div>
          <div>
            <div className="text-sm font-bold">Water</div>
            <div className="text-xs text-gray-400">{waterGlasses} / {waterTarget} glasses</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleWater(-1)} className="btn-icon">-</button>
          <button onClick={() => handleWater(1)} className="btn-icon">+</button>
        </div>
      </div>
    </div>
  );
}
