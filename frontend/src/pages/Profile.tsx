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
    <div className="page-shell" style={{ paddingTop: 24 }}>

      {/* ▸ Header ─────────────────────────────── */}
      <header className="anim-fade-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem' }}>Profile</h1>
        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#72796a', marginTop: 4 }}>
          Manage your personal settings
        </p>
      </header>

      {/* ▸ Profile Card ───────────────────────── */}
      <div className="card-elevated anim-scale-up" style={{ overflow: 'hidden', marginBottom: 20 }}>
        {/* Banner */}
        <div style={{ height: 72, background: 'linear-gradient(135deg, #bef264, #4d7c0f)' }} />

        <div style={{ padding: '0 20px 20px' }}>
          {/* Avatar */}
          <div style={{ marginTop: -40, marginBottom: 14, position: 'relative', zIndex: 2 }}>
            <div style={{
              width: 76, height: 76, borderRadius: '50%',
              background: 'linear-gradient(135deg, #bef264, #65a30d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 4px white, 0 8px 24px rgba(0,0,0,0.1)',
              fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)',
              color: '#3d6a00',
            }}>
              {profile?.name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
          </div>

          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1b1c18', fontFamily: 'var(--font-display)' }}>
            {profile?.name || 'User'}
          </h2>
          <p style={{
            fontSize: '0.625rem', fontWeight: 700, color: '#72796a',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4, marginBottom: 16,
          }}>
            {profile?.diet_preference} · {profile?.goal?.replace('_', ' ')}
          </p>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {statsItems.map((s) => (
              <div key={s.label} style={{
                background: '#f0f0eb', borderRadius: 14, padding: '12px 8px', textAlign: 'center',
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 16, color: '#3d6a00', fontVariationSettings: "'FILL' 1",
                }}>{s.icon}</span>
                <div style={{
                  fontSize: '0.8125rem', fontWeight: 800, color: '#1b1c18',
                  fontFamily: 'var(--font-display)', marginTop: 4,
                }}>{s.value}</div>
                <div style={{
                  fontSize: '0.5rem', fontWeight: 700, color: '#a1a79a',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2,
                }}>{s.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ▸ Menu Items ─────────────────────────── */}
      <div className="anim-fade-up anim-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="card"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, padding: '18px', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 14, background: '#ecfccb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ color: '#3d6a00', fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-display)', color: '#1b1c18' }}>{item.label}</div>
                <div style={{ fontSize: '0.6875rem', color: '#72796a', marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
            <span className="material-symbols-outlined" style={{ color: '#c6c8b9', fontSize: 18 }}>chevron_right</span>
          </button>
        ))}
      </div>

      {/* ▸ Reset Button ───────────────────────── */}
      <div className="anim-fade-up anim-delay-2" style={{ paddingBottom: 16 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '16px', borderRadius: 20,
            border: '1px solid rgba(239,68,68,0.15)',
            background: 'rgba(254,242,242,0.6)', color: '#ef4444',
            fontWeight: 700, fontSize: '0.8125rem', fontFamily: 'var(--font-display)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>restart_alt</span>
          Reset Data & Re-onboard
        </button>
      </div>
    </div>
  );
}
