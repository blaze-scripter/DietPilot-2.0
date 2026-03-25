import { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/main';
import { dailyLogApi } from '@/services/api';

export default function Dashboard() {
  const { profile, dailyLog, refreshLog, navigate } = useApp();
  const [toast, setToast] = useState<string | null>(null);

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
  const mealIcons: Record<string, string> = { breakfast: 'bakery_dining', lunch: 'lunch_dining', snack: 'icecream', dinner: 'restaurant' };
  const mealColors: Record<string, string> = { breakfast: '#fef3c7', lunch: '#e0f2fe', snack: '#fce7f3', dinner: '#ecfccb' };

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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Calorie ring SVG
  const ringSize = 148;
  const ringStroke = 13;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (calPct / 100) * ringCirc;

  return (
    <div className="page-container relative" style={{ paddingTop: 0 }}>
      {/* Glassmorphic Header */}
      <div
        className="sticky top-0 z-30 px-4 pt-10 pb-4 mb-4"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderBottom: '1px solid rgba(194,202,176,0.15)',
          borderRadius: '0 0 2rem 2rem',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight font-headline text-on-surface leading-none">
              Hi, {profile?.name?.split(' ')[0] || 'Pilot'} 👋
            </h1>
          </div>
          {/* Search bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 cursor-pointer"
            onClick={() => navigate('/meals')}
            style={{
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(12px)',
              borderRadius: '999px',
              border: '1px solid rgba(194,202,176,0.2)',
            }}
          >
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>search</span>
            <span className="text-sm font-medium text-on-surface-variant">Log food</span>
          </div>
        </div>
      </div>

      {/* Calorie Ring Card */}
      <div className="mx-4 mb-5 animate-slideUp">
        <div
          className="p-5"
          style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            boxShadow: '0 30px 60px -12px rgba(45,47,47,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-headline font-bold text-lg text-on-surface">Daily Summary</h2>
            <div
              className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ background: '#ecfccb', color: '#416400', borderRadius: '999px' }}
            >
              {profile?.goal?.replace('_', ' ') || 'Goal'}
            </div>
          </div>

          <div className="flex items-center gap-5 mt-4">
            {/* SVG Ring */}
            <div className="relative flex-shrink-0 animate-scaleIn">
              <svg width={ringSize} height={ringSize} style={{ filter: 'drop-shadow(0px 4px 12px rgba(163, 230, 53, 0.25))' }}>
                <circle cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none" stroke="#eeeeee" strokeWidth={ringStroke} />
                <circle
                  cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none"
                  stroke="url(#calGrad2)" strokeWidth={ringStroke} strokeLinecap="round"
                  strokeDasharray={ringCirc} strokeDashoffset={ringOffset}
                  transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
                <defs>
                  <linearGradient id="calGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a3e635" />
                    <stop offset="100%" stopColor="#446900" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold font-headline text-on-surface">{Math.round(totals.calories)}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant mt-0.5">/ {targets.calories} kcal</span>
              </div>
            </div>

            {/* Macro bars */}
            <div className="flex-1 space-y-3.5">
              {[
                { label: 'Protein', value: totals.protein, target: targets.protein, unit: 'g', color: '#ef4444', bg: '#fee2e2' },
                { label: 'Carbs', value: totals.carbs, target: targets.carbs, unit: 'g', color: '#3b82f6', bg: '#dbeafe' },
                { label: 'Fat', value: totals.fat, target: targets.fat, unit: 'g', color: '#f59e0b', bg: '#fef3c7' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-on-surface">{m.label}</span>
                    <span className="text-on-surface-variant">{Math.round(m.value)}<span className="text-[9px] font-medium ml-0.5">/ {m.target}{m.unit}</span></span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: m.bg }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min((m.value / m.target) * 100, 100)}%`, background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="px-4 mb-5 animate-slideUp" style={{ animationDelay: '0.08s' }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-headline font-bold text-on-surface">Today's Meals</h2>
          <button onClick={() => navigate('/meals')} className="text-xs font-bold flex items-center gap-0.5 text-primary">
            Log Food <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {mealSlots.map((slot) => {
            const foods = getMealFoods(slot);
            const slotCals = foods.reduce((s: number, f: any) => s + (f.calories || 0), 0);
            return (
              <button
                key={slot}
                onClick={() => navigate('/meals', { state: { selectedMealType: slot } })}
                className="text-left hover:scale-[1.02] active:scale-95 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '1.25rem',
                  padding: '1rem',
                  boxShadow: '0 4px 16px rgba(45,47,47,0.06)',
                  border: '1px solid rgba(194,202,176,0.15)',
                }}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: mealColors[slot] }} className="flex items-center justify-center">
                    <span className="material-symbols-outlined" style={{ color: '#1a1c1c', fontVariationSettings: "'FILL' 1", fontSize: 20 }}>{mealIcons[slot]}</span>
                  </div>
                  <span className="text-sm font-headline font-bold capitalize text-on-surface">{slot}</span>
                </div>
                <div className="text-xl font-extrabold font-headline text-on-surface">{Math.round(slotCals)}<span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">kcal</span></div>
                <div className="text-[10px] font-semibold text-on-surface-variant mt-1">{foods.length > 0 ? `${foods.length} items` : 'Tap to log'}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hydration Card */}
      <div
        className="mx-4 mb-5 p-5 animate-slideUp"
        style={{
          animationDelay: '0.12s',
          borderRadius: '1.5rem',
          background: 'rgba(59,130,246,0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59,130,246,0.1)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#3b82f6', boxShadow: '0 8px 16px rgba(59,130,246,0.3)' }}>
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            </div>
            <div>
              <div className="text-sm font-headline font-bold text-blue-900">Hydration</div>
              <div className="text-xs font-semibold" style={{ color: 'rgba(30,58,138,0.7)' }}>{waterGlasses} of {waterTarget} glasses</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/60">
            <button onClick={() => handleWater(-1)} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-blue-800"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>remove</span></button>
            <span className="text-base font-extrabold font-headline w-7 text-center text-blue-900">{waterGlasses}</span>
            <button onClick={() => handleWater(1)} className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span></button>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min((waterGlasses / waterTarget) * 100, 100)}%`, background: 'linear-gradient(90deg, #60a5fa, #3b82f6)' }}
          />
        </div>
      </div>

      {/* Workout CTA */}
      <div
        className="mx-4 mb-5 animate-slideUp cursor-pointer group"
        style={{
          animationDelay: '0.16s',
          borderRadius: '1.5rem',
          background: '#2f3131',
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
        onClick={() => navigate('/workouts')}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-primary-container" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26 }}>fitness_center</span>
            </div>
            <div>
              <div className="text-sm font-headline font-bold text-white mb-0.5">Training Center</div>
              <div className="text-xs font-medium text-white/60 flex items-center gap-1">Explore guided workouts <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span></div>
            </div>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-primary-container group-hover:scale-110 transition-transform"
            style={{ background: '#a3e635', boxShadow: '0 0 16px rgba(163,230,53,0.3)' }}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 700" }}>play_arrow</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
