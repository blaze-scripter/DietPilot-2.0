import { useApp } from '@/main';
import BottomNav from './BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { navigate, profile } = useApp();

  return (
    <div className="relative min-h-screen" style={{ paddingBottom: '80px' }}>
      {/* Floating profile avatar — top right */}
      <button
        onClick={() => navigate('/profile')}
        aria-label="Profile"
        style={{
          position: 'fixed',
          top: 'max(12px, env(safe-area-inset-top, 12px))',
          right: 'max(16px, calc(50vw - 215px + 16px))',
          zIndex: 45,
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: 'none',
          background: 'var(--tb-avatar-gradient)',
          color: '#fff',
          fontWeight: 800,
          fontSize: '0.8125rem',
          fontFamily: 'var(--font-display)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(101,163,13,0.3)',
          transition: 'transform 0.25s cubic-bezier(.22,1,.36,1)',
          flexShrink: 0,
        }}
      >
        {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
      </button>

      {children}
      <BottomNav />
    </div>
  );
}
