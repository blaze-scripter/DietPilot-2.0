import { useApp } from '@/main';
import { useTheme } from '@/lib/ThemeContext';
import { clearAllData } from '@/services/storage';

type ThemeMode = 'light' | 'dark' | 'system';

export default function Profile() {
  const { profile, navigate, setProfile } = useApp();
  const { theme, setTheme, resolvedTheme } = useTheme();

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

  const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'system', label: 'System', icon: 'contrast' },
  ];

  return (
    <div className="page-shell" style={{ paddingTop: 24 }}>

      {/* ▸ Header ─────────────────────────────── */}
      <header className="anim-fade-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem' }}>Profile</h1>
        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--tb-text-secondary)', marginTop: 4 }}>
          Manage your personal settings
        </p>
      </header>

      {/* ▸ Profile Card ───────────────────────── */}
      <div className="card-elevated anim-scale-up" style={{ overflow: 'hidden', marginBottom: 20 }}>
        {/* Banner */}
        <div style={{ height: 72, background: 'var(--tb-accent-gradient)' }} />

        <div style={{ padding: '0 20px 20px' }}>
          {/* Avatar */}
          <div style={{ marginTop: -40, marginBottom: 14, position: 'relative', zIndex: 2 }}>
            <div style={{
              width: 76, height: 76, borderRadius: '50%',
              background: 'var(--tb-avatar-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 0 4px var(--tb-surface-solid), 0 8px 24px rgba(0,0,0,0.1)`,
              fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)',
              color: 'var(--tb-accent-dark)',
            }}>
              {profile?.name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
          </div>

          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--tb-text)', fontFamily: 'var(--font-display)' }}>
            {profile?.name || 'User'}
          </h2>
          <p style={{
            fontSize: '0.625rem', fontWeight: 700, color: 'var(--tb-text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4, marginBottom: 16,
          }}>
            {profile?.diet_preference} · {profile?.goal?.replace('_', ' ')}
          </p>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {statsItems.map((s) => (
              <div key={s.label} style={{
                background: 'var(--tb-input-bg)', borderRadius: 14, padding: '12px 8px', textAlign: 'center',
                transition: 'background 0.3s ease',
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 16, color: 'var(--tb-accent-dark)', fontVariationSettings: "'FILL' 1",
                }}>{s.icon}</span>
                <div style={{
                  fontSize: '0.8125rem', fontWeight: 800, color: 'var(--tb-text)',
                  fontFamily: 'var(--font-display)', marginTop: 4,
                }}>{s.value}</div>
                <div style={{
                  fontSize: '0.5rem', fontWeight: 700, color: 'var(--tb-text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2,
                }}>{s.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ▸ Theme Selector ────────────────────────── */}
      <div className="card anim-fade-up anim-delay-1" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14, background: 'var(--tb-accent-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--tb-accent-dark)', fontVariationSettings: "'FILL' 1" }}>
              {resolvedTheme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-display)', color: 'var(--tb-text)' }}>Theme</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--tb-text-secondary)', marginTop: 2 }}>Choose your visual style</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {themeOptions.map((opt) => {
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '12px 8px', borderRadius: 14, border: 'none',
                  background: isActive ? 'var(--tb-accent-muted)' : 'var(--tb-input-bg)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 0 2px var(--tb-accent)' : 'none',
                }}
              >
                <span className="material-symbols-outlined" style={{
                  fontSize: 20,
                  color: isActive ? 'var(--tb-accent-dark)' : 'var(--tb-text-secondary)',
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}>{opt.icon}</span>
                <span style={{
                  fontSize: '0.6875rem', fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--tb-accent-dark)' : 'var(--tb-text-secondary)',
                  fontFamily: 'var(--font-display)',
                }}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ▸ Menu Items ─────────────────────────── */}
      <div className="anim-fade-up anim-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
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
                width: 42, height: 42, borderRadius: 14, background: 'var(--tb-accent-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--tb-accent-dark)', fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-display)', color: 'var(--tb-text)' }}>{item.label}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--tb-text-secondary)', marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
            <span className="material-symbols-outlined" style={{ color: 'var(--tb-text-muted)', fontSize: 18 }}>chevron_right</span>
          </button>
        ))}
      </div>

      {/* ▸ Reset Button ───────────────────────── */}
      <div className="anim-fade-up anim-delay-3" style={{ paddingBottom: 16 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '16px', borderRadius: 20,
            border: `1px solid var(--tb-error-border)`,
            background: 'var(--tb-error-bg)', color: 'var(--tb-error)',
            fontWeight: 700, fontSize: '0.8125rem', fontFamily: 'var(--font-display)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.2s ease',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>restart_alt</span>
          Reset Data & Re-onboard
        </button>
      </div>
    </div>
  );
}
