import DashboardLayout from "@/components/layout/DashboardLayout";
import CalorieRing from "@/components/dashboard/CalorieRing";
import MacroBar from "@/components/dashboard/MacroBar";
import MealCard from "@/components/dashboard/MealCard";
import { userProfile, todayLog } from "@/data/mockData";
import { Plus } from "lucide-react";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const Dashboard = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <p className="text-sm text-muted-foreground font-medium">{today}</p>
        <h1 className="text-2xl font-bold text-foreground mt-1">
          {getGreeting()}, {userProfile.name} 👋
        </h1>
      </div>

      {/* Calorie Ring */}
      <div className="glass rounded-3xl p-6 mb-5">
        <CalorieRing consumed={todayLog.calories} goal={userProfile.goalCalories} />
      </div>

      {/* Macro Progress */}
      <div className="glass rounded-3xl p-5 mb-5 space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-sm font-bold text-foreground mb-3">Macros</h2>
        <MacroBar label="Protein" current={todayLog.protein} goal={userProfile.goalProtein} color="hsl(var(--tb-protein))" />
        <MacroBar label="Carbs" current={todayLog.carbs} goal={userProfile.goalCarbs} color="hsl(var(--tb-carbs))" />
        <MacroBar label="Fat" current={todayLog.fat} goal={userProfile.goalFat} color="hsl(var(--tb-fat))" />
      </div>

      {/* Today's Meals */}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Today's Meals</h2>
          <span className="text-xs text-muted-foreground">{todayLog.meals.length} logged</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide">
          {todayLog.meals.map((meal) => (
            <MealCard key={meal.id} {...meal} />
          ))}
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center active:scale-95 transition-transform">
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>
    </DashboardLayout>
  );
};

export default Dashboard;
