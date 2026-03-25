import { useApp } from '@/main';
import { clearAllData } from '@/services/storage';

export default function Profile() {
  const { profile, navigate, setProfile } = useApp();

  const handleLogout = async () => {
    if (!window.confirm('Clear all data and restart onboarding?')) return;
    await clearAllData();
    setProfile(null);
    navigate('/onboarding');
  };

  const menuItems = [
    { label: 'Update My Targets', icon: 'monitoring', desc: 'Recalculate BMR, TDEE & macros', path: '/onboarding' },
    { label: 'Health Conditions', icon: 'health_and_safety', desc: 'Conditions & preferences', path: '/health-conditions' },
  ];

  const statsItems = [
    { label: 'Weight', value: profile?.weight_kg, unit: 'kg', icon: 'scale' },
    { label: 'Height', value: profile?.height_cm, unit: 'cm', icon: 'height' },
    { label: 'Calories', value: profile?.targets?.calories, unit: 'kcal', icon: 'local_fire_department' },
    { label: 'Protein', value: profile?.targets?.protein, unit: 'g', icon: 'egg_alt' },
  ];

  return (
    <div className="page-container relative" style={{ paddingTop: 'env(safe-area-inset-top, 2.5rem)', paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Lime glow background */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none -z-10" style={{ background: 'radial-gradient(circle, rgba(163,230,53,0.12) 0%, transparent 70%)', transform: 'translate(25%, -25%)' }} />

      {/* Header */}
      <div className="px-4 pt-12 pb-6 animate-slideUp" style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 30px))' }}>
        <h1 className="text-3xl font-extrabold tracking-tight font-headline text-on-surface leading-none mb-1">Profile</h1>
        <p className="text-sm text-on-surface-variant font-medium">Manage your personal settings</p>
      </div>

      {/* Profile Card */}
      <div className="mx-4 mb-5 animate-slideUp" style={{ animationDelay: '0.05s' }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)',
            borderRadius: '1.75rem',
            boxShadow: '0 30px 60px -12px rgba(45,47,47,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Banner */}
          <div style={{ height: 72, background: 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)' }} />

          <div className="px-5 pb-5">
            {/* Avatar */}
            <div style={{ marginTop: -44, marginBottom: 12, position: 'relative', zIndex: 2 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #a3e635, #84cc16)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 4px white,  0 8px 24px rgba(0,0,0,0.1)',
                fontSize: '2rem', fontWeight: 900, fontFamily: 'Plus Jakarta Sans', color: '#416400',
              }}>
                {profile?.name?.charAt(0)?.toUpperCase() || 'P'}
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-extrabold font-headline text-on-surface">{profile?.name || 'User'}</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant capitalize mt-1">
                {profile?.diet_preference} · {profile?.goal?.replace('_', ' ')}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2">
              {statsItems.map((s) => (
                <div key={s.label}
                  style={{ background: '#f3f3f4', borderRadius: '0.875rem', padding: '10px 8px', textAlign: 'center' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#446900', fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  <div className="text-sm font-extrabold font-headline text-on-surface mt-0.5">{s.value}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">{s.unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-3 mb-5 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '18px', borderRadius: '1.25rem', border: 'none',
              background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)',
              boxShadow: '0 2px 12px rgba(45,47,47,0.05)', cursor: 'pointer',
              transition: 'all 0.2s ease', textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '0.875rem', background: '#ecfccb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#446900', fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c' }}>{item.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#5a5c5c', marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
            <span className="material-symbols-outlined" style={{ color: '#c2cab0', fontSize: 20 }}>chevron_right</span>
          </button>
        ))}
      </div>

      {/* Reset */}
      <div className="px-4 pb-8 animate-slideUp" style={{ animationDelay: '0.15s' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '16px', borderRadius: '1.25rem', border: '1px solid rgba(239,68,68,0.15)',
            background: 'rgba(254,242,242,0.6)', color: '#ef4444',
            fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Plus Jakarta Sans', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>restart_alt</span>
          Reset Data &amp; Re-onboard
        </button>
      </div>
    </div>
  );
}
