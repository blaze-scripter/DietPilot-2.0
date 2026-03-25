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
  const calRemaining = Math.max(targets.calories - totals.calories, 0);
  const waterGlasses = dailyLog?.water_glasses || 0;
  const waterTarget = dailyLog?.water_target || 8;
  const waterLiters = (waterGlasses * 0.25).toFixed(1);
  const waterTargetLiters = (waterTarget * 0.25).toFixed(1);

  const mealSlots = ['breakfast', 'lunch', 'snack', 'dinner'];
  const mealIcons: Record<string, string> = { breakfast: 'bakery_dining', lunch: 'lunch_dining', snack: 'icecream', dinner: 'restaurant' };

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

  // Calorie ring SVG — larger, center-stage
  const ringSize = 220;
  const ringStroke = 20;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (calPct / 100) * ringCirc;

  // Recent meals with Unsplash placeholder photos
  const recentMeals = [
    {
      label: 'Breakfast',
      name: 'Idli Sambhar',
      desc: '2 Idlis, 1 bowl Sambhar, Coconut Chutney',
      kcal: 320,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
    },
    {
      label: 'Lunch',
      name: 'Paneer Tikka Thali',
      desc: 'Grilled Paneer, 1 Roti, Dal Tadka, Salad',
      kcal: 680,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    },
    {
      label: 'Evening Snack',
      name: 'Roasted Chana',
      desc: 'Handful of roasted chickpeas with spices',
      kcal: 150,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=800&q=80',
    },
  ];

  // Compute actual recent meals from log data
  const actualMeals = useMemo(() => {
    if (!dailyLog?.meals || dailyLog.meals.length === 0) return null;
    return dailyLog.meals
      .filter((m: any) => m.foods && m.foods.length > 0)
      .map((m: any) => ({
        label: m.type.charAt(0).toUpperCase() + m.type.slice(1),
        name: m.foods[0]?.name || m.type,
        desc: m.foods.map((f: any) => f.name).join(', '),
        kcal: m.foods.reduce((s: number, f: any) => s + (f.calories || 0), 0),
      }));
  }, [dailyLog]);

  // Water filled/empty circles
  const waterFilled = Math.min(waterGlasses, 5);
  const waterEmpty = Math.max(5 - waterFilled, 0);

  return (
    <div className="page-container relative" style={{ paddingTop: 'env(safe-area-inset-top, 2.5rem)', paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Glassmorphic Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 h-20"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 24 }}>menu</span>
          <h1 className="text-2xl font-black tracking-tight font-headline text-on-surface">Track Bite</h1>
        </div>
        <div
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
          onClick={() => navigate('/profile')}
          style={{ border: '2px solid #a3e635' }}
        >
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #446900, #a3e635)' }}
          >
            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="px-6 pt-6 pb-2 animate-slideUp">
        <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">Daily Overview</p>
        <h2 className="text-[2rem] font-bold leading-snug font-headline text-on-surface">
          Your vitality is<br />
          <span style={{ color: '#a3e635' }}>climbing</span> today.
        </h2>

        {/* Quick Stat Pills */}
        <div className="flex gap-3 pt-5">
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '14px 18px', flex: 1, border: '1px solid rgba(194,202,176,0.15)' }}>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Steps</p>
            <p className="text-xl font-black font-headline text-on-surface tracking-tight">8,432</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '14px 18px', flex: 1, border: '1px solid rgba(194,202,176,0.15)' }}>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Burned</p>
            <p className="text-xl font-black font-headline text-on-surface tracking-tight">{Math.round(totals.calories * 0.3)} <span className="text-xs font-medium text-on-surface-variant">kcal</span></p>
          </div>
        </div>
      </div>

      {/* Large Calorie Ring — Center Stage */}
      <div className="flex justify-center py-6 animate-slideUp" style={{ animationDelay: '0.05s' }}>
        <div className="relative animate-scaleIn" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} style={{ filter: 'drop-shadow(0px 6px 20px rgba(163, 230, 53, 0.2))' }}>
            <circle
              cx={ringSize / 2} cy={ringSize / 2} r={ringRadius}
              fill="none" stroke="#eeeeee" strokeWidth={ringStroke}
            />
            <circle
              cx={ringSize / 2} cy={ringSize / 2} r={ringRadius}
              fill="none" stroke="url(#calGrad2)" strokeWidth={ringStroke}
              strokeLinecap="round"
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
            <span className="text-5xl font-black tracking-tighter font-headline text-on-surface">
              {Math.round(calRemaining).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Kcal Left</span>
          </div>
        </div>
      </div>

      {/* Macro Nutrients Card */}
      <div className="mx-4 mb-6 animate-slideUp" style={{ animationDelay: '0.08s' }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '1.25rem',
            padding: '28px 24px',
            boxShadow: '0 30px 60px -12px rgba(45,47,47,0.08)',
          }}
        >
          <div className="flex justify-between items-center mb-7">
            <h3 className="text-xl font-bold font-headline text-on-surface">Macro Nutrients</h3>
            <span
              className="text-sm font-bold cursor-pointer"
              style={{ color: '#424936' }}
              onClick={() => navigate('/stats')}
            >
              Details
            </span>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Protein', value: totals.protein, target: targets.protein },
              { label: 'Carbohydrates', value: totals.carbs, target: targets.carbs },
              { label: 'Fats', value: totals.fat, target: targets.fat },
            ].map((m) => (
              <div key={m.label} className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-on-surface">{m.label}</span>
                  <span className="font-semibold text-on-surface-variant">{Math.round(m.value)}g / {m.target}g</span>
                </div>
                <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: '#e8e8e8' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min((m.value / m.target) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, #446900, #a3e635)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hydration Card — Blue Glass */}
      <div className="mx-4 mb-6 animate-slideUp" style={{ animationDelay: '0.12s' }}>
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(33, 112, 228, 0.08), rgba(33, 112, 228, 0.04))',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '1.25rem',
            padding: '28px 24px',
            border: '1px solid rgba(33, 112, 228, 0.1)',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.04)',
          }}
        >
          <div className="relative z-10">
            {/* Top row */}
            <div className="flex justify-between items-start mb-4">
              <div style={{ background: 'rgba(33, 112, 228, 0.08)', borderRadius: '1rem', padding: 12 }}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: '#0058be', fontSize: 32, fontVariationSettings: "'FILL' 1" }}
                >
                  water_drop
                </span>
              </div>
              <span style={{ color: '#0058be', fontWeight: 900, fontSize: '2.25rem', letterSpacing: '-0.02em' }}>
                {waterLiters}<span className="text-base font-bold">L</span>
              </span>
            </div>

            {/* Labels */}
            <h3 className="text-xl font-bold text-on-surface mb-0.5">Stay Hydrated</h3>
            <p className="text-sm font-medium mb-5" style={{ color: 'rgba(0, 88, 190, 0.6)' }}>
              Goal: {waterTargetLiters}L
            </p>

            {/* Droplet progress icons */}
            <div className="flex gap-2 mb-6">
              {Array.from({ length: waterFilled }).map((_, i) => (
                <span
                  key={`filled-${i}`}
                  className="material-symbols-outlined"
                  style={{ color: '#0058be', fontVariationSettings: "'FILL' 1", fontSize: 28 }}
                >
                  opacity
                </span>
              ))}
              {Array.from({ length: waterEmpty }).map((_, i) => (
                <span
                  key={`empty-${i}`}
                  className="material-symbols-outlined"
                  style={{ color: 'rgba(0, 88, 190, 0.2)', fontSize: 28 }}
                >
                  opacity
                </span>
              ))}
            </div>

            {/* Add Water Button — Lime Green like Stitch */}
            <button
              onClick={() => handleWater(1)}
              className="w-full font-bold py-4 px-6 rounded-full active:scale-95 transition-transform"
              style={{
                background: '#a3e635',
                color: '#416400',
                boxShadow: '0 8px 24px rgba(163, 230, 53, 0.3)',
              }}
            >
              Add 250ml
            </button>
          </div>

          {/* Decorative circle */}
          <div
            className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full"
            style={{ background: 'rgba(0, 88, 190, 0.04)' }}
          />
        </div>
      </div>

      {/* Today's Meals — Quick Grid */}
      <div className="px-4 mb-4 animate-slideUp" style={{ animationDelay: '0.14s' }}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-headline font-bold text-on-surface">Today's Meals</h2>
          <button onClick={() => navigate('/meals')} className="text-xs font-bold flex items-center gap-0.5 text-primary">
            Log Food <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {mealSlots.map((slot) => {
            const foods = getMealFoods(slot);
            const slotCals = foods.reduce((s: number, f: any) => s + (f.calories || 0), 0);
            return (
              <button
                key={slot}
                onClick={() => navigate('/meals', { state: { selectedMealType: slot } })}
                className="text-center hover:scale-[1.02] active:scale-95 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '1.25rem',
                  padding: '12px 8px',
                  boxShadow: '0 4px 16px rgba(45,47,47,0.06)',
                  border: '1px solid rgba(194,202,176,0.15)',
                }}
              >
                <div className="flex justify-center mb-2">
                  <span className="material-symbols-outlined" style={{ color: '#416400', fontVariationSettings: "'FILL' 1", fontSize: 22 }}>{mealIcons[slot]}</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant capitalize">{slot}</div>
                <div className="text-sm font-extrabold font-headline text-on-surface mt-0.5">{Math.round(slotCals)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Meals — Photo Cards */}
      <div className="px-4 mb-6 animate-slideUp" style={{ animationDelay: '0.18s' }}>
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <h3 className="text-xl font-bold font-headline text-on-surface">Recent Meals</h3>
            <p className="text-on-surface-variant text-xs font-medium">Indian Cuisine Log</p>
          </div>
          <button className="text-primary font-bold text-sm" onClick={() => navigate('/meals')}>View History</button>
        </div>

        <div className="space-y-4">
          {(actualMeals && actualMeals.length > 0 ? actualMeals : recentMeals).map((meal: any, idx: number) => (
            <div
              key={idx}
              className="overflow-hidden group"
              style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: '1.5rem',
                boxShadow: '0 30px 60px -12px rgba(45,47,47,0.08)',
                border: '1px solid rgba(194,202,176,0.1)',
              }}
            >
              {/* Photo */}
              {'image' in meal && (meal as any).image && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={(meal as any).image}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              {/* Info */}
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant block mb-1">{meal.label}</span>
                    <h4 className="font-extrabold text-lg font-headline text-on-surface leading-tight">{meal.name}</h4>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ml-3"
                    style={{ background: '#a3e635', color: '#416400' }}
                  >
                    {Math.round(meal.kcal)} kcal
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{meal.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
