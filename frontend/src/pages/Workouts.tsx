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
    <div className="page-container relative" style={{ paddingTop: 'env(safe-area-inset-top, 2.5rem)', paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none -z-10" style={{ background: 'radial-gradient(circle, rgba(163,230,53,0.08) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />

      {/* Header */}
      <div className="px-4 pt-12 pb-4 animate-slideUp" style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 30px))' }}>
        <h1 className="text-3xl font-extrabold tracking-tight font-headline text-on-surface leading-none">Training Center</h1>
        <p className="text-sm text-on-surface-variant font-medium mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>library_books</span>
          {exercises.length} exercises available
        </p>
      </div>

      {/* Search */}
      <div className="px-4 mb-4 relative animate-slideUp" style={{ animationDelay: '0.05s' }}>
        <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 20 }}>search</span>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises or muscle groups..."
          style={{
            width: '100%', paddingLeft: 48, paddingRight: 16, paddingTop: 14, paddingBottom: 14,
            borderRadius: '999px', border: '1px solid rgba(194,202,176,0.3)',
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
            fontSize: '0.9rem', fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c', outline: 'none',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#5a5c5c' }}>close</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 px-4 animate-slideUp" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', animationDelay: '0.08s' }}>
        {CATEGORIES.map((c) => {
          const isActive = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all"
              style={{
                background: isActive ? '#1a1c1c' : 'rgba(255,255,255,0.8)',
                color: isActive ? 'white' : '#5a5c5c',
                border: `1px solid ${isActive ? '#1a1c1c' : 'rgba(194,202,176,0.3)'}`,
                boxShadow: isActive ? '0 4px 12px rgba(26,28,28,0.15)' : 'none',
                backdropFilter: 'blur(8px)',
              }}
            >
              {c !== 'All' && <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{CATEGORY_ICONS[c]}</span>}
              {c}
            </button>
          );
        })}
      </div>

      {/* Difficulty */}
      <div className="flex gap-2 mb-5 px-4 animate-slideUp" style={{ animationDelay: '0.12s' }}>
        {DIFFICULTIES.map((d) => {
          const isActive = difficulty === d;
          const diff = DIFFICULTY_COLORS[d];
          return (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: isActive && diff ? diff.bg : (isActive ? '#f3f3f4' : 'transparent'),
                color: isActive && diff ? diff.text : (isActive ? '#1a1c1c' : '#5a5c5c'),
                border: `1px solid ${isActive ? (diff?.text || '#1a1c1c') : 'rgba(194,202,176,0.3)'}`,
              }}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* Exercise List */}
      <div className="px-4 space-y-3 pb-6 animate-slideUp stagger-children" style={{ animationDelay: '0.15s' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin mb-3" style={{ fontSize: 36 }}>progress_activity</span>
            <p className="text-sm font-medium">Loading exercises...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant" style={{ background: '#f3f3f4', borderRadius: '1.5rem', padding: '2rem' }}>
            <span className="material-symbols-outlined mb-3" style={{ fontSize: 48, fontVariationSettings: "'FILL' 0, 'wght' 200" }}>search_off</span>
            <p className="text-sm font-medium">No exercises found</p>
            <button onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All'); }}
              style={{ marginTop: 12, fontSize: '0.8rem', fontWeight: 700, color: '#1a1c1c', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((ex) => {
            const isExpanded = expanded === ex.name;
            const diff = DIFFICULTY_COLORS[ex.difficulty] || { text: '#5a5c5c', bg: '#f3f3f4' };
            return (
              <div
                key={ex.name}
                style={{
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
                  borderRadius: '1.25rem', border: '1px solid rgba(194,202,176,0.2)',
                  overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s ease',
                }}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : ex.name)}
                  className="w-full flex items-center gap-3 text-left"
                  style={{ padding: '14px 16px' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '0.875rem', background: '#f3f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#1a1c1c' }}>{CATEGORY_ICONS[ex.category] || 'fitness_center'}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-sm font-headline font-bold text-on-surface truncate">{ex.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-on-surface-variant">{ex.category}</span>
                      <span style={{ display: 'inline-block', width: 3, height: 3, borderRadius: '50%', background: '#c2cab0' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: diff.bg, color: diff.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {ex.difficulty}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: isExpanded ? '#a3e635' : '#f3f3f4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: isExpanded ? '#416400' : '#5a5c5c', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>keyboard_arrow_down</span>
                  </div>
                </button>
                <div
                  style={{
                    overflow: 'hidden', maxHeight: isExpanded ? '400px' : 0,
                    opacity: isExpanded ? 1 : 0,
                    transition: 'max-height 0.35s ease, opacity 0.25s ease',
                  }}
                >
                  <div style={{ padding: '0 16px 16px' }}>
                    <div style={{ background: '#f9f9f9', borderRadius: '0.875rem', padding: '14px' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#5a5c5c' }}>accessibility_new</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Plus Jakarta Sans', color: '#5a5c5c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Target Muscles</span>
                      </div>
                      <p className="text-sm font-medium text-on-surface ml-6 mb-3">{ex.muscles}</p>
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#5a5c5c', marginTop: 2 }}>info</span>
                        <p className="text-sm leading-relaxed text-on-surface-variant">{ex.description}</p>
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
