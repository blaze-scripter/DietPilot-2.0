interface MealCardProps {
  name: string;
  type: string;
  calories: number;
  time: string;
  image: string;
}

const MealCard = ({ name, type, calories, time, image }: MealCardProps) => {
  return (
    <div style={{
      flexShrink: 0,
      width: 148,
      borderRadius: 16,
      overflow: 'hidden',
      background: 'var(--tb-surface)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: 'var(--tb-border-card)',
      boxShadow: 'var(--tb-card-shadow)',
      transition: 'transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s cubic-bezier(.22,1,.36,1), background 0.3s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      (e.currentTarget as HTMLElement).style.boxShadow = 'var(--tb-card-shadow-elevated)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLElement).style.boxShadow = 'var(--tb-card-shadow)';
    }}
    >
      <div style={{ height: 96, overflow: 'hidden', position: 'relative' }}>
        <img
          src={image}
          alt={name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 32,
          background: 'linear-gradient(transparent, var(--tb-surface))',
        }} />
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{
          fontSize: '0.5625rem',
          fontWeight: 700,
          color: 'var(--tb-accent-dark)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontFamily: 'var(--font-display)',
        }}>{type}</p>
        <p style={{
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: 'var(--tb-text)',
          marginTop: 3,
          lineHeight: 1.25,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-display)',
        }}>{name}</p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8,
        }}>
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: 'var(--tb-text)',
          }}>{calories} kcal</span>
          <span style={{
            fontSize: '0.5625rem',
            fontWeight: 500,
            color: 'var(--tb-text-muted)',
          }}>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
