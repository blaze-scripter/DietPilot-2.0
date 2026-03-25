import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/main';
import { dailyLogApi, weightApi } from '@/services/api';

export default function Stats() {
  const { profile, dailyLog } = useApp();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [weightEntries, setWeightEntries] = useState<any[]>([]);

  const targets = profile?.targets || { calories: 2000, protein: 150, carbs: 200, fat: 50 };

  const todayTotals = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0;
    dailyLog?.meals?.forEach((m: any) => {
      (m.foods || []).forEach((fd: any) => {
        cal += fd.calories || 0;
        p += fd.protein_g || 0;
        c += fd.carbs_g || 0;
        f += fd.fat_g || 0;
      });
    });
    return { calories: cal, protein: p, carbs: c, fat: f };
  }, [dailyLog]);

  useEffect(() => {
    const init = async () => {
      const data: any[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        try {
          const log = await dailyLogApi.get(dateStr);
          const cals = log?.meals?.reduce((s: number, m: any) =>
            s + (m.foods || []).reduce((fs: number, f: any) => fs + (f.calories || 0), 0), 0) || 0;
          data.push({
            date: dateStr,
            day: d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 3),
            calories: Math.round(cals),
            water: log?.water_glasses || 0,
          });
        } catch {
          data.push({ date: dateStr, day: d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 3), calories: 0, water: 0 });
        }
      }
      setWeeklyData(data);
      try { const w = await weightApi.list(); setWeightEntries(w.slice(-7)); } catch { /* ignore */ }
    };
    init();
  }, [dailyLog]);

  const maxCal = Math.max(...weeklyData.map((d) => d.calories), targets.calories, 1);

  const macros = [
    { label: 'Protein', value: todayTotals.protein * 4, grams: todayTotals.protein, target: targets.protein, color: '#ef4444', bg: '#fee2e2' },
    { label: 'Carbs', value: todayTotals.carbs * 4, grams: todayTotals.carbs, target: targets.carbs, color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Fat', value: todayTotals.fat * 9, grams: todayTotals.fat, target: targets.fat, color: '#f59e0b', bg: '#fef3c7' },
  ];

  return (
    <div className="page-container relative" style={{ paddingTop: 0 }}>
      {/* Glow */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none -z-10" style={{ background: 'radial-gradient(circle, rgba(163,230,53,0.1) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />

      {/* Header */}
      <div className="px-4 pt-12 pb-4 animate-slideUp" style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 30px))' }}>
        <h1 className="text-3xl font-extrabold tracking-tight font-headline text-on-surface leading-none">Weekly Stats</h1>
        <p className="text-sm text-on-surface-variant font-medium mt-1">Track your nutrition & progress</p>
      </div>

      {/* Calorie Chart */}
      <div className="mx-4 mb-5 animate-slideUp" style={{ animationDelay: '0.05s' }}>
        <div style={{
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
          borderRadius: '1.75rem', padding: '20px',
          boxShadow: '0 30px 60px -12px rgba(45,47,47,0.08)',
        }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-headline font-bold text-on-surface">Energy Intake</h2>
            <div style={{ width: 36, height: 36, borderRadius: '0.875rem', background: '#ecfccb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#446900', fontSize: 20 }}>bar_chart</span>
            </div>
          </div>

          <div className="relative flex items-end justify-between" style={{ height: 160, borderBottom: '1px solid #eeeeee', padding: '0 4px 8px' }}>
            {/* Target line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed flex items-center justify-end"
              style={{ borderColor: 'rgba(68,105,0,0.35)', bottom: `${8 + (targets.calories / maxCal) * (160 - 8)}px` }}
            >
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#446900', background: 'white', padding: '2px 6px', borderRadius: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginRight: 0 }}>
                {targets.calories}
              </div>
            </div>

            {weeklyData.map((d, i) => {
              const heightPct = (d.calories / maxCal) * 100;
              const isToday = i === weeklyData.length - 1;
              const isOver = d.calories > targets.calories;
              return (
                <div key={d.date} className="flex flex-col items-center group" style={{ flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ position: 'relative' }}>
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 4, background: '#1a1c1c', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '3px 6px', borderRadius: 6 }}>
                      {d.calories} kcal
                    </div>
                    <div
                      style={{
                        width: 24, borderRadius: 999,
                        height: `${Math.max(heightPct, 3)}%`,
                        minHeight: d.calories > 0 ? 6 : 3,
                        maxHeight: 140,
                        background: isToday ? 'linear-gradient(to top, #446900, #a3e635)' : isOver ? '#fecaca' : '#eeeeee',
                        boxShadow: isToday ? '0 4px 12px rgba(163,230,53,0.35)' : 'none',
                        transition: 'height 1.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between px-1 mt-2">
            {weeklyData.map((d, i) => (
              <span key={d.date} className="flex-1 text-center text-[10px] font-bold uppercase" style={{ color: i === weeklyData.length - 1 ? '#446900' : '#5a5c5c' }}>
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hydration + Weight Row */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-5 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div style={{ background: 'rgba(59,130,246,0.08)', borderRadius: '1.25rem', padding: '16px', border: '1px solid rgba(59,130,246,0.1)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '0.875rem', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
          </div>
          <div className="text-sm font-headline font-bold text-on-surface mb-0.5">Hydration</div>
          <div className="text-2xl font-extrabold font-headline text-blue-900 leading-none">
            {Math.round(weeklyData.reduce((a, d) => a + d.water, 0) / Math.max(weeklyData.length, 1))}
            <span className="text-xs font-bold text-blue-700/70 ml-1 uppercase tracking-wider">avg</span>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderRadius: '1.25rem', padding: '16px', border: '1px solid rgba(194,202,176,0.15)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '0.875rem', background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <span className="material-symbols-outlined" style={{ color: '#ec4899', fontVariationSettings: "'FILL' 1" }}>scale</span>
          </div>
          <div className="text-sm font-headline font-bold text-on-surface mb-0.5">Weight</div>
          <div className="text-2xl font-extrabold font-headline text-on-surface leading-none">
            {weightEntries[weightEntries.length - 1]?.weight_kg || profile?.weight_kg || '—'}
            <span className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">kg</span>
          </div>
          {weightEntries.length >= 2 && (() => {
            const diff = weightEntries[weightEntries.length - 1].weight_kg - weightEntries[0].weight_kg;
            return (
              <div className={`text-[10px] font-bold flex items-center gap-0.5 mt-1 ${diff < 0 ? 'text-green-500' : 'text-red-500'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{diff < 0 ? 'trending_down' : 'trending_up'}</span>
                {Math.abs(diff).toFixed(1)} kg this week
              </div>
            );
          })()}
        </div>
      </div>

      {/* Today's Macros */}
      <div className="mx-4 mb-5 animate-slideUp" style={{ animationDelay: '0.15s' }}>
        <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderRadius: '1.75rem', padding: '20px', boxShadow: '0 30px 60px -12px rgba(45,47,47,0.08)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-headline font-bold text-on-surface">Today's Macros</h2>
            <div style={{ width: 36, height: 36, borderRadius: '0.875rem', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 20 }}>data_usage</span>
            </div>
          </div>
          <div className="space-y-4">
            {macros.map((m) => {
              const pct = Math.min((m.grams / m.target) * 100, 100);
              return (
                <div key={m.label}>
                  <div className="flex justify-between text-sm font-bold mb-1.5">
                    <div className="flex items-center gap-2">
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color }} />
                      <span className="text-on-surface">{m.label}</span>
                    </div>
                    <span className="text-on-surface">{Math.round(m.grams)}<span className="text-[10px] font-medium text-on-surface-variant ml-0.5">/ {m.target}g</span></span>
                  </div>
                  <div style={{ height: 8, background: m.bg, borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: m.color, borderRadius: 999, transition: 'width 1.2s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
