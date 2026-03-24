import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/main';
import { foodsApi, dailyLogApi } from '@/services/api';
<<<<<<< Updated upstream
import { Search, Plus, X, GripVertical } from 'lucide-react';
=======
>>>>>>> Stashed changes

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', icon: 'bakery_dining', color: '#fef3c7' },
  { value: 'lunch', label: 'Lunch', icon: 'lunch_dining', color: '#e0f2fe' },
  { value: 'snack', label: 'Snack', icon: 'icecream', color: '#fce7f3' },
  { value: 'dinner', label: 'Dinner', icon: 'restaurant', color: '#ecfccb' },
];

export default function Meals() {
  const { dailyLog, refreshLog, navState } = useApp();
  const [selectedSlot, setSelectedSlot] = useState(navState?.selectedMealType || 'breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchTimeout = useRef<any>(null);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await foodsApi.search(searchQuery);
        setSearchResults(results);
      } catch { setSearchResults([]); }
    }, 300);
  }, [searchQuery]);

  const handleAddFood = async (food: any) => {
    try {
      await dailyLogApi.addFood(new Date().toISOString().split('T')[0], {
        meal_type: selectedSlot,
        food: {
          fdcId: food.fdcId,
          name: food.name,
          serving_size: food.servingSize || food.serving_size,
          serving_unit: food.servingUnit || food.serving_unit || 'g',
          calories: food.calories,
          protein_g: food.protein || food.protein_g,
          carbs_g: food.carbs || food.carbs_g,
          fat_g: food.fat || food.fat_g,
        },
      });
      await refreshLog();
      setShowSearch(false);
      setSearchQuery('');
    } catch { /* ignore */ }
  };

  const handleRemoveFood = async (mealId: string, foodId: string) => {
    try {
      await dailyLogApi.removeFood(new Date().toISOString().split('T')[0], mealId, foodId);
      await refreshLog();
    } catch { /* ignore */ }
  };

