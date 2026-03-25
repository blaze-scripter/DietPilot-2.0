import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/main';
import { foodsApi, dailyLogApi } from '@/services/api';

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', icon: 'bakery_dining' },
  { value: 'lunch', label: 'Lunch', icon: 'lunch_dining' },
  { value: 'snack', label: 'Snack', icon: 'icecream' },
  { value: 'dinner', label: 'Dinner', icon: 'restaurant' },
];

export default function Meals() {
  const { profile, dailyLog, refreshLog, navState } = useApp();
  const [selectedSlot, setSelectedSlot] = useState(navState?.selectedMealType || 'breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const searchTimeout = useRef<any>(null);

  // ── Touch drag state ──
  const touchState = useRef<{
    foodId: string; fromMeal: string; el: HTMLElement | null;
    startY: number; startX: number; active: boolean;
  } | null>(null);
  const [touchDragging, setTouchDragging] = useState<string | null>(null);

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

  /* ── Desktop Drag & Drop ── */
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
    await moveFood(foodId, fromMeal, targetMeal);
  };

  const moveFood = async (foodId: string, fromMeal: string, targetMeal: string) => {
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

  /* ── Mobile Touch Drag ── */
  const handleTouchStart = useCallback((foodId: string, fromMeal: string, e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchState.current = {
      foodId, fromMeal,
      el: e.currentTarget as HTMLElement,
      startX: touch.clientX, startY: touch.clientY,
      active: false,
    };
    // Long press = activate drag after 300ms
    const timer = setTimeout(() => {
      if (touchState.current) {
        touchState.current.active = true;
        setTouchDragging(foodId);
        if (touchState.current.el) {
          touchState.current.el.classList.add('touch-dragging');
        }
      }
    }, 300);
    (e.currentTarget as any)._touchTimer = timer;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchState.current?.active) {
      // If moved too much before long-press, cancel
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - (touchState.current?.startX || 0));
      const dy = Math.abs(touch.clientY - (touchState.current?.startY || 0));
      if (dx > 10 || dy > 10) {
        clearTimeout((e.currentTarget as any)._touchTimer);
        touchState.current = null;
      }
      return;
    }
    e.preventDefault();
    // Check what meal card we're over
    const touch = e.touches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const mealCard = elements.find(el => el.getAttribute('data-meal-drop'));
    const mealType = mealCard?.getAttribute('data-meal-drop');
    if (mealType && mealType !== dragTarget) setDragTarget(mealType);
    else if (!mealType && dragTarget) setDragTarget(null);
  }, [dragTarget]);

  const handleTouchEnd = useCallback(async (e: React.TouchEvent) => {
    clearTimeout((e.currentTarget as any)._touchTimer);
    if (touchState.current?.active && touchState.current.el) {
      touchState.current.el.classList.remove('touch-dragging');
    }
    setTouchDragging(null);

    if (touchState.current?.active && dragTarget) {
      const { foodId, fromMeal } = touchState.current;
      if (fromMeal !== dragTarget) {
        await moveFood(foodId, fromMeal, dragTarget);
      }
    }
    touchState.current = null;
    setDragTarget(null);
  }, [dragTarget]);

  /* ── Search ── */
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
            background: 'var(--tb-accent-pill)', color: 'var(--tb-accent-pill-text)', borderRadius: 100,
            padding: '6px 16px', fontSize: '0.75rem', fontWeight: 700,
            fontFamily: 'var(--font-display)',
          }}>
            {Math.round(dayTotals)} kcal
          </div>
        </div>
      </header>

      {/* ▸ Meal Type Tabs ─────────────────────── */}
      <div
        className="scroll-container anim-fade-up anim-delay-1"
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
                background: isSelected ? 'var(--tb-accent-muted)' : 'var(--tb-surface)',
                boxShadow: isSelected ? '0 4px 16px rgba(163,230,53,0.2)' : 'var(--tb-card-shadow)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(.22,1,.36,1)',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: isSelected ? 'var(--tb-accent)' : 'var(--tb-surface-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 18, color: 'var(--tb-accent-dark)',
                  fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
                }}>{mt.icon}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: '0.8125rem', fontWeight: 700, color: isSelected ? 'var(--tb-accent-dark)' : 'var(--tb-text)',
                  fontFamily: 'var(--font-display)',
                }}>{mt.label}</div>
                <div style={{
                  fontSize: '0.5625rem', fontWeight: 700, color: 'var(--tb-text-secondary)',
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

      {/* ▸ Suggested Meals ──────────────────────── */}
      <div className="anim-fade-up anim-delay-2" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontSize: '0.8125rem' }}>Suggested Meals</h2>
          <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--tb-text-secondary)' }}>
            Tap to add · {profile?.diet_preference ? profile.diet_preference.replace('_', ' ') : 'Any'}
          </span>
        </div>
        <div className="scroll-container" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 6px' }}>
          {(profile?.diet_preference === 'vegan' ? [
            { name: 'Quinoa Power Bowl', calories: 380, protein_g: 14, carbs_g: 48, fat_g: 12, serving_size: 250, icon: '🥗', tag: 'High Fiber' },
            { name: 'Chickpea Curry', calories: 320, protein_g: 12, carbs_g: 32, fat_g: 8, serving_size: 200, icon: '🍛', tag: 'Iron Rich' },
            { name: 'Tofu Stir Fry', calories: 290, protein_g: 18, carbs_g: 20, fat_g: 14, serving_size: 200, icon: '🥘', tag: 'Complete Protein' },
            { name: 'Lentil Dal', calories: 250, protein_g: 16, carbs_g: 30, fat_g: 5, serving_size: 200, icon: '🍲', tag: 'Budget Friendly' },
          ] : profile?.diet_preference === 'keto' ? [
            { name: 'Avocado Eggs', calories: 340, protein_g: 20, carbs_g: 6, fat_g: 28, serving_size: 200, icon: '🥑', tag: 'High Fat' },
            { name: 'Butter Chicken', calories: 390, protein_g: 28, carbs_g: 10, fat_g: 26, serving_size: 200, icon: '🍗', tag: 'Low Carb' },
            { name: 'Salmon & Asparagus', calories: 420, protein_g: 35, carbs_g: 8, fat_g: 26, serving_size: 250, icon: '🐟', tag: 'Omega-3' },
            { name: 'Cheese Omelette', calories: 380, protein_g: 28, carbs_g: 4, fat_g: 28, serving_size: 200, icon: '🧀', tag: 'Quick Prep' },
          ] : profile?.diet_preference === 'vegetarian' ? [
            { name: 'Greek Yogurt Bowl', calories: 280, protein_g: 22, carbs_g: 30, fat_g: 8, serving_size: 250, icon: '🫐', tag: 'Probiotics' },
            { name: 'Paneer Tikka', calories: 260, protein_g: 16, carbs_g: 8, fat_g: 18, serving_size: 150, icon: '🧀', tag: 'High Protein' },
            { name: 'Palak Paneer', calories: 280, protein_g: 14, carbs_g: 10, fat_g: 20, serving_size: 200, icon: '🥬', tag: 'Iron Rich' },
            { name: 'Curd Rice', calories: 220, protein_g: 6, carbs_g: 38, fat_g: 5, serving_size: 200, icon: '🍚', tag: 'Easy Digest' },
          ] : profile?.diet_preference === 'halal' ? [
            { name: 'Chicken Biryani', calories: 400, protein_g: 22, carbs_g: 48, fat_g: 14, serving_size: 250, icon: '🍚', tag: 'Complete Meal' },
            { name: 'Seekh Kebab', calories: 300, protein_g: 22, carbs_g: 6, fat_g: 20, serving_size: 150, icon: '🍢', tag: 'High Protein' },
            { name: 'Chicken Shawarma', calories: 380, protein_g: 30, carbs_g: 28, fat_g: 16, serving_size: 200, icon: '🌯', tag: 'Balanced' },
            { name: 'Dal Tadka', calories: 180, protein_g: 10, carbs_g: 24, fat_g: 5, serving_size: 200, icon: '🍲', tag: 'Budget Friendly' },
          ] : [
            { name: 'Grilled Chicken', calories: 320, protein_g: 34, carbs_g: 8, fat_g: 16, serving_size: 200, icon: '🍗', tag: 'Lean Protein' },
            { name: 'Salmon Bowl', calories: 450, protein_g: 32, carbs_g: 40, fat_g: 16, serving_size: 300, icon: '🐟', tag: 'Omega-3' },
            { name: 'Chicken Biryani', calories: 400, protein_g: 22, carbs_g: 48, fat_g: 14, serving_size: 250, icon: '🍚', tag: 'Indian' },
            { name: 'Dal Makhani', calories: 260, protein_g: 11, carbs_g: 28, fat_g: 12, serving_size: 200, icon: '🍛', tag: 'Comfort Food' },
          ]).map((meal, i) => (
            <div key={i} onClick={() => handleAddFood(meal)} style={{
              flexShrink: 0, width: 140, padding: '14px 12px', cursor: 'pointer',
              borderRadius: 18, background: 'var(--tb-surface)', backdropFilter: 'blur(30px)',
              border: 'var(--tb-border-card)', boxShadow: 'var(--tb-card-shadow)',
              transition: 'all 0.2s ease', position: 'relative' as const,
            }}>
              <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: 8 }}>{meal.icon}</span>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--tb-text)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>{meal.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--tb-accent-dark)' }}>{meal.calories} kcal</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--tb-text-muted)' }} />
                <span style={{ fontSize: '0.5625rem', fontWeight: 600, color: 'var(--tb-text-secondary)' }}>{meal.protein_g}g protein</span>
              </div>
              <span style={{
                fontSize: '0.5rem', fontWeight: 700, color: 'var(--tb-accent-dark)', background: 'var(--tb-accent-pill)',
                padding: '2px 8px', borderRadius: 100, border: `1px solid var(--tb-accent-muted)`,
              }}>{meal.tag}</span>
              <div style={{
                position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%',
                background: 'var(--tb-accent-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 12, color: 'var(--tb-accent-dark)', fontVariationSettings: "'wght' 700" }}>add</span>
              </div>
            </div>
          ))}
        </div>
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
              data-meal-drop={mt.value}
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
                    width: 40, height: 40, borderRadius: 14, background: 'var(--tb-accent-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 20, color: 'var(--tb-accent-dark)' }}>{mt.icon}</span>
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--tb-text)', fontFamily: 'var(--font-display)' }}>
                    {mt.label}
                  </span>
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--tb-text)', fontFamily: 'var(--font-display)' }}>
                  {Math.round(slotTotals(mt.value).calories)}
                  <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--tb-text-secondary)', marginLeft: 3, textTransform: 'uppercase' }}>kcal</span>
                </span>
              </div>

              {foods.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '28px 16px',
                  border: `2px dashed var(--tb-border-subtle)`, borderRadius: 16,
                  background: 'var(--tb-bg)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--tb-text-muted)', marginBottom: 6, display: 'block' }}>restaurant_menu</span>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--tb-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>No foods logged</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {foods.map((food: any) => (
                    <div
                      key={food.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, food.id, mt.value)}
                      onDragEnd={handleDragEnd}
                      onTouchStart={(e) => handleTouchStart(food.id, mt.value, e)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className={touchDragging === food.id ? 'touch-dragging' : ''}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: 'var(--tb-surface)', borderRadius: 14,
                        padding: '12px 14px',
                        border: 'var(--tb-border-card)',
                        cursor: 'grab',
                        transition: 'all 0.2s ease',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--tb-text-muted)' }}>drag_indicator</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.8125rem', fontWeight: 700, color: 'var(--tb-text)',
                          fontFamily: 'var(--font-display)', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{food.name}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                          {[
                            { color: 'var(--tb-protein)', val: food.protein_g, label: 'P' },
                            { color: 'var(--tb-carbs)', val: food.carbs_g, label: 'C' },
                            { color: 'var(--tb-fat)', val: food.fat_g, label: 'F' },
                          ].map((m) => (
                            <span key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.625rem', fontWeight: 700, color: 'var(--tb-text-secondary)' }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.color, display: 'inline-block' }} />
                              {m.val}{m.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--tb-text)' }}>{Math.round(food.calories)}</div>
                        <div style={{ fontSize: '0.5625rem', fontWeight: 600, color: 'var(--tb-text-muted)', textTransform: 'uppercase' }}>{food.serving_size}{food.serving_unit}</div>
                      </div>
                      <button onClick={() => handleRemoveFood(mt.value, food.id)} style={{
                        width: 28, height: 28, borderRadius: '50%', border: 'none',
                        background: 'var(--tb-error-bg)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'background 0.2s ease',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--tb-error)' }}>close</span>
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
          background: 'var(--tb-bg-gradient)',
        }}>
          {/* Search header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '20px 20px 16px',
            background: 'var(--tb-nav-bg)',
            backdropFilter: 'blur(40px)',
            borderBottom: `1px solid var(--tb-nav-border)`,
          }}>
            <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} style={{
              width: 40, height: 40, borderRadius: 14, background: 'var(--tb-input-bg)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--tb-text)', fontSize: 20 }}>arrow_back</span>
            </button>
            <div style={{ flex: 1, position: 'relative' }}>
              <span className="material-symbols-outlined" style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 18, color: 'var(--tb-text-secondary)',
              }}>search</span>
              <input
                type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for ${selectedSlot}...`}
                autoFocus
                style={{
                  width: '100%', padding: '12px 16px 12px 42px',
                  borderRadius: 100, border: 'none', background: 'var(--tb-input-bg)',
                  fontSize: '0.875rem', fontFamily: 'var(--font-display)',
                  color: 'var(--tb-input-text)', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Results */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {searching && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', color: 'var(--tb-text-secondary)' }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, marginBottom: 12 }}>progress_activity</span>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Searching USDA database...</p>
              </div>
            )}
            {!searching && searchQuery && searchResults.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', color: 'var(--tb-text-secondary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 44, marginBottom: 12, fontVariationSettings: "'wght' 200" }}>search_off</span>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>No results found</p>
                <p style={{ fontSize: '0.75rem', marginTop: 4, color: 'var(--tb-text-muted)' }}>Try broader search terms</p>
              </div>
            )}
            {!searching && !searchQuery && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', color: 'var(--tb-text-muted)' }}>
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
                      fontSize: '0.8125rem', fontWeight: 700, color: 'var(--tb-text)',
                      fontFamily: 'var(--font-display)', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{food.name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, background: 'var(--tb-input-bg)', padding: '2px 8px', borderRadius: 6, color: 'var(--tb-text)' }}>
                        {food.servingSize || food.serving_size}{food.servingUnit || food.serving_unit || 'g'}
                      </span>
                      <span style={{ fontSize: '0.625rem', color: 'var(--tb-protein)', fontWeight: 700 }}>{food.protein || food.protein_g}g P</span>
                      <span style={{ fontSize: '0.625rem', color: 'var(--tb-carbs)', fontWeight: 700 }}>{food.carbs || food.carbs_g}g C</span>
                      <span style={{ fontSize: '0.625rem', color: 'var(--tb-fat)', fontWeight: 700 }}>{food.fat || food.fat_g}g F</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--tb-text)' }}>
                      {Math.round(food.calories)}
                      <span style={{ fontSize: '0.5625rem', color: 'var(--tb-text-secondary)', marginLeft: 2 }}>kcal</span>
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
