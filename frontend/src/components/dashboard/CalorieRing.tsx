interface CalorieRingProps {
  consumed: number;
  goal: number;
}

const CalorieRing = ({ consumed, goal }: CalorieRingProps) => {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center animate-scaleIn">
      <div className="relative" style={{ width: 192, height: 192 }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background ring */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="#e8e8e8"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Progress ring */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="url(#limeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          <defs>
            <linearGradient id="limeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-extrabold tracking-tight"
            style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-display)', fontSize: consumed > 999 ? '2rem' : '2.5rem' }}
          >
            {consumed.toLocaleString()}
          </span>
          <span className="text-xs font-medium mt-0.5" style={{ color: 'var(--on-surface-variant)' }}>
            kcal eaten
          </span>
          <div
            className="flex items-center gap-1 mt-2 px-3 py-1 rounded-full"
            style={{ background: 'var(--primary-soft)' }}
          >
            <span className="text-xs font-bold" style={{ color: 'var(--on-primary-container)' }}>
              {remaining.toLocaleString()}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--on-surface-variant)' }}>left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieRing;
