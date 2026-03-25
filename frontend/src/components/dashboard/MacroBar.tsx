interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  icon?: string;
  unit?: string;
}

const MacroBar = ({ label, current, goal, color, icon, unit = "g" }: MacroBarProps) => {
  const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Icon dot */}
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
        boxShadow: `0 0 6px ${color}50`,
      }} />
      {/* Label */}
      <span style={{
        width: 52,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'var(--tb-text)',
        fontFamily: 'var(--font-display)',
      }}>
        {label}
      </span>
      {/* Track */}
      <div style={{
        flex: 1,
        height: 6,
        borderRadius: 100,
        background: 'var(--tb-input-bg)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          borderRadius: 100,
          width: `${pct}%`,
          minWidth: current > 0 ? 6 : 0,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          transition: 'width 0.8s cubic-bezier(.22,1,.36,1)',
          boxShadow: pct > 0 ? `0 0 8px ${color}35` : 'none',
        }} />
      </div>
      {/* Value */}
      <span style={{
        width: 64,
        fontSize: '0.6875rem',
        fontWeight: 500,
        color: 'var(--tb-text-secondary)',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {current}/{goal}{unit}
      </span>
    </div>
  );
};

export default MacroBar;
