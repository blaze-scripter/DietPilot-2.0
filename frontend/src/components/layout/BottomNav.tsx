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
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full"
      style={{ maxWidth: '480px', zIndex: 40 }}
    >
      <div
        className="flex items-center justify-around px-1 py-2"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderTop: '1px solid rgba(194,202,176,0.15)',
          boxShadow: '0 -4px 24px rgba(45,47,47,0.06)',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 20px))',
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentPath === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200"
              style={{ minWidth: '52px' }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(163,230,53,0.2)' : 'transparent',
                }}
              >
                <span
                  className="material-symbols-outlined transition-all duration-200"
                  style={{
                    fontSize: 22,
                    color: isActive ? '#446900' : '#5a5c5c',
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                  }}
                >
                  {tab.icon}
                </span>
              </div>
              <span
                className="text-[10px] font-bold transition-colors duration-200"
                style={{ color: isActive ? '#446900' : '#5a5c5c' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
