import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/main';
import { dailyLogApi, weightApi } from '@/services/api';

export default function Stats() {
  const { profile, dailyLog } = useApp();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [weightEntries, setWeightEntries] = useState<any[]>([]);

  useEffect(() => {
    async function init() {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        try {
          const log = await dailyLogApi.get(dateStr);
          const cals = log?.meals?.reduce((s, m) => s + (m.foods || []).reduce((fs, f) => fs + f.calories, 0), 0) || 0;
          data.push({ day: d.toLocaleDateString('en', { weekday: 'short' }), calories: cals });
        } catch { data.push({ day: d.toLocaleDateString('en', { weekday: 'short' }), calories: 0 }); }
      }
      setWeeklyData(data);
      try { const w = await weightApi.list(); setWeightEntries(w.slice(-7)); } catch { /* ignore */ }
    }
    init();
  }, [dailyLog]);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-extrabold tracking-tight mb-6">Stats 📊</h1>
      
      <div className="glass-card p-5 mb-4">
        <h2 className="text-sm font-bold mb-4">Weekly Calories</h2>
        <div className="flex items-end gap-2 h-32">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-lime-400 rounded-t-lg transition-all duration-500"
                style={{ height: `${Math.min((d.calories / (profile?.targets?.calories || 2000)) * 100, 100)}%` }}
              />
              <span className="text-[10px] font-bold text-gray-400">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="text-sm font-bold mb-4">Weight Trend</h2>
        <div className="space-y-3">
          {weightEntries.map((e, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-gray-400">{e.date}</span>
              <span className="font-extrabold">{e.weight_kg} kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
