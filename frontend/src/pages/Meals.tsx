import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/main';
import { foodsApi, dailyLogApi } from '@/services/api';
import { Search, Plus, X, GripVertical, ChevronDown } from 'lucide-react';

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'snack', label: 'Snack', emoji: '🍿' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
];

export default function Meals() {
  const { dailyLog, refreshLog, navState } = useApp();
  const [selectedSlot, setSelectedSlot] = useState(navState?.selectedMealType || 'breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const searchTimeout = useRef<any>(null);

  // Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await foodsApi.search(searchQuery);
        setSearchResults(results);
      } catch { setSearchResults([]); }
      setSearching(false);
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  const today = new Date().toISOString().split('T')[0];

  const getMealFoods = (type: string) => {
    if (!dailyLog?.meals) return [];
    const meal = dailyLog.meals.find((m: any) => m.type === type);
    return meal?.foods || [];
  };

  const handleAddFood = async (food: any) => {
    try {
      await dailyLogApi.addFood(today, {
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
      showToast(`Added ${food.name} to ${selectedSlot}`);
      setShowSearch(false);
      setSearchQuery('');
    } catch { showToast('Failed to add food'); }
  };

  const handleRemoveFood = async (mealType: string, foodId: string) => {
    try {
      const meal = dailyLog?.meals?.find((m: any) => m.type === mealType);
      if (!meal) return;
      await dailyLogApi.removeFood(today, meal.id, foodId);
      await refreshLog();
      showToast('Removed food');
    } catch { showToast('Failed to remove'); }
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, foodId: string, fromSlot: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ foodId, fromSlot }));
    (e.target as HTMLElement).classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('dragging');
    setDragTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, slotType: string) => {
    e.preventDefault();
    setDragTarget(slotType);
  };

  const handleDrop = async (e: React.DragEvent, toSlot: string) => {
    e.preventDefault();
    setDragTarget(null);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.fromSlot === toSlot) return;
      await dailyLogApi.moveFood(today, {
        food_id: data.foodId,
        from_meal_type: data.fromSlot,
        to_meal_type: toSlot,
      });
      await refreshLog();
      showToast(`Moved to ${toSlot}`);
    } catch { showToast('Failed to move food'); }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const slotTotals = (type: string) => {
    const foods = getMealFoods(type);
    return {
      calories: foods.reduce((s: number, f: any) => s + (f.calories || 0), 0),
      count: foods.length,
    };
  };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-extrabold tracking-tight mb-6 animate-fadeIn">Meals 🍽️</h1>

      {/* Meal Slot Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 animate-fadeIn">
        {MEAL_TYPES.map((mt) => {
          const st = slotTotals(mt.value);
          return (
            <button
              key={mt.value}
              onClick={() => setSelectedSlot(mt.value)}
              className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: selectedSlot === mt.value ? 'var(--primary)' : 'white',
                color: selectedSlot === mt.value ? '#1a2e05' : 'var(--foreground)',
                border: `1px solid ${selectedSlot === mt.value ? 'var(--primary)' : '#e5e7eb'}`,
              }}
            >
              {mt.emoji} {mt.label} ({st.calories} kcal)
            </button>
          );
        })}
      </div>

      {/* Add Food Button */}
      <button
        onClick={() => setShowSearch(true)}
        className="btn-primary w-full mb-4 flex items-center justify-center gap-2 py-3"
      >
        <Plus size={18} /> Add Food to {selectedSlot}
      </button>

      {/* Meal Slots */}
      {MEAL_TYPES.map((mt) => {
        const foods = getMealFoods(mt.value);
        if (mt.value !== selectedSlot && foods.length === 0) return null;

        return (
          <div
            key={mt.value}
            className={`mb-4 glass-card p-4 ${dragTarget === mt.value ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, mt.value)}
            onDragLeave={() => setDragTarget(null)}
            onDrop={(e) => handleDrop(e, mt.value)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                {mt.emoji} {mt.label}
              </h3>
              <span className="badge badge-lime text-[10px]">{slotTotals(mt.value).calories} kcal</span>
            </div>

            {foods.length === 0 ? (
              <p className="text-xs py-3 text-center" style={{ color: 'var(--muted)' }}>
                No foods added yet. Tap + to add.
              </p>
            ) : (
              <div className="space-y-2">
                {foods.map((food: any) => (
                  <div
                    key={food.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, food.id, mt.value)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-grab active:cursor-grabbing transition-all"
                  >
                    <GripVertical size={14} style={{ color: 'var(--muted-light)' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{food.name}</div>
                      <div className="text-[10px] flex gap-2 mt-0.5" style={{ color: 'var(--muted)' }}>
                        <span>{food.serving_size}{food.serving_unit}</span>
                        <span>P:{food.protein_g}g</span>
                        <span>C:{food.carbs_g}g</span>
                        <span>F:{food.fat_g}g</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold">{food.calories} kcal</span>
                    <button onClick={() => handleRemoveFood(mt.value, food.id)} className="p-1 rounded-lg hover:bg-red-50">
                      <X size={14} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Search Modal */}
      {showSearch && (
        <div className="modal-overlay" onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold">Add Food</h3>
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="btn-icon w-8 h-8">
                <X size={18} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search foods... (e.g. chicken, rice, dal)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
                autoFocus
              />
            </div>

            <div className="max-h-[50vh] overflow-y-auto space-y-2">
              {searching && <p className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>Searching...</p>}
              {!searching && searchQuery && searchResults.length === 0 && (
                <p className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>No results found</p>
              )}
              {searchResults.map((food) => (
                <button
                  key={food.fdcId}
                  onClick={() => handleAddFood(food)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-lime-300 hover:bg-lime-50 transition-all text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{food.name}</div>
                    <div className="text-[10px] flex gap-2 mt-0.5" style={{ color: 'var(--muted)' }}>
                      <span>{food.servingSize || food.serving_size}{food.servingUnit || food.serving_unit || 'g'}</span>
                      <span>P:{food.protein || food.protein_g}g</span>
                      <span>C:{food.carbs || food.carbs_g}g</span>
                      <span>F:{food.fat || food.fat_g}g</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold">{food.calories} kcal</span>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary-soft)' }}>
                      <Plus size={14} style={{ color: 'var(--primary-dark)' }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
