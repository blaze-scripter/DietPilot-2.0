interface MacroDonutProps {
  protein: number;
  carbs: number;
  fat: number;
}

const MacroDonut = ({ protein, carbs, fat }: MacroDonutProps) => {
  const total = protein + carbs + fat;
  const r = 60;
  const circumference = 2 * Math.PI * r;

  const proteinPct = protein / total;
  const carbsPct = carbs / total;
  const fatPct = fat / total;

  const proteinLen = proteinPct * circumference;
  const carbsLen = carbsPct * circumference;
  const fatLen = fatPct * circumference;

  const proteinOffset = 0;
  const carbsOffset = -(proteinLen);
  const fatOffset = -(proteinLen + carbsLen);

  const legend = [
    { label: "Protein", value: protein, pct: Math.round(proteinPct * 100), color: "hsl(var(--tb-protein))" },
    { label: "Carbs", value: carbs, pct: Math.round(carbsPct * 100), color: "hsl(var(--tb-carbs))" },
    { label: "Fat", value: fat, pct: Math.round(fatPct * 100), color: "hsl(var(--tb-fat))" },
  ];

  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="text-sm font-bold text-foreground mb-4">Macro Split (Avg)</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
            {/* Protein */}
            <circle cx="70" cy="70" r={r} fill="none" stroke="hsl(var(--tb-protein))" strokeWidth="16" strokeLinecap="round"
              strokeDasharray={`${proteinLen} ${circumference - proteinLen}`}
              strokeDashoffset={proteinOffset} />
            {/* Carbs */}
            <circle cx="70" cy="70" r={r} fill="none" stroke="hsl(var(--tb-carbs))" strokeWidth="16" strokeLinecap="round"
              strokeDasharray={`${carbsLen} ${circumference - carbsLen}`}
              strokeDashoffset={carbsOffset} />
            {/* Fat */}
            <circle cx="70" cy="70" r={r} fill="none" stroke="hsl(var(--tb-fat))" strokeWidth="16" strokeLinecap="round"
              strokeDasharray={`${fatLen} ${circumference - fatLen}`}
              strokeDashoffset={fatOffset} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">{total}g</span>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.value}g · {item.pct}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MacroDonut;
