import { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/main';
import { dailyLogApi, healthApi } from '@/services/api';
<<<<<<< Updated upstream
import { Droplets, Plus, Minus, ChevronRight, Heart, Dumbbell } from 'lucide-react';
=======
>>>>>>> Stashed changes

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
          if (tips) allTips.push(...tips);
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

<<<<<<< Updated upstream
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
=======
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // ===== CALORIE RING SVG =====
  const ringSize = 140;
  const ringStroke = 14;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (calPct / 100) * ringCirc;

  return (
    <div className="page-container relative">
      {/* Decorative Blob */}
      <div className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] bg-primary-container/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-[20%] left-[-10%] w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4 animate-slideUp">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1 font-display">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-foreground leading-none">
            Hi, {profile?.name?.split(' ')[0] || 'Pilot'} 👋
          </h1>
        </div>
        <div className="w-12 h-12 rounded-full bg-surface-container-high border-2 border-white shadow-sm overflow-hidden flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/profile')}>
          <span className="material-symbols-outlined text-muted" style={{ fontSize: 28 }}>person</span>
        </div>
      </div>

      {/* Calorie Ring Card */}
      <div className="glass-card-stitch p-6 mb-6 animate-slideUp" style={{ animationDelay: '0.05s', borderRadius: 24 }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display font-bold text-lg">Daily Summary</h2>
          <div className="badge badge-lime">{profile?.goal?.replace('_', ' ') || 'Goal'}</div>
        </div>
        
        <div className="flex items-center gap-6 mt-4">
          <div className="relative flex-shrink-0 animate-scaleIn">
            <svg width={ringSize} height={ringSize} style={{ filter: 'drop-shadow(0px 4px 8px rgba(163, 230, 53, 0.3))' }}>
              <circle cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none" stroke="var(--surface-container)" strokeWidth={ringStroke} />
              <circle
                cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none"
                stroke="url(#calGrad)" strokeWidth={ringStroke} strokeLinecap="round"
                strokeDasharray={ringCirc} strokeDashoffset={ringOffset}
                transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              <defs>
                <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-container)" />
                  <stop offset="100%" stopColor="var(--primary)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-display font-extrabold text-foreground">{Math.round(totals.calories)}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted mt-1">/ {targets.calories} kcal</span>
>>>>>>> Stashed changes
            </div>
          </div>
        </div>

<<<<<<< Updated upstream
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
=======
          <div className="flex-1 space-y-4">
            {[
              { label: 'Protein', value: totals.protein, target: targets.protein, unit: 'g', color: '#ef4444', bg: '#fee2e2' },
              { label: 'Carbs', value: totals.carbs, target: targets.carbs, unit: 'g', color: '#3b82f6', bg: '#dbeafe' },
              { label: 'Fat', value: totals.fat, target: targets.fat, unit: 'g', color: '#f59e0b', bg: '#fef3c7' },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs font-bold font-display mb-1.5">
                  <span>{m.label}</span>
                  <span className="text-muted">{Math.round(m.value)} <span className="text-[9px] font-medium uppercase tracking-wider">/ {m.target}{m.unit}</span></span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: m.bg }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min((m.value / m.target) * 100, 100)}%`,
                      background: m.color,
                      boxShadow: `0 0 8px ${m.color}80`
                    }}
                  />
                </div>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
      {/* Today's Meals */}
      <div className="mb-6 animate-slideUp stagger-children" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-display font-bold">Today's Meals</h2>
          <button
            onClick={() => navigate('/meals')}
            className="text-xs font-bold flex items-center gap-1 text-primary cursor-pointer hover:underline"
          >
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
                className="glass-card p-4 text-left border border-white/40 hover:scale-[1.02] active:scale-95 transition-all"
                style={{ borderRadius: 20 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: mealColors[slot] }} className="flex items-center justify-center">
                    <span className="material-symbols-outlined" style={{ color: 'var(--foreground)', fontVariationSettings: "'FILL' 1" }}>{mealIcons[slot]}</span>
                  </div>
                  <span className="text-sm font-display font-bold capitalize leading-tight">{slot}</span>
                </div>
                <div className="text-xl font-display font-extrabold">{Math.round(slotCals)}<span className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">kcal</span></div>
                <div className="text-[10px] font-semibold text-muted mt-1">{foods.length > 0 ? `${foods.length} items logged` : 'Tap to log'}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Water Tracker - Blue Theme */}
      <div className="glass-blue-card p-5 mb-6 animate-slideUp relative overflow-hidden" style={{ animationDelay: '0.15s', borderRadius: 24 }}>
        {/* Subtle Water Waves background */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #3b82f6, transparent)' }}></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500 text-white shadow-[0_8px_16px_rgba(59,130,246,0.3)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            </div>
            <div>
              <div className="text-sm font-display font-bold text-blue-900">Hydration</div>
              <div className="text-xs font-semibold text-blue-700/70">{waterGlasses} of {waterTarget} glasses</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-sm">
            <button onClick={() => handleWater(-1)} className="btn-icon w-8 h-8 rounded-xl bg-white text-blue-800 hover:bg-blue-50"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>remove</span></button>
            <span className="text-base font-display font-extrabold w-8 text-center text-blue-900">{waterGlasses}</span>
            <button onClick={() => handleWater(1)} className="btn-icon w-8 h-8 rounded-xl bg-blue-500 text-white hover:bg-blue-600 shadow-sm"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span></button>
          </div>
        </div>
        <div className="relative z-10 mt-4 h-2.5 bg-white/40 rounded-full overflow-hidden border border-white/20">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min((waterGlasses / waterTarget) * 100, 100)}%`, background: 'linear-gradient(90deg, #60a5fa, #3b82f6)' }}
          />
        </div>
      </div>

      {/* Workout CTA - Dark Theme */}
      <div
        className="animate-slideUp relative overflow-hidden group cursor-pointer"
        style={{ animationDelay: '0.2s', borderRadius: 24, background: '#1a1c1c', boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}
        onClick={() => navigate('/workouts')}
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        
        <div className="p-6 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 text-primary-container border border-white/10">
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>fitness_center</span>
            </div>
            <div>
              <div className="text-sm font-display font-bold text-white mb-0.5">Training Center</div>
              <div className="text-xs font-medium text-white/60 flex items-center gap-1">
                Explore guided workouts <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-[0_0_16px_rgba(163,230,53,0.3)] group-hover:scale-110 transition-transform">
             <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 700" }}>play_arrow</span>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      {healthTips.length > 0 && (
        <div className="mt-6 mb-4 animate-slideUp" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-display font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> 
              Health Guidelines
            </h2>
            <button onClick={() => navigate('/health-conditions')} className="text-xs font-bold text-primary hover:underline">
              See All
            </button>
          </div>
          <div className="space-y-3 stagger-children">
            {healthTips.slice(0, 2).map((tip, i) => (
              <div key={i} className="glass-card p-4 flex items-start gap-4" style={{ borderRadius: 20 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: tip.type === 'dont' ? '#fee2e2' : '#d1fae5',
                  color: tip.type === 'dont' ? '#ef4444' : '#10b981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}>
                    {tip.type === 'dont' ? 'block' : 'check_circle'}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-display font-bold leading-tight mb-1">{tip.title}</div>
                  <div className="text-xs text-muted leading-relaxed font-medium">{tip.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
>>>>>>> Stashed changes
    </div>
  );
}
