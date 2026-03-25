interface MacroDonutProps {
  protein: number;
  carbs: number;
  fat: number;
}

const MacroDonut = ({ protein, carbs, fat }: MacroDonutProps) => {
  const total = protein + carbs + fat;
  const r = 56;
  const circumference = 2 * Math.PI * r;

  const proteinPct = total > 0 ? protein / total : 0;
  const carbsPct = total > 0 ? carbs / total : 0;
  const fatPct = total > 0 ? fat / total : 0;

  const proteinLen = proteinPct * circumference;
  const carbsLen = carbsPct * circumference;
  const fatLen = fatPct * circumference;

  const carbsOffset = -(proteinLen);
  const fatOffset = -(proteinLen + carbsLen);

  const legend = [
    { label: 'Protein', value: protein, pct: Math.round(proteinPct * 100), color: '#a3e635' },
    { label: 'Carbs', value: carbs, pct: Math.round(carbsPct * 100), color: '#fbbf24' },
    { label: 'Fat', value: fat, pct: Math.round(fatPct * 100), color: '#f87171' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {/* Donut */}
      <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
        <svg viewBox="0 0 130 130" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          {total === 0 && (
            <circle cx="65" cy="65" r={r} fill="none" stroke="#e9e9e4" strokeWidth="14" strokeLinecap="round" />
          )}
          {total > 0 && (
            <>
              <circle cx="65" cy="65" r={r} fill="none" stroke="#a3e635" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={`${proteinLen} ${circumference - proteinLen}`}
                strokeDashoffset={0} style={{ transition: 'all 0.8s ease' }} />
              <circle cx="65" cy="65" r={r} fill="none" stroke="#fbbf24" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={`${carbsLen} ${circumference - carbsLen}`}
                strokeDashoffset={carbsOffset} style={{ transition: 'all 0.8s ease' }} />
              <circle cx="65" cy="65" r={r} fill="none" stroke="#f87171" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={`${fatLen} ${circumference - fatLen}`}
                strokeDashoffset={fatOffset} style={{ transition: 'all 0.8s ease' }} />
            </>
          )}
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1b1c18', fontFamily: 'var(--font-display)' }}>
            {Math.round(total)}g
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {legend.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1b1c18', fontFamily: 'var(--font-display)' }}>{item.label}</p>
              <p style={{ fontSize: '0.625rem', fontWeight: 500, color: '#72796a' }}>{Math.round(item.value)}g · {item.pct}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MacroDonut;
