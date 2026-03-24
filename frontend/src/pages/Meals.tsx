import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/main';
import { foodsApi, dailyLogApi } from '@/services/api';
import { Search, Plus, X, GripVertical } from 'lucide-react';

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
          );
        })}
      </div>

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
              {searchResults.map((food) => (
                <button
                  key={food.fdcId}
                  onClick={() => handleAddFood(food)}
                  className="w-full flex justify-between p-3 border rounded-xl hover:bg-lime-50"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold">{food.name}</div>
                    <div className="text-[9px] text-gray-400">{food.calories} kcal • {food.servingSize}{food.servingUnit}</div>
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