<<<<<<< Updated upstream
  return (
    <div className="page-container">
      <h1 className="text-2xl font-extrabold tracking-tight mb-6">Meals 🍽️</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {MEAL_TYPES.map((mt) => (
          <button
            key={mt.value}
            onClick={() => setSelectedSlot(mt.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedSlot === mt.value ? 'bg-lime-400 border-lime-400 text-lime-950' : 'bg-white border-gray-100'
            }`}
          >
            {mt.emoji} {mt.label}
          </button>
        ))}
      </div>

      <button onClick={() => setShowSearch(true)} className="btn-primary w-full mb-6 py-3 text-sm">
        + Add Food to {selectedSlot}
      </button>

      <div className="space-y-4">
        {MEAL_TYPES.map((mt) => {
          const meal = dailyLog?.meals?.find((m: any) => m.type === mt.value);
          const foods = meal?.foods || [];
          if (mt.value !== selectedSlot && foods.length === 0) return null;

          return (
            <div key={mt.value} className="glass-card p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold">{mt.emoji} {mt.label}</h3>
                <span className="text-[10px] font-bold text-gray-400">
                  {Math.round(foods.reduce((s: number, f: any) => s + f.calories, 0))} kcal
                </span>
              </div>
              <div className="space-y-2">
                {foods.map((food: any) => (
                  <div key={food.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="text-xs font-bold">{food.name}</div>
                      <div className="text-[9px] text-gray-400">{food.serving_size}{food.serving_unit} • P:{food.protein_g}g C:{food.carbs_g}g F:{food.fat_g}g</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold">{food.calories}</span>
                      <button onClick={() => handleRemoveFood(meal.id, food.id)} className="text-red-400"><X size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
=======
  // Calculate day total
  const dayTotals = MEAL_TYPES.reduce((acc, mt) => acc + slotTotals(mt.value).calories, 0);

  return (
    <div className="page-container relative">
      <div className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] bg-primary-container/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4 animate-slideUp">
        <h1 className="text-3xl font-extrabold tracking-tight font-display text-foreground leading-none">
          Diet Log
        </h1>
        <div className="badge badge-lime text-sm px-3 py-1.5 shadow-sm">
          {Math.round(dayTotals)} kcal
        </div>
      </div>

      {/* Meal Slot Carousel/Tabs */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 animate-slideUp" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {MEAL_TYPES.map((mt) => {
          const st = slotTotals(mt.value);
          const isSelected = selectedSlot === mt.value;
          return (
            <button
              key={mt.value}
              onClick={() => setSelectedSlot(mt.value)}
              className="flex-shrink-0 flex items-center gap-2 p-1.5 pr-4 rounded-full transition-all border shadow-sm"
              style={{
                background: isSelected ? 'var(--primary-container)' : 'var(--surface-container-low)',
                borderColor: isSelected ? 'var(--primary)' : 'transparent',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm"
                style={{ color: isSelected ? 'var(--primary)' : 'var(--muted)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>{mt.icon}</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-display font-bold" style={{ color: isSelected ? 'var(--on-primary-container)' : 'var(--foreground)' }}>
                  {mt.label}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isSelected ? 'var(--primary)' : 'var(--muted)' }}>
                  {Math.round(st.calories)} kcal
                </div>
              </div>
            </button>
>>>>>>> Stashed changes
          );
        })}
      </div>

<<<<<<< Updated upstream
      {showSearch && (
        <div className="modal-overlay" onClick={() => setShowSearch(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-extrabold">Add Food</h2>
              <button onClick={() => setShowSearch(false)}><X /></button>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search foods..."
              className="w-full p-3 rounded-xl border mb-4 text-sm"
              autoFocus
            />
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
=======
      {/* Add Food CTA */}
      <button
        onClick={() => setShowSearch(true)}
        className="btn-primary w-full mb-8 flex items-center justify-center gap-2 py-4 animate-slideUp shadow-[0_8px_24px_rgba(163,230,53,0.3)] transition-transform hover:scale-[1.02] active:scale-95 text-lg"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 700" }}>add</span>
        Log {selectedSlot.charAt(0).toUpperCase() + selectedSlot.slice(1)}
      </button>

      {/* Meal Slots Containers */}
      <div className="space-y-6 stagger-children animate-slideUp">
        {MEAL_TYPES.map((mt) => {
          const foods = getMealFoods(mt.value);
          const isSelected = selectedSlot === mt.value;
          
          if (!isSelected && foods.length === 0) return null;

          return (
            <div
              key={mt.value}
              className={`glass-card-stitch p-5 transition-colors ${dragTarget === mt.value ? 'drag-over' : ''}`}
              style={{ 
                borderRadius: 24,
                border: isSelected ? '2px solid var(--primary-container)' : '1px solid var(--card-border)'
              }}
              onDragOver={(e) => handleDragOver(e, mt.value)}
              onDragLeave={() => setDragTarget(null)}
              onDrop={(e) => handleDrop(e, mt.value)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: mt.color }}>
                    <span className="material-symbols-outlined text-foreground" style={{ fontVariationSettings: "'FILL' 1" }}>{mt.icon}</span>
                  </div>
                  <h3 className="text-base font-display font-bold capitalize">{mt.label}</h3>
                </div>
                <span className="text-sm font-extrabold font-display">
                  {Math.round(slotTotals(mt.value).calories)} <span className="text-[10px] font-bold uppercase tracking-widest text-muted">kcal</span>
                </span>
              </div>

              {foods.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
                  <span className="material-symbols-outlined text-muted/50 mb-2" style={{ fontSize: 32 }}>restaurant_menu</span>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest">No foods logged</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {foods.map((food: any, idx: number) => (
                    <div
                      key={food.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, food.id, mt.value)}
                      onDragEnd={handleDragEnd}
                      className="group flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:border-primary-container transition-all"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <span className="material-symbols-outlined text-muted-light cursor-grab hover:text-foreground transition-colors">drag_indicator</span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-display font-bold text-foreground truncate">{food.name}</div>
                        <div className="text-xs text-muted font-medium mt-0.5 flex gap-3">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{food.protein_g}P</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>{food.carbs_g}C</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{food.fat_g}F</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-extrabold font-display leading-none">{Math.round(food.calories)}</div>
                        <div className="text-[9px] font-bold text-muted uppercase tracking-widest mt-1">{food.serving_size}{food.serving_unit}</div>
                      </div>

                      <button 
                        onClick={() => handleRemoveFood(mt.value, food.id)} 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-muted-light hover:bg-red-50 hover:text-red-500 transition-colors ml-1"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fullscreen Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-slideUp">
          <div className="px-6 pt-12 pb-4 bg-white shadow-sm flex items-center gap-4 border-b border-gray-100">
            <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="btn-icon shadow-none bg-surface-container-low hover:bg-surface-container-high">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search database..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container text-base font-medium transition-all"
                autoFocus
              />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>cancel</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-surface-container-lowest">
            {searching && (
              <div className="flex flex-col items-center justify-center py-12 text-muted">
                <span className="material-symbols-outlined animate-spin mb-4" style={{ fontSize: 32 }}>progress_activity</span>
                <p className="font-display font-medium text-sm">Searching nutrition database...</p>
              </div>
            )}
            
            {!searching && searchQuery && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-light">
                <span className="material-symbols-outlined mb-4" style={{ fontSize: 48 }}>search_off</span>
                <p className="font-display font-medium text-sm">No exact matches found.</p>
                <p className="text-xs mt-1">Try searching for generic ingredients.</p>
              </div>
            )}

            {!searching && searchQuery === '' && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-light/60">
                <span className="material-symbols-outlined mb-4" style={{ fontSize: 64, fontVariationSettings: "'wght' 200" }}>restaurant</span>
                <p className="font-display font-medium text-sm">Search over 40 bundled local foods</p>
              </div>
            )}

            <div className="space-y-3 stagger-children">
>>>>>>> Stashed changes
              {searchResults.map((food) => (
                <button
                  key={food.fdcId}
                  onClick={() => handleAddFood(food)}
<<<<<<< Updated upstream
                  className="w-full flex justify-between p-3 border rounded-xl hover:bg-lime-50"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold">{food.name}</div>
                    <div className="text-[9px] text-gray-400">{food.calories} kcal • {food.servingSize}{food.servingUnit}</div>
=======
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-primary-container hover:shadow-[0_8px_24px_rgba(163,230,53,0.15)] transition-all text-left group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="text-base font-display font-bold truncate text-foreground group-hover:text-primary-dark transition-colors">{food.name}</div>
                    <div className="text-xs font-medium text-muted mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="font-bold text-foreground bg-surface-container-high px-2 py-0.5 rounded-md">{food.servingSize || food.serving_size}{food.servingUnit || food.serving_unit || 'g'}</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{food.protein || food.protein_g}g Pro</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>{food.carbs || food.carbs_g}g Crb</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>{food.fat || food.fat_g}g Fat</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-lg font-display font-extrabold text-foreground">{Math.round(food.calories)} <span className="text-[10px] font-bold text-muted uppercase tracking-widest">kcal</span></span>
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                      <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'wght' 700" }}>add</span>
                    </div>
>>>>>>> Stashed changes
                  </div>
                  <Plus size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
