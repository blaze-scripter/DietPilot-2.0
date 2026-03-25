interface MealCardProps {
  name: string;
  type: string;
  calories: number;
  time: string;
  image: string;
}

const MealCard = ({ name, type, calories, time, image }: MealCardProps) => {
  return (
    <div className="flex-shrink-0 w-40 glass rounded-2xl overflow-hidden animate-fade-in">
      <div className="h-24 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{type}</p>
        <p className="text-sm font-semibold text-foreground mt-0.5 leading-tight truncate">{name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-bold text-foreground">{calories} kcal</span>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
