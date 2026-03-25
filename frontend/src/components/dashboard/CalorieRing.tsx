import { useEffect, useRef } from 'react';

interface CalorieRingProps {
  consumed: number;
  goal: number;
}

const CalorieRing = ({ consumed, goal }: CalorieRingProps) => {
  const progressRef = useRef<SVGCircleElement>(null);
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const el = progressRef.current;
    if (el) {
      el.style.strokeDashoffset = String(circumference);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.strokeDashoffset = String(offset);
        });
      });
    }
  }, [circumference, offset]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      <div style={{ position: 'relative', width: 'var(--ring-size)', height: 'var(--ring-size)' }}>
        <svg
          viewBox="0 0 200 200"
          style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="var(--tb-input-bg)"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Progress */}
          <circle
            ref={progressRef}
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)',
              filter: 'drop-shadow(0 0 6px rgba(163,230,53,0.35))',
            }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bef264" />
              <stop offset="50%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#4d7c0f" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}>
          <span style={{
            fontSize: consumed > 999 ? '1.75rem' : '2.25rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--tb-text)',
            fontFamily: 'var(--font-display)',
            lineHeight: 1,
          }}>
            {consumed.toLocaleString()}
          </span>
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: 'var(--tb-text-secondary)',
            marginTop: 2,
          }}>
            kcal eaten
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 8,
            padding: '4px 14px',
            borderRadius: 100,
            background: 'var(--tb-accent-pill)',
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--tb-accent-pill-text)',
            }}>
              {remaining.toLocaleString()}
            </span>
            <span style={{
              fontSize: '0.625rem',
              fontWeight: 500,
              color: 'var(--tb-accent-dark)',
            }}>
              left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieRing;
