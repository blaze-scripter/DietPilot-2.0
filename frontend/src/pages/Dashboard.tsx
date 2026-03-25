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

  const showToast = (msg: string) => {
    setToast(msg);
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
    <div className="min-h-screen bg-surface pt-[max(env(safe-area-inset-top),2.5rem)] pb-[max(env(safe-area-inset-bottom),6rem)] px-5">
      
      {/* Header */}
      <div className="mb-6 animate-fade-in flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{today}</p>
          <h1 className="text-2xl font-bold text-foreground mt-1">
            {getGreeting()}, {profile?.name || 'Guest'} 👋
          </h1>
        </div>
        <div
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer shrink-0 border-2 border-primary-container bg-primary flex items-center justify-center shadow-sm"
          onClick={() => navigate('/profile')}
        >
          <span className="text-primary-foreground font-bold text-sm">
            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
      </div>

      {/* Calorie Ring */}
      <div className="glass rounded-3xl p-6 mb-5">
        <CalorieRing consumed={Math.round(totals.calories)} goal={Math.round(targets.calories)} />
      </div>

      {/* Macro Progress */}
      <div className="glass rounded-3xl p-5 mb-5 space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-sm font-bold text-foreground mb-3">Macros</h2>
        <MacroBar label="Protein" current={Math.round(totals.protein)} goal={Math.round(targets.protein)} color="#a3e635" />
        <MacroBar label="Carbs" current={Math.round(totals.carbs)} goal={Math.round(targets.carbs)} color="#fbbf24" />
        <MacroBar label="Fat" current={Math.round(totals.fat)} goal={Math.round(targets.fat)} color="#f87171" />
      </div>

      {/* Hydration Tracker - Custom Blue Tinted Glass */}
      <div className="glass rounded-3xl p-5 mb-5 space-y-4 animate-fade-in shadow-sm border border-secondary-container/30 bg-secondary-container/10" style={{ animationDelay: "0.15s" }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-foreground">Hydration</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Goal: {waterTargetLiters}L</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-secondary-container tracking-tight">{waterLiters}L</span>
          </div>
        </div>
        
        <div className="flex gap-2 mb-2 items-center justify-between">
           <div className="flex gap-1.5 flex-1 max-w-[70%]">
             {Array.from({ length: Math.min(waterGlasses, 8) }).map((_, i) => (
                <span
                  key={`filled-${i}`}
                  className="material-symbols-outlined text-secondary-container drop-shadow-sm"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: 24 }}
                >
                  water_drop
                </span>
              ))}
              {Array.from({ length: Math.max(8 - waterGlasses, 0) }).map((_, i) => (
                <span
                  key={`empty-${i}`}
                  className="material-symbols-outlined text-secondary-container/30"
                  style={{ fontSize: 24 }}
                >
                  water_drop
                </span>
              ))}
           </div>
           
           <button 
             onClick={() => handleWater(1)}
             className="w-10 h-10 rounded-full bg-secondary-container text-primary-foreground shadow-md shadow-secondary-container/30 flex items-center justify-center active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined font-bold" style={{ fontSize: 20 }}>add</span>
           </button>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="animate-fade-in mb-8" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Today's Meals</h2>
          <span className="text-xs text-muted-foreground">{actualMeals.length} logged</span>
        </div>
        {actualMeals.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            {actualMeals.map((meal: any) => (
              <MealCard key={meal.id} {...meal} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-6 text-center flex flex-col items-center justify-center gap-2 mt-2">
            <span className="material-symbols-outlined text-muted-foreground/40" style={{ fontSize: 32 }}>restaurant</span>
            <p className="text-sm font-medium text-muted-foreground">No meals logged yet.</p>
            <button onClick={() => navigate('/meals')} className="mt-2 text-xs font-bold text-primary-foreground bg-primary px-4 py-1.5 rounded-full inline-block">Log food</button>
          </div>
        )}
      </div>

      {/* FAB - Using Material Icons */}
      <button 
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center active:scale-95 transition-transform"
        onClick={() => navigate('/meals')}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 28, fontVariationSettings: "'wght' 600" }}>add</span>
      </button>

      {/* Toast */}
      {toast && <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium shadow-xl z-50 animate-fade-in">{toast}</div>}
    </div>
  );
}
