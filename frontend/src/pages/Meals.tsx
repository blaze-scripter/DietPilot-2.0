import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/main';
import { foodsApi, dailyLogApi } from '@/services/api';

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', icon: 'bakery_dining', color: '#fef3c7' },
  { value: 'lunch', label: 'Lunch', icon: 'lunch_dining', color: '#dbeafe' },
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
    (e.target as HTMLElement).classList.add('dragging');
  };
  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('dragging');
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
    <div className="page-shell" style={{ paddingTop: 24 }}>

      {/* ▸ Header ─────────────────────────────── */}
      <header className="anim-fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.5rem' }}>Diet Log</h1>
          <div style={{
            background: '#ecfccb', color: '#3f6212', borderRadius: 100,
            padding: '6px 16px', fontSize: '0.75rem', fontWeight: 700,
            fontFamily: 'var(--font-display)',
          }}>
            {Math.round(dayTotals)} kcal
          </div>
        </div>
      </header>

      {/* ▸ Meal Type Tabs ─────────────────────── */}
      <div
        className="scrollbar-hide anim-fade-up anim-delay-1"
        style={{
          display: 'flex', gap: 10, overflowX: 'auto',
          margin: '0 -20px', padding: '0 20px 4px',
          marginBottom: 20,
        }}
      >
        {MEAL_TYPES.map((mt) => {
          const st = slotTotals(mt.value);
          const isSelected = selectedSlot === mt.value;
          return (
            <button
              key={mt.value}
              onClick={() => setSelectedSlot(mt.value)}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 16px 8px 8px', borderRadius: 100, border: 'none',
                background: isSelected ? '#ecfccb' : 'rgba(255,255,255,0.6)',
                boxShadow: isSelected ? '0 4px 16px rgba(163,230,53,0.2)' : '0 1px 4px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(.22,1,.36,1)',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: isSelected ? '#a3e635' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 18, color: '#3d6a00',
                  fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
                }}>{mt.icon}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: '0.8125rem', fontWeight: 700, color: isSelected ? '#3d6a00' : '#1b1c18',
                  fontFamily: 'var(--font-display)',
                }}>{mt.label}</div>
                <div style={{
                  fontSize: '0.5625rem', fontWeight: 700, color: '#72796a',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>{Math.round(st.calories)} kcal</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ▸ Log Food Button ────────────────────── */}
      <div className="anim-fade-up anim-delay-2" style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowSearch(true)}
          className="btn-lime"
          style={{
            width: '100%', padding: '16px', fontSize: '0.875rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'wght' 700" }}>add</span>
          Log {selectedSlot.charAt(0).toUpperCase() + selectedSlot.slice(1)}
        </button>
      </div>

      {/* ▸ Meal Cards ─────────────────────────── */}
      <div className="anim-fade-up anim-delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
              className={dragTarget === mt.value ? 'card drag-over' : 'card'}
              style={{
                padding: 18,
                border: isSelected ? '2px solid rgba(163,230,53,0.5)' : undefined,
              }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 14, background: mt.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 20 }}>{mt.icon}</span>
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1b1c18', fontFamily: 'var(--font-display)' }}>
                    {mt.label}
                  </span>
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1b1c18', fontFamily: 'var(--font-display)' }}>
                  {Math.round(slotTotals(mt.value).calories)}
                  <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#72796a', marginLeft: 3, textTransform: 'uppercase' }}>kcal</span>
                </span>
              </div>

              {foods.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '28px 16px',
                  border: '2px dashed #c6c8b9', borderRadius: 16,
                  background: '#f8f8f3',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#c6c8b9', marginBottom: 6, display: 'block' }}>restaurant_menu</span>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#72796a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>No foods logged</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {foods.map((food: any, idx: number) => (
                    <div
                      key={food.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, food.id, mt.value)}
                      onDragEnd={handleDragEnd}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: 'rgba(255,255,255,0.5)', borderRadius: 14,
                        padding: '12px 14px',
                        border: '1px solid rgba(255,255,255,0.5)',
                        cursor: 'grab',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#c6c8b9' }}>drag_indicator</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.8125rem', fontWeight: 700, color: '#1b1c18',
                          fontFamily: 'var(--font-display)', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{food.name}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                          {[
                            { color: '#0ea5e9', val: food.protein_g, label: 'P' },
                            { color: '#f59e0b', val: food.carbs_g, label: 'C' },
                            { color: '#ec4899', val: food.fat_g, label: 'F' },
                          ].map((m) => (
                            <span key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.625rem', fontWeight: 700, color: '#72796a' }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.color, display: 'inline-block' }} />
                              {m.val}{m.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1b1c18' }}>{Math.round(food.calories)}</div>
                        <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: '#a1a79a', textTransform: 'uppercase' }}>{food.serving_size}{food.serving_unit}</div>
                      </div>
                      <button onClick={() => handleRemoveFood(mt.value, food.id)} style={{
                        width: 28, height: 28, borderRadius: '50%', border: 'none',
                        background: '#fee2e2', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'background 0.2s ease',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#ef4444' }}>close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ▸ Food Search Modal ──────────────────── */}
      {showSearch && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(180deg, #f8f8f3, #f0f0eb)',
        }}>
          {/* Search header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '20px 20px 16px',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(40px)',
            borderBottom: '1px solid rgba(255,255,255,0.5)',
          }}>
            <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} style={{
              width: 40, height: 40, borderRadius: 14, background: '#e9e9e4',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#1b1c18', fontSize: 20 }}>arrow_back</span>
            </button>
            <div style={{ flex: 1, position: 'relative' }}>
              <span className="material-symbols-outlined" style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 18, color: '#72796a',
              }}>search</span>
              <input
                type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for ${selectedSlot}...`}
                autoFocus
                style={{
                  width: '100%', padding: '12px 16px 12px 42px',
                  borderRadius: 100, border: 'none', background: '#e9e9e4',
                  fontSize: '0.875rem', fontFamily: 'var(--font-display)',
                  color: '#1b1c18', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Results */}
          <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {searching && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', color: '#72796a' }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, marginBottom: 12 }}>progress_activity</span>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Searching USDA database...</p>
              </div>
            )}
            {!searching && searchQuery && searchResults.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', color: '#72796a' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 44, marginBottom: 12, fontVariationSettings: "'wght' 200" }}>search_off</span>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>No results found</p>
                <p style={{ fontSize: '0.75rem', marginTop: 4, color: '#a1a79a' }}>Try broader search terms</p>
              </div>
            )}
            {!searching && !searchQuery && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', color: '#a1a79a' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 56, marginBottom: 12, fontVariationSettings: "'wght' 200" }}>restaurant</span>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Search over 300k+ USDA foods</p>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {searchResults.map((food) => (
                <button
                  key={food.fdcId}
                  onClick={() => handleAddFood(food)}
                  className="card"
                  style={{
                    width: '100%', textAlign: 'left',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 18px', cursor: 'pointer',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                    <div style={{
                      fontSize: '0.8125rem', fontWeight: 700, color: '#1b1c18',
                      fontFamily: 'var(--font-display)', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{food.name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, background: '#e9e9e4', padding: '2px 8px', borderRadius: 6, color: '#1b1c18' }}>
                        {food.servingSize || food.serving_size}{food.servingUnit || food.serving_unit || 'g'}
                      </span>
                      <span style={{ fontSize: '0.625rem', color: '#0ea5e9', fontWeight: 700 }}>{food.protein || food.protein_g}g P</span>
                      <span style={{ fontSize: '0.625rem', color: '#f59e0b', fontWeight: 700 }}>{food.carbs || food.carbs_g}g C</span>
                      <span style={{ fontSize: '0.625rem', color: '#ec4899', fontWeight: 700 }}>{food.fat || food.fat_g}g F</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1b1c18' }}>
                      {Math.round(food.calories)}
                      <span style={{ fontSize: '0.5625rem', color: '#72796a', marginLeft: 2 }}>kcal</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
