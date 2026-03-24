import { useState, useEffect } from 'react';
import { useApp } from '@/main';
import { healthApi } from '@/services/api';
import { Heart, CheckCircle2, AlertCircle } from 'lucide-react';

export default function HealthConditions() {
  const { profile } = useApp();
  const [conditions, setConditions] = useState<any[]>([]);

  useEffect(() => {
    if (!profile?.health_conditions) return;
    setConditions(profile.health_conditions);
  }, [profile]);

  const ConditionCard = ({ name }: { name: string }) => {
    const [tips, setTips] = useState<any[]>([]);

    useEffect(() => {
      async function load() {
        try {
          const data = await healthApi.getTips(name);
          setTips(data);
        } catch { /* ignore */ }
      }
      load();
    }, [name]);

    return (
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
            <Heart size={20} fill="currentColor" />
          </div>
          <h2 className="text-base font-extrabold capitalize">{name.replace('_', ' ')} Guidance</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Do's</h4>
            <div className="space-y-2">
              {tips.filter(t => t.type === 'do').map((t, i) => (
                <div key={i} className="flex gap-2 text-xs font-medium text-gray-600">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> {t.tip}
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-gray-50">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">Don'ts</h4>
            <div className="space-y-2">
              {tips.filter(t => t.type === 'dont').map((t, i) => (
                <div key={i} className="flex gap-2 text-xs font-medium text-gray-600">
                  <AlertCircle size={14} className="text-red-500 shrink-0" /> {t.tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-extrabold tracking-tight mb-6">Health Insights 🩺</h1>
      {conditions.length > 0 ? (
        conditions.map(c => <ConditionCard key={c} name={c} />)
      ) : (
        <div className="glass-card p-10 text-center text-gray-400">
          <CheckCircle2 size={40} className="mx-auto mb-4 text-lime-400" />
          <p className="text-sm font-bold">No chronic conditions listed.</p>
          <p className="text-xs">You're all clear! Keep up the healthy habits.</p>
        </div>
      )}
    </div>
  );
}
