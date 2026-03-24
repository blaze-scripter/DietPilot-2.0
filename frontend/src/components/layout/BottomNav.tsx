import { useApp } from '@/main';
import { Home, BarChart3, Dumbbell, UtensilsCrossed, Bell, User } from 'lucide-react';

const tabs = [
  { id: '/dashboard', label: 'Home', icon: Home },
  { id: '/stats', label: 'Stats', icon: BarChart3 },
  { id: '/workouts', label: 'Workouts', icon: Dumbbell },
  { id: '/meals', label: 'Meals', icon: UtensilsCrossed },
  { id: '/reminders', label: 'Reminders', icon: Bell },
  { id: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const { currentPath, navigate } = useApp();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full"
      style={{
        maxWidth: '480px',
        zIndex: 40,
      }}
    >
      <div
        className="flex items-center justify-around px-2 py-2"
        style={{
          background: 'rgba(28, 28, 30, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentPath === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200"
              style={{
                background: isActive ? 'rgba(163, 230, 53, 0.12)' : 'transparent',
                minWidth: '56px',
              }}
            >
              <div
                className="transition-all duration-200"
                style={{
                  color: isActive ? '#a3e635' : '#9ca3af',
                  filter: isActive ? 'drop-shadow(0 0 6px rgba(163, 230, 53, 0.5))' : 'none',
                }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className="text-[10px] font-semibold transition-colors duration-200"
                style={{ color: isActive ? '#a3e635' : '#6b7280' }}
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
