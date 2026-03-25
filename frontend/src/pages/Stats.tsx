import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/main';
import { dailyLogApi, weightApi } from '@/services/api';
import WeeklyChart from "@/components/stats/WeeklyChart";
import MacroDonut from "@/components/stats/MacroDonut";

export default function Stats() {
  const { profile, dailyLog } = useApp();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [weightEntries, setWeightEntries] = useState<any[]>([]);

  const targets = profile?.targets || { calories: 2000, protein: 150, carbs: 200, fat: 50 };

  useEffect(() => {
    const init = async () => {
      const data: any[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        try {
          const log = await dailyLogApi.get(dateStr);
          let p = 0, c = 0, f = 0, cal = 0;
          log?.meals?.forEach((m: any) => {
            (m.foods || []).forEach((fd: any) => {
              cal += fd.calories || 0;
              p += fd.protein_g || 0;
              c += fd.carbs_g || 0;
              f += fd.fat_g || 0;
            });
          });
          data.push({
            date: dateStr,
            day: d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 3),
            calories: Math.round(cal),
            protein: Math.round(p),
            carbs: Math.round(c),
            fat: Math.round(f),
            water: log?.water_glasses || 0,
          });
        } catch {
          data.push({ 
            date: dateStr, 
            day: d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 3), 
            calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 
          });
        }
      }
      setWeeklyData(data);
      try { const w = await weightApi.list(); setWeightEntries(w.slice(-7)); } catch { /* ignore */ }
    };
    init();
  }, [dailyLog]);

  // Averages
  const avgCal = useMemo(() => {
    if (!weeklyData || weeklyData.length === 0) return 0;
    return Math.round(weeklyData.reduce((s, d) => s + d.calories, 0) / weeklyData.length);
  }, [weeklyData]);

  const avgProtein = useMemo(() => {
    if (!weeklyData || weeklyData.length === 0) return 0;
    return Math.round(weeklyData.reduce((s, d) => s + d.protein, 0) / weeklyData.length);
  }, [weeklyData]);

  const avgCarbs = useMemo(() => {
    if (!weeklyData || weeklyData.length === 0) return 0;
    return Math.round(weeklyData.reduce((s, d) => s + d.carbs, 0) / weeklyData.length);
  }, [weeklyData]);

  const avgFat = useMemo(() => {
    if (!weeklyData || weeklyData.length === 0) return 0;
    return Math.round(weeklyData.reduce((s, d) => s + d.fat, 0) / weeklyData.length);
  }, [weeklyData]);

  // Streak Calculation
  const streakDays = useMemo(() => {
    if (!weeklyData || weeklyData.length === 0) return 0;
    let streak = 0;
    for (let i = weeklyData.length - 1; i >= 0; i--) {
      if (weeklyData[i].calories > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [weeklyData]);

  const summaryCards = [
    { label: "Avg Calories", value: avgCal.toLocaleString(), unit: "kcal", icon: "local_fire_department", color: "text-primary" },
    { label: "Avg Protein", value: `${avgProtein}g`, unit: "", icon: "bolt", color: "text-primary" },
    { label: "Streak", value: `${streakDays}`, unit: "days", icon: "trending_up", color: "text-primary" },
  ];

  // Current Week String e.g. "Mar 17 - Mar 23, 2026"
  const weekLabel = useMemo(() => {
    if (!weeklyData || weeklyData.length < 7) return "";
    const start = new Date(weeklyData[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const end = new Date(weeklyData[weeklyData.length - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${start} – ${end}`;
  }, [weeklyData]);

  return (
    <div className="min-h-screen bg-surface pt-[max(env(safe-area-inset-top),2.5rem)] pb-[max(env(safe-area-inset-bottom),6rem)] px-5">
      <div className="mb-6 animate-fade-in pt-4">
        <h1 className="text-2xl font-bold font-headline text-on-surface">Weekly Stats</h1>
        <p className="text-sm text-on-surface-variant mt-1 font-medium">{weekLabel}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5 animate-fade-in">
        {summaryCards.map((card) => (
          <div key={card.label} className="glass rounded-2xl p-3 text-center border border-outline-variant/15 shadow-sm flex flex-col items-center">
            <span className={`material-symbols-outlined mb-1 ${card.color}`} style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>
              {card.icon}
            </span>
            <p className="text-lg font-bold font-headline text-on-surface">{card.value}</p>
            <p className="text-[10px] text-on-surface-variant">{card.label}{card.unit ? ` (${card.unit})` : ""}</p>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="mb-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        {weeklyData.length > 0 && <WeeklyChart data={weeklyData} goal={Math.round(targets.calories)} />}
      </div>

      {/* Macro Donut */}
      <div className="animate-fade-in mb-8" style={{ animationDelay: "0.2s" }}>
        <MacroDonut protein={avgProtein} carbs={avgCarbs} fat={avgFat} />
      </div>
    </div>
  );
}
