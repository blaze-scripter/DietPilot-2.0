interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit?: string;
}

const MacroBar = ({ label, current, goal, color, unit = "g" }: MacroBarProps) => {
  const pct = Math.min((current / goal) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 text-right">
        <span className="text-xs font-semibold text-on-surface">{label}</span>
      </div>
      <div className="flex-1 h-3 rounded-full bg-surface-container overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="w-20 text-left">
        <span className="text-xs font-medium text-on-surface-variant">
          {Math.round(current)}/{goal}{unit}
        </span>
      </div>
    </div>
  );
};

export default MacroBar;
