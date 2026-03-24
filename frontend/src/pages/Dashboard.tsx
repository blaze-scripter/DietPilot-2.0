import { useMemo, useState, useEffect } from 'react';
import { useApp } from '@/main';
import { dailyLogApi, healthApi } from '@/services/api';
import { Droplets, Plus, Minus, ChevronRight, Heart, Dumbbell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function Dashboard() {
  const { profile, dailyLog, refreshLog, navigate } = useApp();
  const [healthTips, setHealthTips] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Load health tips
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

  // ===== COMPUTED VALUES =====
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
    const today = new Date().toISOString().split('T')[0];
    try {
      await dailyLogApi.updateWater(today, newVal);
      await refreshLog();
      if (delta > 0) showToast('💧 +1 glass of water!');
    } catch { /* ignore */ }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // ===== CALORIE RING SVG =====
  const ringSize = 160;
  const ringStroke = 12;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (calPct / 100) * ringCirc;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fadeIn">
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},</p>
          <h1 className="text-2xl font-extrabold tracking-tight">{profile?.name || 'User'} 👋</h1>
        </div>
        <div className="badge badge-lime">
          <span className="text-xs">🎯</span> {profile?.goal?.replace('_', ' ') || 'Goal'}
        </div>
      </div>

      {/* Calorie Ring */}
      <div className="glass-card p-6 mb-4 animate-slideUp" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width={ringSize} height={ringSize}>
              <circle cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none" stroke="#f3f4f6" strokeWidth={ringStroke} />
              <circle
                cx={ringSize / 2} cy={ringSize / 2} r={ringRadius} fill="none"
                stroke="url(#calGrad)" strokeWidth={ringStroke} strokeLinecap="round"
                strokeDasharray={ringCirc} strokeDashoffset={ringOffset}
                transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <defs>
                <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a3e635" />
                  <stop offset="100%" stopColor="#84cc16" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold">{Math.round(totals.calories)}</span>
              <span className="text-[10px] font-medium" style={{ color: 'var(--muted)' }}>/ {targets.calories} kcal</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {[
              { label: 'Protein', value: totals.protein, target: targets.protein, unit: 'g', color: '#ef4444' },
              { label: 'Carbs', value: totals.carbs, target: targets.carbs, unit: 'g', color: '#3b82f6' },
              { label: 'Fat', value: totals.fat, target: targets.fat, unit: 'g', color: '#f59e0b' },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>{m.label}</span>
                  <span style={{ color: 'var(--muted)' }}>{Math.round(m.value)}/{m.target}{m.unit}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((m.value / m.target) * 100, 100)}%`,
                      background: m.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="mb-4 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Today's Meals</h2>
          <button
            onClick={() => navigate('/meals')}
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: 'var(--primary-dark)' }}
          >
            View All <ChevronRight size={14} />
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
                className="glass-card-flat p-4 text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{mealEmojis[slot]}</span>
                  <span className="text-xs font-bold capitalize">{slot}</span>
                </div>
                <div className="text-lg font-extrabold">{Math.round(slotCals)}<span className="text-xs font-medium ml-0.5" style={{ color: 'var(--muted)' }}>kcal</span></div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>{foods.length} item{foods.length !== 1 ? 's' : ''}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Water Tracker */}
      <div className="glass-card p-5 mb-4 animate-slideUp" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#dbeafe' }}>
              <Droplets size={20} className="text-blue-500" />
            </div>
            <div>
              <div className="text-sm font-bold">Water Intake</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{waterGlasses} / {waterTarget} glasses</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleWater(-1)} className="btn-icon w-8 h-8 rounded-lg"><Minus size={16} /></button>
            <span className="text-lg font-extrabold w-8 text-center">{waterGlasses}</span>
            <button onClick={() => handleWater(1)} className="btn-icon w-8 h-8 rounded-lg" style={{ background: 'var(--primary-soft)' }}><Plus size={16} /></button>
          </div>
        </div>
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((waterGlasses / waterTarget) * 100, 100)}%`, background: '#3b82f6' }}
          />
        </div>
      </div>

      {/* Health Tips */}
      {healthTips.length > 0 && (
        <div className="mb-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold flex items-center gap-2"><Heart size={16} /> Health Tips</h2>
            <button onClick={() => navigate('/health-conditions')} className="text-xs font-semibold" style={{ color: 'var(--primary-dark)' }}>
              See All <ChevronRight size={14} className="inline" />
            </button>
          </div>
          <div className="space-y-2">
            {healthTips.slice(0, 2).map((tip, i) => (
              <div key={i} className="glass-card-flat p-4 flex items-start gap-3">
                <span className="text-xl">{tip.icon || (tip.type === 'dont' ? '⚠️' : '💡')}</span>
                <div>
                  <div className="text-xs font-bold">{tip.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{tip.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout CTA */}
      <div
        className="glass-card p-5 animate-slideUp"
        style={{ animationDelay: '0.25s', background: 'linear-gradient(135deg, #1f2937, #374151)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(163, 230, 53, 0.2)' }}>
              <Dumbbell size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Today's Workout</div>
              <div className="text-xs text-gray-400">Browse exercises →</div>
            </div>
          </div>
          <button onClick={() => navigate('/workouts')} className="btn-primary py-2 px-4 text-xs">Go</button>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
