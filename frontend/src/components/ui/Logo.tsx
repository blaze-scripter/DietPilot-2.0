export default function Logo({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      style={style}
    >
      <g transform="translate(5, 5) scale(0.9)">
        {/* Leaf */}
        <path
          d="M 50 15 C 65 5, 80 15, 75 30 C 60 40, 45 30, 50 15 Z"
          style={{ fill: 'var(--tb-primary-container, #a3e635)' }}
        />
        {/* Apple Body */}
        <path
          d="
            M 30 30 
            C 15 30, 10 50, 15 70 
            C 20 90, 40 95, 50 90 
            C 60 95, 80 90, 85 70 
            C 88 58, 85 45, 85 45 
            C 80 48, 70 45, 68 35 
            C 66 25, 75 18, 75 18
            C 65 15, 55 20, 50 25
            C 45 20, 35 15, 30 30 
            Z
          "
          style={{ fill: 'var(--tb-text, #1a1c1c)' }}
        />
      </g>
    </svg>
  );
}
