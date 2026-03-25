interface MealCardProps {
  name: string;
  type: string;
  calories: number;
  time: string;
  image: string;
}

const MealCard = ({ name, type, calories, time, image }: MealCardProps) => {
  return (
    <div className="flex-shrink-0 w-40 glass rounded-2xl overflow-hidden animate-fadeIn" style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
      <div className="h-24 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--on-primary-container)' }}>{type}</p>
        <p className="text-sm font-semibold mt-0.5 leading-tight truncate" style={{ color: 'var(--on-surface)' }}>{name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-bold" style={{ color: 'var(--on-surface)' }}>{calories} kcal</span>
          <span className="text-[10px]" style={{ color: 'var(--on-surface-variant)' }}>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
