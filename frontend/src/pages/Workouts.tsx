import { useState, useEffect } from 'react';
import { useApp } from '@/main';
import { exercisesApi } from '@/services/api';
<<<<<<< Updated upstream
import { Search, Filter, Dumbbell, Clock, Zap } from 'lucide-react';
=======

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Cardio', 'Stretching'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CATEGORY_ICONS: Record<string, string> = {
  Chest: 'fitness_center', Back: 'accessibility_new', Legs: 'directions_run', Arms: 'sports_gymnastics',
  Shoulders: 'sports_martial_arts', Core: 'self_improvement', Cardio: 'monitor_heart', Stretching: 'accessibility',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#10b981',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
};
>>>>>>> Stashed changes

const DIFFICULTY_BGS: Record<string, string> = {
  Beginner: '#d1fae5',
  Intermediate: '#fef3c7',
  Advanced: '#fee2e2',
};

export default function Workouts() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await exercisesApi.getAll(category || undefined);
        setExercises(data);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [category]);

  const filtered = exercises.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.muscle_group.toLowerCase().includes(search.toLowerCase())
  );

  return (
<<<<<<< Updated upstream
    <div className="page-container">
      <h1 className="text-2xl font-extrabold tracking-tight mb-6">Workouts 🏋️</h1>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
=======
    <div className="page-container relative bg-white min-h-screen">
      <div className="absolute top-[10%] right-[-20%] w-[400px] h-[400px] bg-slate-100 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      {/* Header */}
      <div className="pt-4 mb-6 animate-slideUp">
        <h1 className="text-3xl font-extrabold tracking-tight font-display text-slate-900 leading-none mb-2">
          Workouts
        </h1>
        <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>library_books</span>
          Browse {exercises.length} exercises
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 animate-slideUp" style={{ animationDelay: '0.05s' }}>
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
>>>>>>> Stashed changes
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
<<<<<<< Updated upstream
          placeholder="Search exercises or muscles..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none glass-card-flat text-sm font-medium focus:ring-2 focus:ring-lime-400 transition-all"
=======
          placeholder="Search exercises..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-sm"
>>>>>>> Stashed changes
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        )}
      </div>

<<<<<<< Updated upstream
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {['', 'Strength', 'Cardio', 'Yoga', 'Stretching'].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              category === c ? 'bg-lime-400 text-lime-950 scale-105 shadow-lg shadow-lime-200' : 'bg-white text-gray-500 border border-gray-100'
            }`}
          >
            {c || 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading exercises...</div>
        ) : filtered.length > 0 ? (
          filtered.map((ex, i) => (
            <div key={i} className="glass-card p-5 animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-base font-extrabold mb-0.5">{ex.name}</h3>
                  <div className="flex gap-2">
                    <span className="badge badge-lime text-[9px] uppercase tracking-tighter">{ex.muscle_group}</span>
                    <span className="badge bg-gray-100 text-gray-600 text-[9px] uppercase tracking-tighter">{ex.difficulty}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-lime-50 flex items-center justify-center">
                  <Dumbbell size={18} className="text-lime-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{ex.description}</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                  <Clock size={14} /> 10-15 mins
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                  <Zap size={14} /> {ex.calories_per_hour || 300} kcal/hr
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 italic">No exercises found.</div>
=======
      {/* Category Filter */}
      <div className="flex gap-2.5 mb-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide animate-slideUp" style={{ animationDelay: '0.1s' }}>
        {CATEGORIES.map((c) => {
          const isSelected = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-display font-bold transition-all"
              style={{
                background: isSelected ? '#0f172a' : '#f8fafc',
                color: isSelected ? 'white' : '#475569',
                border: `1px solid ${isSelected ? '#0f172a' : '#e2e8f0'}`,
                boxShadow: isSelected ? '0 4px 12px rgba(15,23,42,0.15)' : 'none'
              }}
            >
              {c !== 'All' && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{CATEGORY_ICONS[c]}</span>}
              {c}
            </button>
          );
        })}
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2.5 mb-8 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide animate-slideUp" style={{ animationDelay: '0.15s' }}>
        {DIFFICULTIES.map((d) => {
          const isSelected = difficulty === d;
          return (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: isSelected ? '#334155' : 'transparent',
                color: isSelected ? 'white' : '#64748b',
                border: `1px solid ${isSelected ? '#334155' : '#cbd5e1'}`,
              }}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* Exercise List */}
      <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="material-symbols-outlined animate-spin mb-4" style={{ fontSize: 32 }}>progress_activity</span>
            <p className="font-display font-medium text-sm">Loading exercises...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 rounded-3xl border border-slate-100">
            <span className="material-symbols-outlined mb-4" style={{ fontSize: 48 }}>search_off</span>
            <p className="font-display font-medium text-sm">No exercises found.</p>
            <button onClick={() => {setSearch(''); setCategory('All'); setDifficulty('All');}} className="mt-4 text-xs font-bold text-slate-900 underline">Clear filters</button>
          </div>
        ) : (
          <div className="space-y-4 pb-6 stagger-children">
            {filtered.map((ex, idx) => {
              const isExpanded = expanded === ex.name;
              return (
                <div key={ex.name} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors hover:shadow-sm" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : ex.name)}
                    className="w-full flex items-center gap-4 p-4 text-left"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-slate-100 text-slate-700">
                      <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{CATEGORY_ICONS[ex.category] || 'fitness_center'}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-display font-bold text-slate-900 truncate mb-1">{ex.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">{ex.category}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide" style={{
                          background: DIFFICULTY_BGS[ex.difficulty] || '#e2e8f0',
                          color: DIFFICULTY_COLORS[ex.difficulty] || '#64748b',
                        }}>
                          {ex.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-slate-100 text-slate-700' : ''}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>keyboard_arrow_down</span>
                    </div>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pb-4 pt-1">
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>accessibility_new</span>
                          <span className="text-xs font-bold font-display text-slate-700 uppercase tracking-widest">Target Muscles</span>
                        </div>
                        <div className="text-sm font-medium text-slate-600 mb-4 ml-7">{ex.muscles}</div>
                        
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-slate-400 mt-0.5" style={{ fontSize: 18 }}>info</span>
                          <p className="text-sm leading-relaxed text-slate-600 font-medium">{ex.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
>>>>>>> Stashed changes
        )}
      </div>
    </div>
  );
}
