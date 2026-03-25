interface WeeklyChartProps {
  data: { day: string; calories: number }[];
  goal: number;
}

const WeeklyChart = ({ data, goal }: WeeklyChartProps) => {
  const max = Math.max(...data.map((d) => d.calories), goal, 1);

  return (
    <div className="glass rounded-3xl p-5 border border-outline-variant/15 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface mb-4">Daily Calories</h3>
      <div className="flex items-end gap-2 h-36">
        {data.map((day, i) => {
          const pct = Math.min((day.calories / (max * 1.15)) * 100, 100);
          const isToday = i === data.length - 1;
          return (
            <div key={day.day + i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-on-surface-variant font-medium">{day.calories}</span>
              <div className="w-full flex items-end" style={{ height: "100px" }}>
                <div
                  className={`w-full rounded-lg transition-all duration-700 ${
                    isToday ? "bg-primary" : "bg-primary/30"
                  }`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className={`text-[10px] font-semibold ${isToday ? "text-primary" : "text-on-surface-variant"}`}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
      {/* Goal line label */}
      <div className="flex items-center gap-2 mt-3">
        <div className="h-px flex-1 border-t border-dashed border-primary/40" />
        <span className="text-[10px] text-primary font-medium">Goal: {goal}</span>
        <div className="h-px flex-1 border-t border-dashed border-primary/40" />
      </div>
    </div>
  );
};

export default WeeklyChart;
