import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/main';
import { dailyLogApi, weightApi } from '@/services/api';
import { TrendingDown, TrendingUp, Droplets, Scale } from 'lucide-react';

export default function Stats() {
  const { profile, dailyLog } = useApp();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [weightEntries, setWeightEntries] = useState<any[]>([]);

  useEffect(() => {
    loadWeeklyData();
    loadWeight();
  }, []);

  const loadWeeklyData = async () => {
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
          day: d.toLocaleDateString('en', { weekday: 'short' }),
          calories: Math.round(cals),
          water: log?.water_glasses || 0,
        });
      } catch {
        data.push({
          date: dateStr,
          day: d.toLocaleDateString('en', { weekday: 'short' }),
          calories: 0,
          water: 0,
        });
      }
    }
    setWeeklyData(data);
  };

  const loadWeight = async () => {
    try {
      const entries = await weightApi.list();
      setWeightEntries(entries.slice(-7));
    } catch { /* ignore */ }
  };

  const targets = profile?.targets || { calories: 2000, protein: 120, carbs: 200, fat: 55 };

  // Today's totals
  const todayTotals = useMemo(() => {
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
    const path = createDonutPath(donutAngle, donutAngle + angle, 55, 70, 70);
    donutAngle += angle;
    return { ...m, path };
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-extrabold tracking-tight mb-6 animate-fadeIn">Stats 📊</h1>

      {/* Weekly Bar Chart */}
      <div className="glass-card p-5 mb-4 animate-slideUp">
        <h2 className="text-sm font-bold mb-4">Weekly Calories</h2>
        <div className="flex items-end gap-2 h-32">
          {weeklyData.map((d, i) => {
            const height = maxCal > 0 ? (d.calories / maxCal) * 100 : 0;
            const isToday = i === weeklyData.length - 1;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold" style={{ color: 'var(--muted)' }}>
                  {d.calories > 0 ? d.calories : ''}
                </span>
                <div className="w-full flex justify-center" style={{ height: '100px' }}>
                  <div
                    className="w-full max-w-[32px] rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${Math.max(height, 2)}%`,
                      background: isToday
                        ? 'linear-gradient(to top, var(--primary-dark), var(--primary))'
                        : '#e5e7eb',
                      alignSelf: 'flex-end',
                    }}
                  />
                </div>
                <span className="text-[10px] font-semibold" style={{ color: isToday ? 'var(--primary-dark)' : 'var(--muted)' }}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
        {/* Target line indicator */}
        <div className="flex items-center gap-2 mt-3">
          <div className="h-px flex-1" style={{ background: 'var(--primary)', opacity: 0.5 }} />
          <span className="text-[10px] font-semibold" style={{ color: 'var(--primary-dark)' }}>Target: {targets.calories} kcal</span>
          <div className="h-px flex-1" style={{ background: 'var(--primary)', opacity: 0.5 }} />
        </div>
      </div>

      {/* Nutrition Donut */}
      <div className="glass-card p-5 mb-4 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-sm font-bold mb-4">Today's Nutrition</h2>
        <div className="flex items-center gap-6">
          <svg width={140} height={140} viewBox="0 0 140 140">
            {donutPaths.map((d, i) => (
              <path
                key={i}
                d={d.path}
                fill="none"
                stroke={d.color}
                strokeWidth={14}
                strokeLinecap="round"
              />
            ))}
            <text x="70" y="65" textAnchor="middle" className="text-lg font-extrabold" fill="var(--foreground)" fontSize="18">
              {Math.round(todayTotals.calories)}
            </text>
            <text x="70" y="82" textAnchor="middle" fill="var(--muted)" fontSize="10">
              kcal
            </text>
          </svg>

          <div className="flex-1 space-y-3">
            {macros.map((m) => (
              <div key={m.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: m.color }} />
                <span className="text-xs font-semibold flex-1">{m.label}</span>
                <span className="text-xs font-bold">{Math.round(m.value / (m.label === 'Fat' ? 9 : 4))}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hydration Card */}
      <div className="glass-card p-5 mb-4 animate-slideUp" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#dbeafe' }}>
            <Droplets size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Hydration</h3>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Weekly average</p>
          </div>
        </div>
        <div className="flex gap-1">
          {weeklyData.map((d, i) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full h-16 flex items-end justify-center">
                <div
                  className="w-full max-w-[24px] rounded-t-md"
                  style={{
                    height: `${Math.min((d.water / 8) * 100, 100)}%`,
                    background: '#3b82f6',
                    opacity: i === weeklyData.length - 1 ? 1 : 0.4,
                  }}
                />
              </div>
              <span className="text-[9px] font-semibold" style={{ color: 'var(--muted)' }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Card */}
      {weightEntries.length > 0 && (
        <div className="glass-card p-5 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fce7f3' }}>
              <Scale size={20} className="text-pink-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Weight Trend</h3>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Latest: {weightEntries[weightEntries.length - 1]?.weight_kg} kg
              </p>
            </div>
            {weightEntries.length >= 2 && (
              <div className="ml-auto">
                {weightEntries[weightEntries.length - 1].weight_kg < weightEntries[0].weight_kg ? (
                  <TrendingDown size={20} className="text-green-500" />
                ) : (
                  <TrendingUp size={20} className="text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
