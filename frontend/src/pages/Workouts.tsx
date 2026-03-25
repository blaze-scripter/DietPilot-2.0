import { useState, useEffect } from 'react';
import { exercisesApi } from '@/services/api';

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Cardio', 'Stretching'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CATEGORY_ICONS: Record<string, string> = {
  Chest: 'fitness_center', Back: 'accessibility_new', Legs: 'directions_run', Arms: 'sports_gymnastics',
  Shoulders: 'sports_martial_arts', Core: 'self_improvement', Cardio: 'monitor_heart', Stretching: 'accessibility',
};

const DIFFICULTY_COLORS: Record<string, { text: string; bg: string }> = {
  Beginner: { text: '#15803d', bg: '#dcfce7' },
  Intermediate: { text: '#b45309', bg: '#fef3c7' },
  Advanced: { text: '#dc2626', bg: '#fee2e2' },
};

export default function Workouts() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await exercisesApi.getAll(category !== 'All' ? category : undefined);
        setExercises(data);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [category]);

  const filtered = exercises.filter((ex) => {
    const termsMatch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
      (ex.muscles || '').toLowerCase().includes(search.toLowerCase());
    const diffMatch = difficulty === 'All' || ex.difficulty === difficulty;
    return termsMatch && diffMatch;
  });

  return (
    <div className="page-shell" style={{ paddingTop: 24 }}>

      {/* ▸ Header ─────────────────────────────── */}
      <header className="anim-fade-up" style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.5rem' }}>Training Center</h1>
        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#72796a', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>library_books</span>
          {exercises.length} exercises available
        </p>
      </header>

      {/* ▸ Search ─────────────────────────────── */}
      <div className="anim-fade-up anim-delay-1" style={{ position: 'relative', marginBottom: 16 }}>
        <span className="material-symbols-outlined" style={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          fontSize: 18, color: '#72796a',
        }}>search</span>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises or muscle groups..."
          style={{
            width: '100%', padding: '14px 40px 14px 44px',
            borderRadius: 100, border: '1px solid rgba(198,200,185,0.3)',
            background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
            fontSize: '0.8125rem', fontFamily: 'var(--font-display)',
            color: '#1b1c18', outline: 'none',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#72796a' }}>close</span>
          </button>
        )}
      </div>

      {/* ▸ Category Chips ─────────────────────── */}
      <div
        className="scrollbar-hide anim-fade-up anim-delay-2"
        style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          margin: '0 -20px', padding: '0 20px 4px',
          marginBottom: 12,
        }}
      >
        {CATEGORIES.map((c) => {
          const isActive = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 100, border: 'none',
                background: isActive ? '#1b1c18' : 'rgba(255,255,255,0.6)',
                color: isActive ? 'white' : '#72796a',
                fontSize: '0.75rem', fontWeight: 700,
                fontFamily: 'var(--font-display)',
                boxShadow: isActive ? '0 4px 12px rgba(27,28,24,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(.22,1,.36,1)',
              }}
            >
              {c !== 'All' && <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{CATEGORY_ICONS[c]}</span>}
              {c}
            </button>
          );
        })}
      </div>

      {/* ▸ Difficulty Chips ───────────────────── */}
      <div className="anim-fade-up anim-delay-3" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {DIFFICULTIES.map((d) => {
          const isActive = difficulty === d;
          const diff = DIFFICULTY_COLORS[d];
          return (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 100,
                fontSize: '0.6875rem', fontWeight: 700, border: 'none',
                background: isActive && diff ? diff.bg : (isActive ? '#e9e9e4' : 'transparent'),
                color: isActive && diff ? diff.text : (isActive ? '#1b1c18' : '#a1a79a'),
                outline: isActive ? `1.5px solid ${diff?.text || '#1b1c18'}` : '1.5px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                transition: 'all 0.2s ease',
              }}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* ▸ Exercise Cards ─────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', color: '#72796a' }}>
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 32, marginBottom: 12 }}>progress_activity</span>
            <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Loading exercises...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#c6c8b9', marginBottom: 8, display: 'block', fontVariationSettings: "'wght' 200" }}>search_off</span>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#72796a' }}>No exercises found</p>
            <button onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All'); }} style={{
              marginTop: 12, fontSize: '0.75rem', fontWeight: 700, color: '#1b1c18',
              background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer',
            }}>
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((ex) => {
            const isExpanded = expanded === ex.name;
            const diff = DIFFICULTY_COLORS[ex.difficulty] || { text: '#72796a', bg: '#e9e9e4' };
            return (
              <div key={ex.name} className="card" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : ex.name)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    textAlign: 'left', padding: '16px 18px',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, background: '#e9e9e4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#1b1c18' }}>
                      {CATEGORY_ICONS[ex.category] || 'fitness_center'}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.8125rem', fontWeight: 700, color: '#1b1c18',
                      fontFamily: 'var(--font-display)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{ex.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#72796a' }}>{ex.category}</span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#c6c8b9', display: 'inline-block' }} />
                      <span className="badge" style={{
                        fontSize: '0.5625rem', fontWeight: 700, padding: '2px 8px',
                        borderRadius: 100, background: diff.bg, color: diff.text,
                      }}>
                        {ex.difficulty}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: isExpanded ? '#a3e635' : '#e9e9e4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s ease', flexShrink: 0,
                  }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize: 16, color: isExpanded ? '#3d6a00' : '#72796a',
                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s ease',
                    }}>keyboard_arrow_down</span>
                  </div>
                </button>

                {/* Expanded content */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: isExpanded ? 400 : 0,
                  opacity: isExpanded ? 1 : 0,
                  transition: 'max-height 0.35s ease, opacity 0.25s ease',
                }}>
                  <div style={{ padding: '0 18px 18px' }}>
                    <div style={{ background: '#f8f8f3', borderRadius: 14, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#72796a' }}>accessibility_new</span>
                        <span style={{
                          fontSize: '0.625rem', fontWeight: 700, color: '#72796a',
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          fontFamily: 'var(--font-display)',
                        }}>Target Muscles</span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#1b1c18', marginLeft: 20, marginBottom: 12 }}>{ex.muscles}</p>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#72796a', marginTop: 2 }}>info</span>
                        <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#45483d' }}>{ex.description}</p>
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
