import BottomNav from './BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen" style={{ paddingBottom: '80px' }}>
      {children}
      <BottomNav />
    </div>
  );
}
