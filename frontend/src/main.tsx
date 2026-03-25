import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@/lib/ThemeContext';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { profileApi, dailyLogApi } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import Stats from '@/pages/Stats';
import Meals from '@/pages/Meals';
import Workouts from '@/pages/Workouts';
import Reminders from '@/pages/Reminders';
import Profile from '@/pages/Profile';
import HealthConditions from '@/pages/HealthConditions';

import Logo from '@/components/ui/Logo';

// ===== APP CONTEXT =====
interface AppContextType {
  currentPath: string;
  navState?: any;
  navigate: (path: string, options?: { state?: any }) => void;
  profile: any;
  setProfile: (p: any) => void;
  dailyLog: any;
  refreshLog: () => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

// ===== APP PROVIDER =====
function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState('/');
  const [navState, setNavState] = useState<any>(undefined);
  const [profile, setProfile] = useState<any>(null);
  const [dailyLog, setDailyLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useCallback((path: string, options?: { state?: any }) => {
    setCurrentPath(path);
    setNavState(options?.state);
  }, []);

  const refreshLog = useCallback(async () => {
    try {
      const log = await dailyLogApi.get();
      setDailyLog(log);
    } catch {
      setDailyLog(null);
    }
  }, []);

  // Initial load — reads from IndexedDB
  useEffect(() => {
    async function init() {
      try {
        const p = await profileApi.get();
        setProfile(p);
        await refreshLog();
        setCurrentPath('/dashboard');
      } catch {
        setCurrentPath('/onboarding');
      }
      setLoading(false);
    }
    init();
  }, [refreshLog]);

  return (
    <AppContext.Provider value={{ currentPath, navState, navigate, profile, setProfile, dailyLog, refreshLog, loading }}>
      {children}
    </AppContext.Provider>
  );
}

// ===== ROUTER =====
function Router() {
  const { currentPath, loading } = useApp();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--tb-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <Logo className="animate-float" style={{ width: 80, height: 80, margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--tb-text)' }}>Track Bite</h1>
          <p style={{ fontSize: '0.875rem', marginTop: 8, color: 'var(--tb-text-secondary)' }}>Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (currentPath === '/onboarding') {
    return <Onboarding />;
  }

  const pageMap: Record<string, React.ReactNode> = {
    '/dashboard': <Dashboard />,
    '/stats': <Stats />,
    '/workouts': <Workouts />,
    '/meals': <Meals />,
    '/reminders': <Reminders />,
    '/profile': <Profile />,
    '/health-conditions': <HealthConditions />,
  };

  return (
    <DashboardLayout>
      {pageMap[currentPath] || <Dashboard />}
    </DashboardLayout>
  );
}

// ===== MOUNT =====
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppProvider>
        <Router />
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>
);
