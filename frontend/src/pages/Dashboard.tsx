import { useMemo, useState } from 'react';
import { useApp } from '@/main';
import { dailyLogApi } from '@/services/api';
import CalorieRing from "@/components/dashboard/CalorieRing";
import MacroBar from "@/components/dashboard/MacroBar";
import MealCard from "@/components/dashboard/MealCard";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

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
  
  const waterGlasses = dailyLog?.water_glasses || 0;
  const waterTarget = dailyLog?.water_target || 8;
  const waterLiters = (waterGlasses * 0.25).toFixed(1);
  const waterTargetLiters = (waterTarget * 0.25).toFixed(1);

  const handleWater = async (delta: number) => {
    const newVal = Math.max(0, Math.min(waterGlasses + delta, 20));
    try {
      await dailyLogApi.updateWater(new Date().toISOString().split('T')[0], newVal);
      await refreshLog();
    } catch { /* ignore */ }
  };

  const _showToast = (_msg: string) => {
    setToast(_msg);
    setTimeout(() => setToast(null), 2000);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const actualMeals = useMemo(() => {
    if (!dailyLog?.meals || dailyLog.meals.length === 0) return [];
    return dailyLog.meals
      .filter((m: any) => m.foods && m.foods.length > 0)
      .map((m: any) => ({
        id: m.id || Math.random().toString(),
        type: m.type.charAt(0).toUpperCase() + m.type.slice(1),
        name: m.foods[0]?.name || m.type,
        calories: Math.round(m.foods.reduce((s: number, f: any) => s + (f.calories || 0), 0)),
        time: m.time || "12:00 PM",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=500"
      }));
  }, [dailyLog]);

  return (
    <div
      className="min-h-screen pb-24 px-5"
      style={{
        background: 'var(--surface)',
        paddingTop: 'max(env(safe-area-inset-top, 0px), 1.5rem)',
      }}
    >
      
      {/* Header */}
      <div className="mb-6 animate-fadeIn flex justify-between items-center">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--on-surface-variant)' }}>{today}</p>
          <h1
            className="text-2xl font-extrabold mt-1 tracking-tight"
            style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-display)' }}
          >
            {getGreeting()}, {profile?.name || 'Guest'} 👋
          </h1>
        </div>
        <button
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer shrink-0 flex items-center justify-center"
          onClick={() => navigate('/profile')}
          style={{
            background: 'linear-gradient(135deg, #a3e635, #65a30d)',
            border: '2px solid rgba(163, 230, 53, 0.4)',
            boxShadow: '0 4px 14px rgba(163, 230, 53, 0.3)',
          }}
        >
          <span className="font-bold text-sm" style={{ color: 'white' }}>
            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </button>
      </div>

      {/* Calorie Ring Card */}
      <div className="glass rounded-3xl p-6 mb-5 editorial-shadow">
        <CalorieRing consumed={Math.round(totals.calories)} goal={Math.round(targets.calories)} />
      </div>

      {/* Macro Progress Card */}
      <div className="glass rounded-3xl p-5 mb-5 space-y-3 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-display)' }}>Macros</h2>
        <MacroBar label="Protein" current={Math.round(totals.protein)} goal={Math.round(targets.protein)} color="#0ea5e9" />
        <MacroBar label="Carbs" current={Math.round(totals.carbs)} goal={Math.round(targets.carbs)} color="#f59e0b" />
        <MacroBar label="Fat" current={Math.round(totals.fat)} goal={Math.round(targets.fat)} color="#ec4899" />
      </div>

      {/* Hydration Tracker — Blue Glass */}
      <div className="glass-blue-card rounded-3xl p-5 mb-5 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-display)' }}>
              Hydration
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--on-surface-variant)' }}>Goal: {waterTargetLiters}L</p>
          </div>
          <span className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--secondary-container)' }}>{waterLiters}L</span>
        </div>
        
        <div className="flex gap-2 items-center justify-between">
           <div className="flex gap-1.5 flex-1 max-w-[70%]">
             {Array.from({ length: Math.min(waterGlasses, 8) }).map((_, i) => (
                <span
                  key={`filled-${i}`}
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: 24, color: 'var(--secondary-container)' }}
                >
                  water_drop
                </span>
              ))}
              {Array.from({ length: Math.max(8 - waterGlasses, 0) }).map((_, i) => (
                <span
                  key={`empty-${i}`}
                  className="material-symbols-outlined"
                  style={{ fontSize: 24, color: 'rgba(33, 112, 228, 0.25)' }}
                >
                  water_drop
                </span>
              ))}
           </div>
           
           <button 
             onClick={() => handleWater(1)}
             className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0"
             style={{
               background: 'var(--secondary-container)',
               color: 'white',
               boxShadow: '0 4px 14px rgba(33, 112, 228, 0.3)',
             }}
            >
              <span className="material-symbols-outlined font-bold" style={{ fontSize: 20 }}>add</span>
           </button>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="animate-fadeIn mb-8" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-display)' }}>Today's Meals</h2>
          <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>{actualMeals.length} logged</span>
        </div>
        {actualMeals.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            {actualMeals.map((meal: any) => (
              <MealCard key={meal.id} {...meal} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 36, color: 'var(--outline-variant)' }}
            >
              restaurant
            </span>
            <p className="text-sm font-medium" style={{ color: 'var(--on-surface-variant)' }}>No meals logged yet.</p>
            <button
              onClick={() => navigate('/meals')}
              className="mt-2 text-xs font-bold px-5 py-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #a3e635, #84cc16)',
                color: 'var(--on-primary-container)',
                boxShadow: '0 4px 14px rgba(163, 230, 53, 0.3)',
              }}
            >
              Log food
            </button>
          </div>
        )}
      </div>

      {/* FAB */}
      <button 
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform"
        onClick={() => navigate('/meals')}
        style={{
          background: 'linear-gradient(135deg, #a3e635, #65a30d)',
          color: 'white',
          boxShadow: '0 8px 30px rgba(163, 230, 53, 0.4)',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 28, fontVariationSettings: "'wght' 600" }}>add</span>
      </button>

      {/* Toast */}
      {toast && (
        <div className="toast">{toast}</div>
      )}
    </div>
  );
}
