interface MacroDonutProps {
  protein: number;
  carbs: number;
  fat: number;
}

const MacroDonut = ({ protein, carbs, fat }: MacroDonutProps) => {
  const total = protein + carbs + fat;
  const r = 60;
  const circumference = 2 * Math.PI * r;

  const proteinPct = total > 0 ? protein / total : 0;
  const carbsPct = total > 0 ? carbs / total : 0;
  const fatPct = total > 0 ? fat / total : 0;

  const proteinLen = proteinPct * circumference;
  const carbsLen = carbsPct * circumference;
  const fatLen = fatPct * circumference;

  const proteinOffset = 0;
  const carbsOffset = -(proteinLen);
  const fatOffset = -(proteinLen + carbsLen);

  const legend = [
    { label: "Protein", value: protein, pct: Math.round(proteinPct * 100), color: "#a3e635" },
    { label: "Carbs", value: carbs, pct: Math.round(carbsPct * 100), color: "#fbbf24" },
    { label: "Fat", value: fat, pct: Math.round(fatPct * 100), color: "#f87171" },
  ];

  return (
    <div className="glass rounded-3xl p-5 border border-outline-variant/15 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface mb-4">Macro Split (Avg)</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
            {/* Background ring if total = 0 */}
            {total === 0 && (
              <circle cx="70" cy="70" r={r} fill="none" stroke="#eeeeee" strokeWidth="16" strokeLinecap="round" />
            )}
            {total > 0 && (
              <>
                {/* Protein */}
                <circle cx="70" cy="70" r={r} fill="none" stroke="#a3e635" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray={`${proteinLen} ${circumference - proteinLen}`}
                  strokeDashoffset={proteinOffset} className="transition-all duration-1000" />
                {/* Carbs */}
                <circle cx="70" cy="70" r={r} fill="none" stroke="#fbbf24" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray={`${carbsLen} ${circumference - carbsLen}`}
                  strokeDashoffset={carbsOffset} className="transition-all duration-1000" />
                {/* Fat */}
                <circle cx="70" cy="70" r={r} fill="none" stroke="#f87171" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray={`${fatLen} ${circumference - fatLen}`}
                  strokeDashoffset={fatOffset} className="transition-all duration-1000" />
              </>
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-on-surface">{Math.round(total)}g</span>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-on-surface">{item.label}</p>
                <p className="text-[10px] text-on-surface-variant">{Math.round(item.value)}g · {item.pct}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MacroDonut;
