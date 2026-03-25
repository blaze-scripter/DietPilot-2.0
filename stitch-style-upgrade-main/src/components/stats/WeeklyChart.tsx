import { weeklyStats, userProfile } from "@/data/mockData";

const WeeklyChart = () => {
  const max = Math.max(...weeklyStats.map((d) => d.calories));

  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">Daily Calories</h3>
      <div className="flex items-end gap-2 h-36">
        {weeklyStats.map((day, i) => {
          const pct = (day.calories / (max * 1.15)) * 100;
          const isToday = i === weeklyStats.length - 1;
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground font-medium">{day.calories}</span>
              <div className="w-full flex items-end" style={{ height: "100px" }}>
                <div
                  className={`w-full rounded-lg transition-all duration-700 ${
                    isToday ? "bg-primary" : "bg-primary/30"
                  }`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className={`text-[10px] font-semibold ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
      {/* Goal line label */}
      <div className="flex items-center gap-2 mt-3">
        <div className="h-px flex-1 border-t border-dashed border-primary/40" />
        <span className="text-[10px] text-primary font-medium">Goal: {userProfile.goalCalories}</span>
        <div className="h-px flex-1 border-t border-dashed border-primary/40" />
      </div>
    </div>
  );
};

export default WeeklyChart;
