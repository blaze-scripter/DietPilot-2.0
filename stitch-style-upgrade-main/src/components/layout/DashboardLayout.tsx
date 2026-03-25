import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle gradient orbs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-56 h-56 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <main className="relative z-10 safe-top pb-24 px-5 max-w-lg mx-auto">
        {children}
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
