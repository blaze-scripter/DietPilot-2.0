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
            calories: 0, protein: 0, carbs: 0, fat: 0, water: 0,
          });
        }
      }
      setWeeklyData(data);
      try { const w = await weightApi.list(); setWeightEntries(w.slice(-7)); } catch { /* ignore */ }
    };
    init();
  }, [dailyLog]);

  const avgCal = useMemo(() => {
    if (!weeklyData.length) return 0;
    return Math.round(weeklyData.reduce((s, d) => s + d.calories, 0) / weeklyData.length);
  }, [weeklyData]);

  const avgProtein = useMemo(() => {
    if (!weeklyData.length) return 0;
    return Math.round(weeklyData.reduce((s, d) => s + d.protein, 0) / weeklyData.length);
  }, [weeklyData]);

  const avgCarbs = useMemo(() => {
    if (!weeklyData.length) return 0;
    return Math.round(weeklyData.reduce((s, d) => s + d.carbs, 0) / weeklyData.length);
  }, [weeklyData]);

  const avgFat = useMemo(() => {
    if (!weeklyData.length) return 0;
    return Math.round(weeklyData.reduce((s, d) => s + d.fat, 0) / weeklyData.length);
  }, [weeklyData]);

  const streakDays = useMemo(() => {
    if (!weeklyData.length) return 0;
    let streak = 0;
    for (let i = weeklyData.length - 1; i >= 0; i--) {
      if (weeklyData[i].calories > 0) streak++;
      else break;
    }
    return streak;
  }, [weeklyData]);

  const totalWater = useMemo(() => weeklyData.reduce((s, d) => s + d.water, 0), [weeklyData]);
  const avgWater = weeklyData.length ? Math.round(totalWater / weeklyData.length * 10) / 10 : 0;

  const summaryCards = [
    { label: 'Avg Calories', value: avgCal.toLocaleString(), unit: 'kcal', icon: 'local_fire_department', iconColor: '#ef4444' },
    { label: 'Avg Protein', value: `${avgProtein}g`, unit: '', icon: 'bolt', iconColor: '#f59e0b' },
    { label: 'Streak', value: `${streakDays}`, unit: 'days', icon: 'trending_up', iconColor: '#65a30d' },
  ];

  const weekLabel = useMemo(() => {
    if (!weeklyData || weeklyData.length < 7) return '';
    const start = new Date(weeklyData[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = new Date(weeklyData[weeklyData.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} – ${end}`;
  }, [weeklyData]);

  /* ── Macro progress bars helper ── */
  const macroProgress = (actual: number, target: number) => Math.min((actual / Math.max(target, 1)) * 100, 100);

  return (
    <div className="page-shell" style={{ paddingTop: 24 }}>

      {/* ▸ Header ─────────────────────────────── */}
      <header className="anim-fade-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem' }}>Weekly Stats</h1>
        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#72796a', marginTop: 4 }}>{weekLabel}</p>
      </header>

      {/* ▸ Summary Cards ──────────────────────── */}
      <div className="anim-fade-up anim-delay-1" style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10, marginBottom: 20,
      }}>
        {summaryCards.map((c) => (
          <div key={c.label} className="card" style={{
            padding: '16px 12px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 22, color: c.iconColor, marginBottom: 4,
              fontVariationSettings: "'FILL' 1",
            }}>{c.icon}</span>
            <span style={{
              fontSize: '1.125rem', fontWeight: 800, color: '#1b1c18',
              fontFamily: 'var(--font-display)', lineHeight: 1,
            }}>{c.value}</span>
            <span style={{
              fontSize: '0.5625rem', fontWeight: 600, color: '#a1a79a',
              marginTop: 2,
            }}>{c.label}{c.unit ? ` (${c.unit})` : ''}</span>
          </div>
        ))}
      </div>

      {/* ▸ Macro Targets vs Actuals ────────────── */}
      <div className="anim-fade-up anim-delay-2 card" style={{ padding: '18px 16px', marginBottom: 20 }}>
        <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18', marginBottom: 16 }}>Nutrition vs Goals</h2>
        {[
          { label: 'Calories', actual: avgCal, target: Math.round(targets.calories), unit: 'kcal', color: '#ef4444', bg: '#fef2f2' },
          { label: 'Protein', actual: avgProtein, target: Math.round(targets.protein), unit: 'g', color: '#65a30d', bg: '#f0fdf4' },
          { label: 'Carbs', actual: avgCarbs, target: Math.round(targets.carbs), unit: 'g', color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Fat', actual: avgFat, target: Math.round(targets.fat), unit: 'g', color: '#ec4899', bg: '#fdf2f8' },
        ].map((m) => (
          <div key={m.label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1b1c18', fontFamily: 'var(--font-display)' }}>{m.label}</span>
              <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#72796a' }}>
                {m.actual} / {m.target} {m.unit}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 100, background: m.bg, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 100, background: m.color,
                width: `${macroProgress(m.actual, m.target)}%`,
                transition: 'width 0.6s cubic-bezier(.22,1,.36,1)',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* ▸ Weekly Chart ───────────────────────── */}
      <div className="anim-fade-up anim-delay-3 card" style={{ padding: '18px 16px', marginBottom: 20 }}>
        <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18', marginBottom: 14 }}>Calorie Trend</h2>
        {weeklyData.length > 0 && <WeeklyChart data={weeklyData} goal={Math.round(targets.calories)} />}
      </div>

      {/* ▸ Macro Donut ────────────────────────── */}
      <div className="anim-fade-up anim-delay-4 card" style={{ padding: '18px 16px', marginBottom: 20 }}>
        <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18', marginBottom: 14 }}>Macro Breakdown</h2>
        <MacroDonut protein={avgProtein} carbs={avgCarbs} fat={avgFat} />
      </div>

      {/* ▸ Hydration Overview ─────────────────── */}
      <div className="anim-fade-up anim-delay-5 card" style={{ padding: '18px 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#2563eb', fontVariationSettings: "'FILL' 1" }}>water_drop</span>
          <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18' }}>Hydration</h2>
        </div>

        {/* Avg + Total */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{
            padding: '12px', borderRadius: 14, textAlign: 'center',
            background: '#eff6ff', border: '1px solid #dbeafe',
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-display)' }}>
              {avgWater}
            </div>
            <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: '#60a5fa' }}>Avg Glasses/Day</div>
          </div>
          <div style={{
            padding: '12px', borderRadius: 14, textAlign: 'center',
            background: '#eff6ff', border: '1px solid #dbeafe',
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-display)' }}>
              {(totalWater * 0.25).toFixed(1)}L
            </div>
            <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: '#60a5fa' }}>Total This Week</div>
          </div>
        </div>

        {/* Daily water dots */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {weeklyData.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', margin: '0 auto 4px',
                background: d.water >= 8 ? '#2563eb' : d.water >= 4 ? '#93c5fd' : '#e0f2fe',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}>
                <span style={{ fontSize: '0.5rem', fontWeight: 800, color: d.water >= 8 ? '#fff' : '#2563eb' }}>
                  {d.water}
                </span>
              </div>
              <span style={{ fontSize: '0.5rem', fontWeight: 600, color: '#72796a' }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ▸ Weight Tracking ────────────────────── */}
      {weightEntries.length > 0 && (
        <div className="anim-fade-up card" style={{ padding: '18px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#65a30d', fontVariationSettings: "'FILL' 1" }}>monitor_weight</span>
            <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18' }}>Weight Progress</h2>
          </div>

          {/* Mini line chart via SVG */}
          <div style={{ height: 80, position: 'relative', marginBottom: 12 }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${Math.max(weightEntries.length - 1, 1) * 50} 80`} preserveAspectRatio="none">
              {(() => {
                const weights = weightEntries.map((e: any) => e.weight_kg);
                const minW = Math.min(...weights) - 1;
                const maxW = Math.max(...weights) + 1;
                const range = maxW - minW || 1;
                const pts = weights.map((w: number, i: number) => ({
                  x: i * 50,
                  y: 75 - ((w - minW) / range) * 70,
                }));
                const pathD = pts.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                return (
                  <>
                    <defs>
                      <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a3e635" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={`${pathD} L${pts[pts.length-1].x},80 L${pts[0].x},80 Z`} fill="url(#wGrad)" />
                    <path d={pathD} fill="none" stroke="#65a30d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {pts.map((p: any, i: number) => (
                      <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke="#65a30d" strokeWidth="2" />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Weight labels */}
          <div className="scrollbar-hide" style={{ display: 'flex', justifyContent: 'space-between', gap: 6, overflowX: 'auto' }}>
            {weightEntries.map((e: any, i: number) => (
              <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: 40 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#1b1c18', fontFamily: 'var(--font-display)' }}>
                  {e.weight_kg}
                </div>
                <div style={{ fontSize: '0.5rem', fontWeight: 600, color: '#a1a79a' }}>
                  {new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ▸ Daily Breakdown ────────────────────── */}
      <div className="anim-fade-up card" style={{ padding: '18px 16px', marginBottom: 20 }}>
        <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18', marginBottom: 14 }}>Daily Breakdown</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {weeklyData.slice().reverse().map((d, i) => {
            const isToday = i === 0;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 14,
                background: isToday ? '#f7fee7' : '#fafaf9',
                border: isToday ? '1px solid #d9f99d' : '1px solid transparent',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: isToday ? '#a3e635' : '#e5e5e0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: '0.625rem', fontWeight: 800,
                    color: isToday ? '#1a2e05' : '#72796a',
                    fontFamily: 'var(--font-display)',
                  }}>{d.day}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1b1c18', fontFamily: 'var(--font-display)' }}>
                    {d.calories} kcal {isToday && <span style={{ fontSize: '0.5rem', color: '#65a30d' }}>TODAY</span>}
                  </div>
                  <div style={{ fontSize: '0.5625rem', color: '#72796a', marginTop: 2 }}>
                    P: {d.protein}g · C: {d.carbs}g · F: {d.fat}g · 💧{d.water}
                  </div>
                </div>
                {d.calories > 0 && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: d.calories >= targets.calories * 0.8 ? '#dcfce7' : '#fef3c7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize: 14,
                      color: d.calories >= targets.calories * 0.8 ? '#16a34a' : '#f59e0b',
                      fontVariationSettings: "'FILL' 1",
                    }}>{d.calories >= targets.calories * 0.8 ? 'check_circle' : 'warning'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
