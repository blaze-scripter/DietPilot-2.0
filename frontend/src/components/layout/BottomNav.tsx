import { useApp } from '@/main';

const tabs = [
  { id: '/dashboard', label: 'Home', icon: 'home' },
  { id: '/stats', label: 'Stats', icon: 'bar_chart' },
  { id: '/workouts', label: 'Workouts', icon: 'fitness_center' },
  { id: '/meals', label: 'Meals', icon: 'restaurant' },
  { id: '/reminders', label: 'Reminders', icon: 'notifications' },
  { id: '/profile', label: 'Profile', icon: 'person' },
];

export default function BottomNav() {
  const { currentPath, navigate } = useApp();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      zIndex: 50,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '6px 4px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(40px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.5)',
        borderTop: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 -2px 20px rgba(0,0,0,0.04)',
      }}>
        {tabs.map((tab) => {
          const isActive = currentPath === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '6px 0',
                minWidth: 0,
                flex: 1,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? 'rgba(163,230,53,0.18)' : 'transparent',
                transition: 'background 0.2s ease',
              }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 20,
                    color: isActive ? '#3d6a00' : '#72796a',
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                    transition: 'color 0.2s ease, font-variation-settings 0.2s ease',
                  }}
                >
                  {tab.icon}
                </span>
              </div>
              <span style={{
                fontSize: '0.5625rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#3d6a00' : '#72796a',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.01em',
                transition: 'color 0.2s ease',
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
