import { useState, useEffect } from 'react';
import { useApp } from '@/main';
import { exercisesApi } from '@/services/api';

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Cardio'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CAT_META: Record<string, { icon: string; gradient: string }> = {
  Chest: { icon: 'fitness_center', gradient: 'linear-gradient(135deg,#fde68a,#f59e0b)' },
  Back: { icon: 'accessibility_new', gradient: 'linear-gradient(135deg,#bbf7d0,#22c55e)' },
  Legs: { icon: 'directions_run', gradient: 'linear-gradient(135deg,#bfdbfe,#3b82f6)' },
  Arms: { icon: 'sports_gymnastics', gradient: 'linear-gradient(135deg,#fecaca,#ef4444)' },
  Shoulders: { icon: 'sports_martial_arts', gradient: 'linear-gradient(135deg,#e9d5ff,#a855f7)' },
  Core: { icon: 'self_improvement', gradient: 'linear-gradient(135deg,#cffafe,#06b6d4)' },
  Cardio: { icon: 'monitor_heart', gradient: 'linear-gradient(135deg,#fce7f3,#ec4899)' },
};

const DIFF_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  Beginner: { text: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  Intermediate: { text: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  Advanced: { text: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
};

// Suggestions based on health conditions
const CONDITION_WORKOUTS: Record<string, { name: string; why: string; icon: string }[]> = {
  diabetes: [
    { name: 'Walking', why: 'Improves insulin sensitivity', icon: 'directions_walk' },
    { name: 'Swimming', why: 'Low impact, full-body workout', icon: 'pool' },
    { name: 'Yoga', why: 'Reduces stress and blood sugar', icon: 'self_improvement' },
  ],
  hypertension: [
    { name: 'Brisk Walking', why: 'Lowers blood pressure naturally', icon: 'directions_walk' },
    { name: 'Cycling', why: 'Gentle cardio, heart-friendly', icon: 'pedal_bike' },
    { name: 'Stretching', why: 'Reduces tension and stress', icon: 'accessibility' },
  ],
  heart_disease: [
    { name: 'Walking', why: 'Safe, steady-state cardio', icon: 'directions_walk' },
    { name: 'Tai Chi', why: 'Gentle movement, reduces stress', icon: 'self_improvement' },
    { name: 'Light Resistance', why: 'Strengthens heart safely', icon: 'fitness_center' },
  ],
  default: [
    { name: 'Push-ups', why: 'Build upper body strength', icon: 'fitness_center' },
    { name: 'Squats', why: 'Strengthen legs and core', icon: 'directions_run' },
    { name: 'Planks', why: 'Core stability and posture', icon: 'self_improvement' },
  ],
};

export default function Workouts() {
  const { profile } = useApp();
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const conditions = profile?.health_conditions || [];
  const suggestions = conditions.length > 0
    ? CONDITION_WORKOUTS[conditions[0]] || CONDITION_WORKOUTS.default
    : CONDITION_WORKOUTS.default;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setExercises(await exercisesApi.getAll(category !== 'All' ? category : undefined)); }
      catch { /* ignore */ }
      setLoading(false);
    })();
  }, [category]);

  const filtered = exercises.filter((ex) => {
    const q = search.toLowerCase();
    const termsMatch = ex.name.toLowerCase().includes(q) || (ex.muscles || '').toLowerCase().includes(q);
    const diffMatch = difficulty === 'All' || ex.difficulty === difficulty;
    return termsMatch && diffMatch;
  });

  return (
    <div className="page-shell" style={{ paddingTop: 24 }}>

      {/* ▸ Header ─────────────────────────────── */}
      <header className="anim-fade-up" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', lineHeight: 1.1 }}>Workouts</h1>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--tb-text-secondary)', marginTop: 4 }}>
              {exercises.length} exercises · {conditions.length > 0 ? conditions.join(', ') : 'All conditions'}
            </p>
          </div>
          <div style={{
            width: 44, height: 44, borderRadius: 16,
            background: 'linear-gradient(135deg, #bef264, #4d7c0f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(77,124,15,0.25)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#fff', fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
          </div>
        </div>
      </header>

      {/* ▸ Recommended for You ────────────────── */}
      <div className="anim-fade-up anim-delay-1" style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: '0.8125rem', color: 'var(--tb-text)', marginBottom: 12 }}>
          Recommended for You
        </h2>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 6px' }} className="scrollbar-hide">
          {suggestions.map((s, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 140, padding: '16px 14px',
              borderRadius: 20, border: 'var(--tb-border-card)',
              background: 'var(--tb-surface)', backdropFilter: 'blur(30px)',
              boxShadow: 'var(--tb-card-shadow)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: 'var(--tb-accent-pill)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#3d6a00', fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--tb-text)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: '0.625rem', fontWeight: 500, color: 'var(--tb-text-secondary)', lineHeight: 1.4 }}>{s.why}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ▸ Search ─────────────────────────────── */}
      <div className="anim-fade-up anim-delay-2" style={{ position: 'relative', marginBottom: 14 }}>
        <span className="material-symbols-outlined" style={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'var(--tb-text-secondary)',
        }}>search</span>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          style={{
            width: '100%', padding: '13px 40px 13px 44px',
            borderRadius: 100, border: '1px solid rgba(198,200,185,0.25)',
            background: 'var(--tb-surface)', backdropFilter: 'blur(8px)',
            fontSize: '0.8125rem', fontFamily: 'var(--font-display)', color: 'var(--tb-text)', outline: 'none',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--tb-text-secondary)' }}>close</span>
          </button>
        )}
      </div>

      {/* ▸ Category Chips ─────────────────────── */}
      <div className="scrollbar-hide anim-fade-up anim-delay-2" style={{
        display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 4px', marginBottom: 10,
      }}>
        {CATEGORIES.map((c) => {
          const isActive = category === c;
          const meta = CAT_META[c];
          return (
            <button key={c} onClick={() => setCategory(c)} style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
              padding: isActive ? '7px 14px 7px 7px' : '8px 14px', borderRadius: 100, border: 'none',
              background: isActive ? 'var(--tb-text)' : 'var(--tb-surface)',
              color: isActive ? '#fff' : 'var(--tb-text-secondary)',
              fontSize: '0.6875rem', fontWeight: 700, fontFamily: 'var(--font-display)',
              boxShadow: isActive ? '0 4px 12px rgba(27,28,24,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
              cursor: 'pointer', transition: 'all 0.25s cubic-bezier(.22,1,.36,1)',
            }}>
              {meta && isActive && (
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: meta.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#fff' }}>{meta.icon}</span>
                </div>
              )}
              {c}
            </button>
          );
        })}
      </div>

      {/* ▸ Difficulty Chips ───────────────────── */}
      <div className="anim-fade-up anim-delay-3" style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {DIFFICULTIES.map((d) => {
          const isActive = difficulty === d;
          const st = DIFF_STYLE[d];
          return (
            <button key={d} onClick={() => setDifficulty(d)} style={{
              padding: '6px 12px', borderRadius: 100, fontSize: '0.625rem', fontWeight: 700, border: 'none',
              background: isActive ? (st?.bg || '#e9e9e4') : 'transparent',
              color: isActive ? (st?.text || '#1b1c18') : '#a1a79a',
              outline: isActive ? `1.5px solid ${st?.border || '#1b1c18'}` : '1.5px solid transparent',
              cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.2s ease',
            }}>{d}</button>
          );
        })}
      </div>

      {/* ▸ Exercise Cards ─────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', color: 'var(--tb-text-secondary)' }}>
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, marginBottom: 12 }}>progress_activity</span>
            <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Loading exercises...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#c6c8b9', marginBottom: 8, display: 'block', fontVariationSettings: "'wght' 200" }}>search_off</span>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--tb-text-secondary)' }}>No exercises found</p>
            <button onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All'); }} style={{
              marginTop: 12, fontSize: '0.75rem', fontWeight: 700, color: '#3d6a00',
              background: '#ecfccb', border: 'none', padding: '8px 20px', borderRadius: 100, cursor: 'pointer',
            }}>Clear filters</button>
          </div>
        ) : (
          filtered.map((ex) => {
            const isExp = expanded === ex.name;
            const diff = DIFF_STYLE[ex.difficulty] || { text: '#72796a', bg: '#e9e9e4', border: '#d4d4d4' };
            const meta = CAT_META[ex.category] || { icon: 'fitness_center', gradient: 'linear-gradient(135deg,#e9e9e4,#d4d4d4)' };
            return (
              <div key={ex.name} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                <button
                  onClick={() => setExpanded(isExp ? null : ex.name)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    textAlign: 'left', padding: '16px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 14, background: meta.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#fff' }}>{meta.icon}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.8125rem', fontWeight: 700, color: 'var(--tb-text)', fontFamily: 'var(--font-display)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{ex.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: '0.625rem', fontWeight: 500, color: 'var(--tb-text-secondary)' }}>{ex.category}</span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--tb-text-muted)' }} />
                      <span style={{
                        fontSize: '0.5625rem', fontWeight: 700, padding: '2px 8px',
                        borderRadius: 100, background: diff.bg, color: diff.text, border: `1px solid ${diff.border}`,
                      }}>{ex.difficulty}</span>
                    </div>
                  </div>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: isExp ? 'var(--tb-accent)' : 'var(--tb-input-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s ease',
                  }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize: 16, color: isExp ? '#3d6a00' : 'var(--tb-text-secondary)',
                      transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease',
                    }}>keyboard_arrow_down</span>
                  </div>
                </button>
                {/* Expanded */}
                <div style={{
                  overflow: 'hidden', maxHeight: isExp ? 500 : 0, opacity: isExp ? 1 : 0,
                  transition: 'max-height 0.35s ease, opacity 0.25s ease',
                }}>
                  <div style={{ padding: '0 16px 16px' }}>
                    <div style={{ background: 'var(--tb-bg)', borderRadius: 14, padding: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#3d6a00' }}>accessibility_new</span>
                        <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#3d6a00', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Target Muscles</span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--tb-text)', marginBottom: 10, paddingLeft: 20 }}>{ex.muscles}</p>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--tb-text-secondary)', marginTop: 2 }}>info</span>
                        <p style={{ fontSize: '0.75rem', lineHeight: 1.6, color: 'var(--tb-text-secondary)' }}>{ex.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
