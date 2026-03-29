import { useState, useEffect } from 'react';
import { useApp } from '@/main';
import { healthApi } from '@/services/api';

const CONDITIONS = [
  { value: 'diabetes', label: 'Diabetes', icon: 'blood_pressure', color: '#ef4444', bg: '#fee2e2' },
  { value: 'hypertension', label: 'Hypertension', icon: 'favorite', color: '#3b82f6', bg: '#dbeafe' },
  { value: 'PCOS', label: 'PCOS', icon: 'medical_services', color: '#8b5cf6', bg: '#ede9fe' },
  { value: 'high_cholesterol', label: 'High Cholesterol', icon: 'monitor_heart', color: '#f59e0b', bg: '#fef3c7' },
  { value: 'thyroid', label: 'Thyroid', icon: 'prescriptions', color: '#10b981', bg: '#d1fae5' },
];


export default function HealthConditions() {
  const { profile, navigate } = useApp();
  const [conditions, setConditions] = useState<any[]>([]);

  useEffect(() => {
    if (!profile?.health_conditions) return;
    setConditions(profile.health_conditions);
  }, [profile]);

  const [selected, setSelected] = useState<string | null>(profile?.health_conditions?.[0] || null);
  const [tips, setTips] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);

  const userConds = profile?.health_conditions || [];

  useEffect(() => {
    async function loadAll() {
      if (userConds.length === 0) return;
      setLoading(true);
      const newTips: Record<string, any[]> = {};
      
      for (const cond of userConds) {
        try {
          const data = await healthApi.getTips(cond);
          newTips[cond] = data || [];
        } catch { /* ignore */ }
      }
      
      setTips(newTips);
      if (!selected && userConds.length > 0) {
        setSelected(userConds[0]);
      }
      setLoading(false);
    }
    loadAll();
  }, [profile?.health_conditions]);  // If no conditions selected, show an empty state
  if (!loading && userConds.length === 0) {
    return (
      <div className="page-container relative h-[80vh] flex flex-col items-center justify-center">
        <button onClick={() => navigate('/dashboard')} className="absolute top-4 left-0 w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="w-24 h-24 rounded-full bg-primary-container text-primary-dark flex items-center justify-center mb-6 animate-scaleIn">
          <span className="material-symbols-outlined" style={{ fontSize: 48, fontVariationSettings: "'FILL' 1" }}>check_circle</span>

        </div>
        <h2 className="text-2xl font-display font-extrabold text-foreground mb-2 animate-slideUp">You're All Clear!</h2>
        <p className="text-sm font-medium text-muted text-center max-w-[250px] animate-slideUp" style={{ animationDelay: '0.1s' }}>
          You haven't listed any specific health conditions in your profile.
        </p>
        <button onClick={() => navigate('/profile')} className="mt-8 btn-primary px-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          Edit Profile
        </button>
      </div>
    );
  };

  return (

    <div className="page-container relative">
      <div className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-4 animate-slideUp">
        <button onClick={() => navigate('/dashboard')} className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors border border-gray-100 shadow-sm">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-display font-extrabold tracking-tight text-foreground leading-none mb-1">Health Guide</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Personalized Diet Tips</p>
        </div>
      </div>

      {/* Conditions Tabs */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide animate-slideUp" style={{ animationDelay: '0.05s' }}>
        {userConds.map((c: string) => {
          const cond = CONDITIONS.find((x) => x.value === c);
          const isSelected = selected === c;
          return (
            <button
              key={c}
              onClick={() => setSelected(c)}
              className="flex-shrink-0 flex items-center gap-2 p-1.5 pr-4 rounded-full transition-all border shadow-sm"
              style={{
                background: isSelected ? cond?.color || 'var(--primary-dark)' : 'var(--surface-container-low)',
                borderColor: isSelected ? 'transparent' : 'var(--card-border)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm"
                style={{ color: isSelected ? cond?.color || 'var(--primary-dark)' : 'var(--muted)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>
                  {cond?.icon || 'medical_information'}
                </span>
              </div>
              <span className="text-sm font-display font-bold whitespace-nowrap" style={{ color: isSelected ? 'white' : 'var(--foreground)' }}>
                {cond?.label || c.replace('_', ' ')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <span className="material-symbols-outlined animate-spin mb-4" style={{ fontSize: 32 }}>progress_activity</span>
            <p className="font-display font-medium text-sm">Loading guidelines...</p>
          </div>
        ) : selected && tips[selected] ? (
          <div className="flex flex-col gap-4 stagger-children">
            {tips[selected].map((tip, i) => {
              const isDo = tip.type !== 'dont';
              return (
                <div 
                  key={i} 
                  className="glass-card-stitch p-5 hover:scale-[1.01] transition-transform" 
                  style={{ 
                    borderRadius: 24,
                    borderLeft: `4px solid ${isDo ? '#10b981' : '#ef4444'}`
                  }}
                >
                  <div className="flex gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: isDo ? '#d1fae5' : '#fee2e2',
                        color: isDo ? '#059669' : '#dc2626'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}>
                        {isDo ? 'task_alt' : 'cancel'}
                      </span>
                    </div>
                    
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base font-display font-bold text-foreground leading-tight">{tip.title}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-on-surface-variant font-medium">{tip.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: 32 }}>info</span>
            <p className="text-sm font-medium">No guidelines found for this condition.</p>
          </div>
        )}
      </div>

    </div>
  );
}
