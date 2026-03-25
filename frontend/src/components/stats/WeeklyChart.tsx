interface WeeklyChartProps {
  data: { day: string; calories: number }[];
  goal: number;
}

const WeeklyChart = ({ data, goal }: WeeklyChartProps) => {
  const max = Math.max(...data.map((d) => d.calories), goal, 1);

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 6, height: 140,
        padding: '0 4px',
      }}>
        {data.map((day, i) => {
          const pct = Math.min((day.calories / (max * 1.15)) * 100, 100);
          const isToday = i === data.length - 1;
          return (
            <div key={day.day + i} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end',
            }}>
              <span style={{
                fontSize: '0.5625rem', fontWeight: 600, color: 'var(--tb-text-secondary)',
                fontFamily: 'var(--font-display)',
              }}>{day.calories}</span>
              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height: 100 }}>
                <div style={{
                  width: '100%', borderRadius: 8,
                  height: `${Math.max(pct, 4)}%`,
                  background: isToday
                    ? 'linear-gradient(180deg, #bef264 0%, #65a30d 100%)'
                    : 'rgba(163,230,53,0.25)',
                  transition: 'height 0.7s cubic-bezier(.22,1,.36,1)',
                  boxShadow: isToday ? '0 2px 8px rgba(101,163,13,0.3)' : 'none',
                }} />
              </div>
              <span style={{
                fontSize: '0.5625rem', fontWeight: isToday ? 800 : 600,
                color: isToday ? 'var(--tb-accent-dark)' : 'var(--tb-text-muted)',
                fontFamily: 'var(--font-display)',
              }}>{day.day}</span>
            </div>
          );
        })}
      </div>
      {/* Goal line */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginTop: 12,
      }}>
        <div style={{ flex: 1, height: 1, borderTop: '1.5px dashed rgba(101,163,13,0.3)' }} />
        <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#65a30d', fontFamily: 'var(--font-display)' }}>Goal: {goal}</span>
        <div style={{ flex: 1, height: 1, borderTop: '1.5px dashed rgba(101,163,13,0.3)' }} />
      </div>
    </div>
  );
};

export default WeeklyChart;
