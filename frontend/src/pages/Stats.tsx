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

      {/* ▸ Weekly Chart ───────────────────────── */}
      <div className="anim-fade-up anim-delay-2 card" style={{ padding: '18px 16px', marginBottom: 20 }}>
        <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18', marginBottom: 14 }}>Calorie Trend</h2>
        {weeklyData.length > 0 && <WeeklyChart data={weeklyData} goal={Math.round(targets.calories)} />}
      </div>

      {/* ▸ Macro Donut ────────────────────────── */}
      <div className="anim-fade-up anim-delay-3 card" style={{ padding: '18px 16px', marginBottom: 20 }}>
        <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18', marginBottom: 14 }}>Macro Breakdown</h2>
        <MacroDonut protein={avgProtein} carbs={avgCarbs} fat={avgFat} />
      </div>
    </div>
  );
}
