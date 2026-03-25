interface CalorieRingProps {
  consumed: number;
  goal: number;
}

const CalorieRing = ({ consumed, goal }: CalorieRingProps) => {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center animate-scale-in">
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {/* Background ring */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="#eeeeee"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Progress ring */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="url(#limeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="limeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#446900" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tracking-tight text-on-surface">{Math.round(consumed)}</span>
          <span className="text-xs text-on-surface-variant font-medium mt-0.5">kcal eaten</span>
          <div className="flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-surface-container">
            <span className="text-xs font-semibold text-on-surface">{Math.round(remaining)}</span>
            <span className="text-[10px] text-on-surface-variant">left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieRing;
