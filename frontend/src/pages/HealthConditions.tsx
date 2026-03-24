import { useState, useEffect } from 'react';
import { useApp } from '@/main';
import { healthApi } from '@/services/api';
import { ChevronLeft } from 'lucide-react';

const CONDITIONS = [
  { value: 'diabetes', label: 'Diabetes', emoji: '🩸' },
  { value: 'hypertension', label: 'Hypertension', emoji: '❤️' },
  { value: 'PCOS', label: 'PCOS', emoji: '🩺' },
  { value: 'high_cholesterol', label: 'High Cholesterol', emoji: '🫀' },
  { value: 'thyroid', label: 'Thyroid', emoji: '🦋' },
];

export default function HealthConditions() {
  const { profile, navigate } = useApp();
  const [tips, setTips] = useState<Record<string, any[]>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const conditions = profile?.health_conditions || [];
      const allTips: Record<string, any[]> = {};
      for (const c of conditions) {
        try { allTips[c] = await healthApi.getTips(c); } catch { allTips[c] = []; }
      }
      setTips(allTips);
      if (conditions.length) setSelected(conditions[0]);
      setLoading(false);
    })();
  }, [profile]);

  const userConds = (profile?.health_conditions || []) as string[];

  if (userConds.length === 0) {
    return (
      <div className="page-container">
        <button onClick={() => navigate('/dashboard')} className="btn-icon mb-4"><ChevronLeft size={20} /></button>
        <div className="text-center py-16 animate-fadeIn">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-lg font-extrabold mb-2">No Health Conditions</h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>You haven't listed any health conditions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-6 animate-fadeIn">
        <button onClick={() => navigate('/dashboard')} className="btn-icon"><ChevronLeft size={20} /></button>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Health Guide</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Do's and Don'ts</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {userConds.map((c) => {
          const cond = CONDITIONS.find((x) => x.value === c);
          return (
            <button key={c} onClick={() => setSelected(c)}
              className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: selected === c ? 'var(--primary)' : 'white',
                color: selected === c ? '#1a2e05' : 'var(--foreground)',
                border: `1px solid ${selected === c ? 'var(--primary)' : '#e5e7eb'}`,
              }}>
              {cond?.emoji} {cond?.label || c}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>Loading...</p>
      ) : selected && tips[selected] ? (
        <div className="space-y-3">
          {tips[selected].map((tip, i) => (
            <div key={i} className="glass-card p-4 animate-slideUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tip.icon || '💡'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold">{tip.title}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        background: tip.type === 'dont' ? '#fee2e2' : '#d1fae5',
                        color: tip.type === 'dont' ? '#991b1b' : '#065f46',
                      }}>
                      {tip.type === 'dont' ? "DON'T" : 'DO'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{tip.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
