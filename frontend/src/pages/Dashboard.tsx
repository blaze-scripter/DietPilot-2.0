import { useMemo, useState } from 'react';
import { useApp } from '@/main';
import { dailyLogApi } from '@/services/api';
import CalorieRing from '@/components/dashboard/CalorieRing';
import MacroBar from '@/components/dashboard/MacroBar';
import MealCard from '@/components/dashboard/MealCard';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function Dashboard() {
  const { profile, dailyLog, refreshLog, navigate } = useApp();
  const [toast, setToast] = useState<string | null>(null);

  /* ── Computed totals ── */
  const totals = useMemo(() => {
    if (!dailyLog?.meals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return dailyLog.meals.reduce(
      (acc: any, meal: any) => {
        (meal.foods || []).forEach((f: any) => {
          acc.calories += f.calories || 0;
          acc.protein += f.protein_g || 0;
          acc.carbs += f.carbs_g || 0;
          acc.fat += f.fat_g || 0;
        });
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [dailyLog]);

  const targets = profile?.targets || { calories: 2000, protein: 120, carbs: 200, fat: 55 };

  /* ── Hydration ── */
  const waterGlasses = dailyLog?.water_glasses || 0;
  const waterTarget = dailyLog?.water_target || 8;
  const waterL = (waterGlasses * 0.25).toFixed(1);
  const waterTargetL = (waterTarget * 0.25).toFixed(1);

  const addWater = async () => {
    const nv = Math.min(waterGlasses + 1, 20);
    try {
      await dailyLogApi.updateWater(new Date().toISOString().split('T')[0], nv);
      await refreshLog();
    } catch { /* */ }
  };

  /* ── Date ── */
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  /* ── Meals ── */
  const meals = useMemo(() => {
    if (!dailyLog?.meals?.length) return [];
    return dailyLog.meals
      .filter((m: any) => m.foods?.length > 0)
      .map((m: any) => ({
        id: m.id || Math.random().toString(),
        type: m.type.charAt(0).toUpperCase() + m.type.slice(1),
        name: m.foods[0]?.name || m.type,
        calories: Math.round(m.foods.reduce((s: number, f: any) => s + (f.calories || 0), 0)),
        time: m.time || '',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=500',
      }));
  }, [dailyLog]);

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="page-shell">

      {/* ▸ Header ──────────────────────────────── */}
      <header
        className="anim-fade-up"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 8, marginBottom: 24 }}
      >
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#a1a79a', letterSpacing: '0.01em' }}>{today}</p>
          <h1 style={{ fontSize: '1.5rem', marginTop: 4 }}>
            {getGreeting()}, {profile?.name || 'Guest'}{' '}
            <span style={{ fontSize: '1.25rem' }}>👋</span>
          </h1>
        </div>
        <button
          onClick={() => navigate('/profile')}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #bef264, #65a30d)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.8125rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(101,163,13,0.3)',
            transition: 'transform 0.25s cubic-bezier(.22,1,.36,1)',
            flexShrink: 0,
            marginTop: 4,
          }}
        >
          {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
        </button>
      </header>

      {/* ▸ Calorie Ring Card ───────────────────── */}
      <div
        className="card-elevated anim-scale-up"
        style={{ padding: '28px 20px 24px', marginBottom: 16 }}
      >
        <CalorieRing consumed={Math.round(totals.calories)} goal={Math.round(targets.calories)} />
      </div>

      {/* ▸ Macros Card ─────────────────────────── */}
      <div
        className="card anim-fade-up anim-delay-1"
        style={{ padding: '18px 20px', marginBottom: 16 }}
      >
        <h2 style={{ fontSize: '0.8125rem', marginBottom: 14, color: '#1b1c18' }}>Macros</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MacroBar label="Protein" current={Math.round(totals.protein)} goal={Math.round(targets.protein)} color="#0ea5e9" />
          <MacroBar label="Carbs" current={Math.round(totals.carbs)} goal={Math.round(targets.carbs)} color="#f59e0b" />
          <MacroBar label="Fat" current={Math.round(totals.fat)} goal={Math.round(targets.fat)} color="#ec4899" />
        </div>
      </div>

      {/* ▸ Hydration Card ──────────────────────── */}
      <div
        className="card-blue anim-fade-up anim-delay-2"
        style={{ padding: '18px 20px', marginBottom: 16 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18' }}>Hydration</h2>
            <p style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#72796a', marginTop: 2 }}>Goal: {waterTargetL}L</p>
          </div>
          <span style={{
            fontSize: '1.375rem',
            fontWeight: 800,
            color: '#2563eb',
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-display)',
          }}>
            {waterL}L
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  color: i < waterGlasses ? '#3b82f6' : '#bfdbfe',
                  fontVariationSettings: i < waterGlasses ? "'FILL' 1" : "'FILL' 0",
                  transition: 'color 0.3s ease, font-variation-settings 0.3s ease',
                }}
              >
                water_drop
              </span>
            ))}
          </div>

          <button
            onClick={addWater}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, #60a5fa, #2563eb)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
              transition: 'transform 0.25s cubic-bezier(.22,1,.36,1)',
              flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'wght' 600" }}>add</span>
          </button>
        </div>
      </div>

      {/* ▸ Today's Meals ───────────────────────── */}
      <div className="anim-fade-up anim-delay-3" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18' }}>Today's Meals</h2>
          <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#a1a79a' }}>{meals.length} logged</span>
        </div>

        {meals.length > 0 ? (
          <div
            className="scrollbar-hide"
            style={{
              display: 'flex',
              gap: 12,
              overflowX: 'auto',
              margin: '0 -20px',
              padding: '4px 20px 8px',
            }}
          >
            {meals.map((m: any) => (
              <MealCard key={m.id} {...m} />
            ))}
          </div>
        ) : (
          <div
            className="card"
            style={{
              padding: '32px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 40, color: '#c6c8b9' }}
            >
              restaurant
            </span>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#72796a' }}>No meals logged yet.</p>
            <button
              onClick={() => navigate('/meals')}
              className="btn-lime"
              style={{ marginTop: 4 }}
            >
              Log food
            </button>
          </div>
        )}
      </div>

      {/* ▸ Daily Tips — Do's & Don'ts ────────── */}
      <div className="anim-fade-up anim-delay-4" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '0.8125rem', color: '#1b1c18', marginBottom: 12 }}>Daily Tips</h2>

        {/* Do's */}
        <div className="card" style={{ padding: '16px 18px', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#16a34a', fontVariationSettings: "'wght' 700" }}>check</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', letterSpacing: '0.03em', fontFamily: 'var(--font-display)' }}>DO'S</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(profile?.goal === 'lose_fat' ? [
              { icon: 'water_drop', tip: 'Drink water before meals to reduce appetite' },
              { icon: 'directions_walk', tip: 'Walk 10,000 steps daily for active calorie burn' },
              { icon: 'egg_alt', tip: 'Eat protein-rich breakfasts to stay full longer' },
            ] : profile?.goal === 'bulk' ? [
              { icon: 'fitness_center', tip: 'Train each muscle group twice per week' },
              { icon: 'restaurant', tip: 'Eat within 30 min after your workout' },
              { icon: 'local_drink', tip: 'Consume 1g protein per pound of body weight' },
            ] : [
              { icon: 'schedule', tip: 'Eat meals at consistent times each day' },
              { icon: 'self_improvement', tip: 'Practice mindful eating — slow down' },
              { icon: 'local_drink', tip: 'Stay hydrated — aim for 8 glasses daily' },
            ]).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#65a30d', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#45483d', lineHeight: 1.4 }}>{item.tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Don'ts */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#dc2626', fontVariationSettings: "'wght' 700" }}>close</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', letterSpacing: '0.03em', fontFamily: 'var(--font-display)' }}>DON'TS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(profile?.goal === 'lose_fat' ? [
              { icon: 'bedtime', tip: 'Don\'t eat heavy meals after 8 PM' },
              { icon: 'no_drinks', tip: 'Avoid sugary drinks — they add hidden calories' },
              { icon: 'remove_circle', tip: 'Don\'t skip meals — it leads to overeating later' },
            ] : profile?.goal === 'bulk' ? [
              { icon: 'trending_down', tip: 'Don\'t skip rest days — muscles grow during recovery' },
              { icon: 'fastfood', tip: 'Avoid relying on junk food for extra calories' },
              { icon: 'bedtime', tip: 'Don\'t sacrifice sleep — aim for 7-9 hours' },
            ] : [
              { icon: 'fastfood', tip: 'Avoid excessive processed and fast food' },
              { icon: 'trending_down', tip: 'Don\'t crash diet — it damages your metabolism' },
              { icon: 'no_drinks', tip: 'Limit alcohol intake — it impairs recovery' },
            ]).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ef4444', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#45483d', lineHeight: 1.4 }}>{item.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ▸ FAB ─────────────────────────────────── */}
      <button
        onClick={() => navigate('/meals')}
        style={{
          position: 'fixed',
          bottom: 96,
          right: 'max(20px, calc(50vw - 215px + 20px))',
          zIndex: 40,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #bef264, #4d7c0f)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(77,124,15,0.35)',
          transition: 'transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease',
          animation: 'pulseGlow 2.5s ease-in-out infinite',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 26, fontVariationSettings: "'wght' 600" }}>add</span>
      </button>

      {/* ▸ Toast ───────────────────────────────── */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
