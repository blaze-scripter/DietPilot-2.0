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
            day: d.toLocaleDateString('en', { weekday: 'short' }).charAt(0),
            calories: Math.round(cals),
            water: log?.water_glasses || 0,
          });
        } catch {
          data.push({
            date: dateStr,
            day: d.toLocaleDateString('en', { weekday: 'short' }).charAt(0),
            calories: 0,
            water: 0,
          });
        }
      }
      setWeeklyData(data);
      try { const w = await weightApi.list(); setWeightEntries(w.slice(-7)); } catch { /* ignore */ }
    };
    init();
  }, [dailyLog]);
  // Max calories for chart scaling
  const maxCal = Math.max(...weeklyData.map((d) => d.calories), targets.calories, 1);

  // Donut chart for macros
  const macros = [
    { label: 'Protein', value: todayTotals.protein * 4, color: '#ef4444' },
    { label: 'Carbs', value: todayTotals.carbs * 4, color: '#3b82f6' },
    { label: 'Fat', value: todayTotals.fat * 9, color: '#f59e0b' },
  ];
  const totalMacroCals = macros.reduce((s, m) => s + m.value, 0) || 1;

  const createDonutPath = (startAngle: number, endAngle: number, radius: number, cx: number, cy: number) => {
    const start = {
      x: cx + radius * Math.cos((-startAngle * Math.PI) / 180),
      y: cy + radius * Math.sin((-startAngle * Math.PI) / 180),
    };
    const end = {
      x: cx + radius * Math.cos((-endAngle * Math.PI) / 180),
      y: cy + radius * Math.sin((-endAngle * Math.PI) / 180),
    };
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  let donutAngle = 90;
  const donutPaths = macros.map((m) => {
    const angle = (m.value / totalMacroCals) * 360;
    // slightly reduce angle to create gaps between segments
    const renderAngle = Math.max(0, angle - 2); 
    const path = createDonutPath(donutAngle, donutAngle + renderAngle, 65, 80, 80);
    donutAngle += angle;
    return { ...m, path };
  });

  return (
    <div className="page-container relative">
      <div className="absolute top-[-5%] left-[-10%] w-[300px] h-[300px] bg-primary-container/20 rounded-full blur-[80px] pointer-events-none -z-10"></div>
      
      {/* Header */}
      <div className="mb-8 pt-4 animate-slideUp">
        <h1 className="text-3xl font-extrabold tracking-tight font-display text-foreground leading-none mb-2">
          Weekly Stats
        </h1>
        <p className="text-sm font-medium text-muted">Track your progress and nutrition</p>
      </div>

      {/* Weekly Bar Chart */}
      <div className="glass-card-stitch p-6 mb-6 animate-slideUp" style={{ animationDelay: '0.05s', borderRadius: 24 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-bold">Energy Intake</h2>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-container/30 text-primary-dark">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>bar_chart</span>
          </div>
        </div>
        
        <div className="relative h-48 mb-2 border-b border-gray-100 flex items-end justify-between px-2 pt-6 pb-2">
          {/* Target line */}
          <div 
            className="absolute left-0 right-0 border-t border-dashed border-primary/50 flex items-center justify-end z-0"
            style={{ 
              bottom: `${(targets.calories / maxCal) * 100}%`,
              transform: 'translateY(5px)'
            }}
          >
            <div className="text-[9px] font-bold text-primary bg-white px-1.5 py-0.5 rounded shadow-sm -mt-6">Target {targets.calories}</div>
          </div>

          {weeklyData.map((d, i) => {
            const heightPct = maxCal > 0 ? (d.calories / maxCal) * 100 : 0;
            const isToday = i === weeklyData.length - 1;
            const isOverTarget = d.calories > targets.calories;
            
            return (
              <div key={d.date} className="relative z-10 flex flex-col items-center group w-1/8 h-full justify-end">
                {/* Tooltip */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-high text-foreground text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                  {d.calories} kcal
                </div>
                
                <div 
                  className="w-full max-w-[28px] rounded-full transition-all duration-1000 ease-out flex items-end overflow-hidden"
                  style={{ 
                    height: `${Math.max(heightPct, 4)}%`,
                    background: isToday 
                      ? 'linear-gradient(to top, var(--primary-dark), var(--primary))' 
                      : (isOverTarget ? '#fecaca' : '#e5e7eb'),
                    boxShadow: isToday ? '0 4px 12px rgba(163,230,53,0.3)' : 'none'
                  }}
                >
                  <div className="w-full h-full bg-white/20"></div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between px-2 mt-2">
          {weeklyData.map((d, i) => {
             const isToday = i === weeklyData.length - 1;
             return (
              <span key={d.date} className="w-1/8 text-center text-xs font-display font-bold uppercase" style={{ color: isToday ? 'var(--primary-dark)' : 'var(--muted)' }}>
                {d.day}
              </span>
             )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 stagger-children animate-slideUp" style={{ animationDelay: '0.1s' }}>
        {/* Hydration Mini Card */}
        <div className="glass-blue-card p-5 relative overflow-hidden flex flex-col justify-between h-40 group" style={{ borderRadius: 24 }}>
          <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined" style={{ fontSize: 100, fontVariationSettings: "'FILL' 1" }}>water_drop</span>
          </div>
          
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-500 text-white shadow-sm mb-2 relative z-10">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}>water_drop</span>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-sm font-display font-bold text-blue-900 mb-1">Weekly Hydration</h3>
            <div className="text-2xl font-extrabold text-blue-900 leading-none">
              {Math.round(weeklyData.reduce((acc, d) => acc + d.water, 0) / 7)} <span className="text-xs font-bold uppercase tracking-widest text-blue-700/70">avg</span>

            </div>
          </div>
        </div>


        {/* Weight Trend Mini Card */}
        <div className="glass-card-flat p-5 relative overflow-hidden flex flex-col justify-between h-40 group hover:border-pink-200 transition-colors" style={{ borderRadius: 24 }}>
          <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
            <span className="material-symbols-outlined" style={{ fontSize: 100, fontVariationSettings: "'FILL' 1" }}>scale</span>
          </div>
          
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-pink-100 text-pink-500 mb-2 relative z-10">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}>scale</span>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-sm font-display font-bold text-foreground mb-1">Current Weight</h3>
            <div className="text-2xl font-extrabold text-foreground leading-none flex items-center gap-2">
              {weightEntries[weightEntries.length - 1]?.weight_kg || profile?.weight_kg || '--'} 
              <span className="text-xs font-bold uppercase tracking-widest text-muted">kg</span>
            </div>
            {weightEntries.length >= 2 && (
              <div className={`text-[10px] font-bold mt-2 flex items-center gap-1 ${weightEntries[weightEntries.length - 1].weight_kg < weightEntries[0].weight_kg ? 'text-green-500' : 'text-red-500'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  {weightEntries[weightEntries.length - 1].weight_kg < weightEntries[0].weight_kg ? 'trending_down' : 'trending_up'}
                </span>
                {Math.abs(weightEntries[weightEntries.length - 1].weight_kg - weightEntries[0].weight_kg).toFixed(1)} kg this week
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nutrition Donut */}
      <div className="glass-card-stitch p-6 mb-6 animate-slideUp" style={{ animationDelay: '0.15s', borderRadius: 24 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-bold">Today's Macros</h2>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-50 text-orange-500">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>data_usage</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative flex-shrink-0 animate-scaleIn">
            <svg width={160} height={160} viewBox="0 0 160 160" style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.05))' }}>
              <circle cx="80" cy="80" r="65" fill="none" stroke="var(--surface-container)" strokeWidth={16} />
              {donutPaths.map((d, i) => (
                <path
                  key={i}
                  d={d.path}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={16}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{ strokeDasharray: 1000, strokeDashoffset: 0 }}
                />
              ))}
              <text x="80" y="75" textAnchor="middle" className="font-display font-extrabold" fill="var(--foreground)" fontSize="24">
                {Math.round(todayTotals.calories)}
              </text>
              <text x="80" y="95" textAnchor="middle" className="font-bold uppercase tracking-widest" fill="var(--muted)" fontSize="10">
                / {targets.calories} kcal
              </text>
            </svg>
          </div>

          <div className="flex-1 w-full space-y-4">
            {macros.map((m) => {
              const targetGrams = m.label === 'Protein' ? targets.protein : m.label === 'Carbs' ? targets.carbs : targets.fat;
              const currentGrams = Math.round(m.value / (m.label === 'Fat' ? 9 : 4));
              const pct = Math.min((currentGrams / targetGrams) * 100, 100);
              
              return (
                <div key={m.label} className="group">
                  <div className="flex justify-between text-sm font-display font-bold mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: m.color }} />
                      <span className="text-foreground">{m.label}</span>
                    </div>
                    <span className="text-foreground">{currentGrams} <span className="text-[10px] uppercase font-bold text-muted ml-0.5">/ {targetGrams}g</span></span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${pct}%`, background: m.color }} 
                    />
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
