import DashboardLayout from "@/components/layout/DashboardLayout";
import WeeklyChart from "@/components/stats/WeeklyChart";
import MacroDonut from "@/components/stats/MacroDonut";
import { weeklyStats, streakDays } from "@/data/mockData";
import { Flame, TrendingUp, Zap } from "lucide-react";

const Stats = () => {
  const avgCal = Math.round(weeklyStats.reduce((s, d) => s + d.calories, 0) / weeklyStats.length);
  const avgProtein = Math.round(weeklyStats.reduce((s, d) => s + d.protein, 0) / weeklyStats.length);
  const avgCarbs = Math.round(weeklyStats.reduce((s, d) => s + d.carbs, 0) / weeklyStats.length);
  const avgFat = Math.round(weeklyStats.reduce((s, d) => s + d.fat, 0) / weeklyStats.length);

  const summaryCards = [
    { label: "Avg Calories", value: avgCal.toLocaleString(), unit: "kcal", icon: Flame, color: "text-primary" },
    { label: "Avg Protein", value: `${avgProtein}g`, unit: "", icon: Zap, color: "text-tb-protein" },
    { label: "Streak", value: `${streakDays}`, unit: "days", icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Weekly Stats</h1>
        <p className="text-sm text-muted-foreground mt-1">Mar 17 – Mar 23, 2026</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5 animate-fade-in">
        {summaryCards.map((card) => (
          <div key={card.label} className="glass rounded-2xl p-3 text-center">
            <card.icon className={`w-5 h-5 mx-auto mb-1 ${card.color}`} strokeWidth={2} />
            <p className="text-lg font-bold text-foreground">{card.value}</p>
            <p className="text-[10px] text-muted-foreground">{card.label}{card.unit ? ` (${card.unit})` : ""}</p>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="mb-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <WeeklyChart />
      </div>

      {/* Macro Donut */}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <MacroDonut protein={avgProtein} carbs={avgCarbs} fat={avgFat} />
      </div>
    </DashboardLayout>
  );
};

export default Stats;
