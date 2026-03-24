import { useState, useEffect } from 'react';
import { exercisesApi } from '@/services/api';
import { Search, Filter, ChevronDown, Dumbbell } from 'lucide-react';

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Cardio', 'Stretching'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CATEGORY_EMOJIS: Record<string, string> = {
  Chest: '💪', Back: '🏋️', Legs: '🦵', Arms: '💪',
  Shoulders: '🔺', Core: '🎯', Cardio: '🏃', Stretching: '🧘',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#10b981',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
};

export default function Workouts() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, [category, difficulty]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const data = await exercisesApi.getAll(
        category === 'All' ? undefined : category,
        difficulty === 'All' ? undefined : difficulty
      );
      setExercises(data);
    } catch { setExercises([]); }
    setLoading(false);
  };

  const filtered = exercises.filter((ex) =>
    search ? ex.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="page-container">
      <h1 className="text-2xl font-extrabold tracking-tight mb-2 animate-fadeIn">Workouts 🏋️</h1>
      <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>Browse {exercises.length} exercises</p>

      {/* Search */}
      <div className="relative mb-4 animate-fadeIn">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-100"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 animate-fadeIn">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: category === c ? 'var(--primary)' : 'white',
              color: category === c ? '#1a2e05' : 'var(--foreground)',
              border: `1px solid ${category === c ? 'var(--primary)' : '#e5e7eb'}`,
            }}
          >
            {c !== 'All' && <span className="mr-1">{CATEGORY_EMOJIS[c]}</span>}
            {c}
          </button>
        ))}
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2 mb-5 animate-fadeIn">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: difficulty === d ? '#1f2937' : 'white',
              color: difficulty === d ? 'white' : 'var(--foreground)',
              border: `1px solid ${difficulty === d ? '#1f2937' : '#e5e7eb'}`,
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Exercise List */}
      {loading ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>Loading exercises...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>No exercises found</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((ex) => (
            <div key={ex.name} className="glass-card-flat overflow-hidden animate-fadeIn">
              <button
                onClick={() => setExpanded(expanded === ex.name ? null : ex.name)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-soft)' }}>
                  <span className="text-lg">{CATEGORY_EMOJIS[ex.category] || '🏋️'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{ex.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{ex.category}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{
                      background: `${DIFFICULTY_COLORS[ex.difficulty]}20`,
                      color: DIFFICULTY_COLORS[ex.difficulty],
                    }}>
                      {ex.difficulty}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  style={{
                    color: 'var(--muted)',
                    transform: expanded === ex.name ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>
              {expanded === ex.name && (
                <div className="px-4 pb-4 animate-fadeIn">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
                      <strong>Muscles:</strong> {ex.muscles}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>{ex.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
