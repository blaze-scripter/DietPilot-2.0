import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/main';
import { foodsApi, dailyLogApi } from '@/services/api';

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
  const [searching, setSearching] = useState(false);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const searchTimeout = useRef<any>(null);

  const getMealFoods = (type: string) =>
    dailyLog?.meals?.find((m: any) => m.type === type)?.foods || [];

  const slotTotals = (type: string) => {
    const fds = getMealFoods(type);
    return fds.reduce(
      (acc: any, f: any) => ({
        calories: acc.calories + (f.calories || 0),
        protein: acc.protein + (f.protein_g || 0),
        carbs: acc.carbs + (f.carbs_g || 0),
        fat: acc.fat + (f.fat_g || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleDragStart = (e: React.DragEvent, foodId: string, fromMeal: string) => {
    e.dataTransfer.setData('foodId', foodId);
    e.dataTransfer.setData('fromMeal', fromMeal);
    (e.target as HTMLElement).classList.add('opacity-50');
  };
  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('opacity-50');
    setDragTarget(null);
  };
  const handleDragOver = (e: React.DragEvent, target: string) => {
    e.preventDefault();
    if (dragTarget !== target) setDragTarget(target);
  };
  const handleDrop = async (e: React.DragEvent, targetMeal: string) => {
    e.preventDefault();
    setDragTarget(null);
    const foodId = e.dataTransfer.getData('foodId');
    const fromMeal = e.dataTransfer.getData('fromMeal');
    if (fromMeal === targetMeal || !foodId) return;
    const meal = dailyLog?.meals?.find((m: any) => m.type === fromMeal);
    const food = meal?.foods?.find((f: any) => f.id === foodId);
    if (!food) return;
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      await dailyLogApi.removeFood(dateStr, fromMeal, foodId);
      const { id: _id, ...newFood } = food;
      await dailyLogApi.addFood(dateStr, { meal_type: targetMeal, food: newFood });
      await refreshLog();
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try { setSearchResults(await foodsApi.search(searchQuery)); }
      catch { setSearchResults([]); }
      finally { setSearching(false); }
    }, 300);
  }, [searchQuery]);

  const handleAddFood = async (food: any) => {
    try {
      await dailyLogApi.addFood(new Date().toISOString().split('T')[0], {
        meal_type: selectedSlot,
        food: {
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

  const handleRemoveFood = async (mealType: string, foodId: string) => {
    try {
      await dailyLogApi.removeFood(new Date().toISOString().split('T')[0], mealType, foodId);
      await refreshLog();
    } catch { /* ignore */ }
  };

  const dayTotals = MEAL_TYPES.reduce((acc, mt) => acc + slotTotals(mt.value).calories, 0);

  return (
    <div className="page-container relative" style={{ paddingTop: 0 }}>
      {/* Glassmorphic Header */}
      <div
        className="sticky top-0 z-30 px-4 pt-10 pb-4"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderBottom: '1px solid rgba(194,202,176,0.15)',
          borderRadius: '0 0 2rem 2rem',
          marginBottom: 16,
        }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight font-headline text-on-surface leading-none">Diet Log</h1>
          <div style={{ background: '#ecfccb', color: '#416400', borderRadius: 999, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700 }}>
            {Math.round(dayTotals)} kcal
          </div>
        </div>
      </div>

      {/* Meal Slot Tabs */}
      <div className="flex gap-3 mb-5 overflow-x-auto pb-2 px-4 animate-slideUp" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {MEAL_TYPES.map((mt) => {
          const st = slotTotals(mt.value);
          const isSelected = selectedSlot === mt.value;
          return (
            <button
              key={mt.value}
              onClick={() => setSelectedSlot(mt.value)}
              className="flex-shrink-0 flex items-center gap-2 p-1.5 pr-4 rounded-full transition-all"
              style={{
                background: isSelected ? '#ecfccb' : 'rgba(255,255,255,0.8)',
                border: `1.5px solid ${isSelected ? '#a3e635' : 'rgba(194,202,176,0.3)'}`,
                boxShadow: isSelected ? '0 4px 16px rgba(163,230,53,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 999, background: isSelected ? '#a3e635' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#416400', fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>{mt.icon}</span>
              </div>
              <div className="text-left">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Plus Jakarta Sans', color: isSelected ? '#416400' : '#1a1c1c' }}>{mt.label}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5a5c5c' }}>{Math.round(st.calories)} kcal</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Log Food Button */}
      <div className="px-4 mb-5 animate-slideUp" style={{ animationDelay: '0.05s' }}>
        <button
          onClick={() => setShowSearch(true)}
          className="w-full btn-primary flex items-center justify-center gap-2"
          style={{ padding: '16px', fontSize: '1rem', borderRadius: '999px', boxShadow: '0 8px 24px rgba(163,230,53,0.35)' }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 700" }}>add</span>
          Log {selectedSlot.charAt(0).toUpperCase() + selectedSlot.slice(1)}
        </button>
      </div>

      {/* Meal Cards */}
      <div className="px-4 space-y-4 stagger-children animate-slideUp" style={{ animationDelay: '0.1s' }}>
        {MEAL_TYPES.map((mt) => {
          const foods = getMealFoods(mt.value);
          const isSelected = selectedSlot === mt.value;
          if (!isSelected && foods.length === 0) return null;
          return (
            <div
              key={mt.value}
              onDragOver={(e) => handleDragOver(e, mt.value)}
              onDragLeave={() => setDragTarget(null)}
              onDrop={(e) => handleDrop(e, mt.value)}
              style={{
                background: dragTarget === mt.value ? 'rgba(163,230,53,0.08)' : 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                borderRadius: '1.5rem', padding: '18px',
                border: `${isSelected ? '2px solid #a3e635' : '1px solid rgba(194,202,176,0.2)'}`,
                boxShadow: '0 4px 20px rgba(45,47,47,0.06)',
                transition: 'all 0.25s ease',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div style={{ width: 42, height: 42, borderRadius: '0.875rem', background: mt.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{mt.icon}</span>
                  </div>
                  <span className="text-base font-headline font-bold text-on-surface capitalize">{mt.label}</span>
                </div>
                <span className="text-sm font-extrabold font-headline text-on-surface">
                  {Math.round(slotTotals(mt.value).calories)} <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">kcal</span>
                </span>
              </div>

              {foods.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed rounded-2xl" style={{ borderColor: 'rgba(194,202,176,0.4)', background: '#f9f9f9' }}>
                  <span className="material-symbols-outlined text-on-surface-variant mb-1" style={{ fontSize: 32, fontVariationSettings: "'FILL' 0, 'wght' 300" }}>restaurant_menu</span>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">No foods logged</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {foods.map((food: any, idx: number) => (
                    <div
                      key={food.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, food.id, mt.value)}
                      onDragEnd={handleDragEnd}
                      className="group flex items-center gap-3 cursor-grab active:cursor-grabbing"
                      style={{
                        background: 'rgba(255,255,255,0.6)', borderRadius: '1rem',
                        padding: '12px', border: '1px solid rgba(194,202,176,0.2)',
                        animationDelay: `${idx * 0.05}s`, transition: 'all 0.2s ease',
                      }}
                    >
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>drag_indicator</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="text-sm font-headline font-bold text-on-surface truncate">{food.name}</div>
                        <div className="flex gap-3 mt-0.5">
                          {[
                            { color: '#ef4444', val: food.protein_g, label: 'P' },
                            { color: '#3b82f6', val: food.carbs_g, label: 'C' },
                            { color: '#f59e0b', val: food.fat_g, label: 'F' },
                          ].map((m) => (
                            <span key={m.label} className="flex items-center gap-0.5 text-[10px] font-bold text-on-surface-variant">
                              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: m.color }} />
                              {m.val}{m.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold font-headline text-on-surface">{Math.round(food.calories)}</div>
                        <div className="text-[9px] font-bold text-on-surface-variant uppercase">{food.serving_size}{food.serving_unit}</div>
                      </div>
                      <button onClick={() => handleRemoveFood(mt.value, food.id)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ef4444' }}>close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full-Screen Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex flex-col animate-slideUp" style={{ background: '#f9f9f9' }}>
          {/* Search Header */}
          <div className="px-4 pt-10 pb-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(194,202,176,0.15)' }}>
            <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}
              style={{ width: 44, height: 44, borderRadius: '0.875rem', background: '#f3f3f4', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ color: '#1a1c1c' }}>arrow_back</span>
            </button>
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 20 }}>search</span>
              <input
                type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for ${selectedSlot}...`}
                style={{
                  width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 14, paddingBottom: 14,
                  borderRadius: '999px', border: 'none', background: '#f3f3f4',
                  fontSize: '0.95rem', fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c', outline: 'none',
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {searching && (
              <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin mb-3" style={{ fontSize: 32 }}>progress_activity</span>
                <p className="text-sm font-medium">Searching USDA database...</p>
              </div>
            )}
            {!searching && searchQuery && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined mb-3" style={{ fontSize: 48, fontVariationSettings: "'FILL' 0, 'wght' 200" }}>search_off</span>
                <p className="text-sm font-medium">No results found</p>
                <p className="text-xs mt-1 text-on-surface-variant/70">Try broader search terms</p>
              </div>
            )}
            {!searching && !searchQuery && (
              <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant/60">
                <span className="material-symbols-outlined mb-3" style={{ fontSize: 64, fontVariationSettings: "'FILL' 0, 'wght' 200" }}>restaurant</span>
                <p className="text-sm font-medium">Search over 300k+ USDA foods</p>
              </div>
            )}
            {searchResults.map((food) => (
              <button
                key={food.fdcId}
                onClick={() => handleAddFood(food)}
                className="w-full text-left group"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px', borderRadius: '1.25rem',
                  background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(194,202,176,0.2)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                  <div className="text-sm font-headline font-bold text-on-surface truncate">{food.name}</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#f3f3f4', padding: '2px 8px', borderRadius: 6, color: '#1a1c1c' }}>
                      {food.servingSize || food.serving_size}{food.servingUnit || food.serving_unit || 'g'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>{food.protein || food.protein_g}g P</span>
                    <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 700 }}>{food.carbs || food.carbs_g}g C</span>
                    <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>{food.fat || food.fat_g}g F</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-base font-extrabold font-headline text-on-surface">{Math.round(food.calories)} <span className="text-[9px] text-on-surface-variant uppercase">kcal</span></span>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#a3e635', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transform: 'scale(0.8)', transition: 'all 0.2s' }} className="group-hover:opacity-100 group-hover:scale-100">
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#416400', fontVariationSettings: "'wght' 700" }}>add</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
