interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit?: string;
}

const MacroBar = ({ label, current, goal, color, unit = "g" }: MacroBarProps) => {
  const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 text-right">
        <span className="text-xs font-semibold" style={{ color: 'var(--on-surface)' }}>{label}</span>
      </div>
      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ background: 'var(--surface-container-high)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: pct > 0 ? `${pct}%` : '0%',
            minWidth: current > 0 ? '8px' : '0',
            backgroundColor: color,
            transition: 'width 0.7s ease-out',
            boxShadow: pct > 0 ? `0 0 6px ${color}40` : 'none',
          }}
        />
      </div>
      <div className="w-20 text-left">
        <span className="text-xs tabular-nums" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>
          {current}/{goal}{unit}
        </span>
      </div>
    </div>
  );
};

export default MacroBar;
