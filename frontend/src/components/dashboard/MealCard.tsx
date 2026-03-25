interface MealCardProps {
  name: string;
  type: string;
  calories: number;
  time?: string;
  image?: string;
  desc?: string;
}

const MealCard = ({ name, type, calories, time, image, desc }: MealCardProps) => {
  return (
    <div className="flex-shrink-0 w-44 glass rounded-2xl overflow-hidden animate-fade-in group hover:shadow-lg transition-all border border-outline-variant/15">
      {image && (
          <div className="h-28 overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
      )}
      <div className="p-3">
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{type}</p>
        <p className="text-sm font-semibold text-on-surface mt-0.5 leading-tight truncate" title={name}>{name}</p>
        {desc && <p className="text-[10px] text-on-surface-variant mt-0.5 truncate border-b border-surface-container pb-1" title={desc}>{desc}</p>}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-bold text-on-surface bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">{Math.round(calories)} kcal</span>
          <span className="text-[10px] text-on-surface-variant">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
