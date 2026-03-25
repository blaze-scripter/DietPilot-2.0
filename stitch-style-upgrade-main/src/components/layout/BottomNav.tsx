import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, BarChart3, User } from "lucide-react";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/meals", icon: UtensilsCrossed, label: "Meals" },
  { path: "/stats", icon: BarChart3, label: "Stats" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong rounded-t-3xl" style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.5rem)" }}>
      <div className="flex items-center justify-around px-4 py-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-300 ${
                active
                  ? "bg-primary/15 text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${active ? "text-primary" : ""}`}>{label}</span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
