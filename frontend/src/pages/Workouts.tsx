import { useState, useEffect } from 'react';
import { useApp } from '@/main';
import { exercisesApi } from '@/services/api';
import { Search, Filter, Dumbbell, Clock, Zap } from 'lucide-react';

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
    <div className="page-container">
      <h1 className="text-2xl font-extrabold tracking-tight mb-6">Workouts 🏋️</h1>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises or muscles..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none glass-card-flat text-sm font-medium focus:ring-2 focus:ring-lime-400 transition-all"
        />
      </div>

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
        )}
      </div>
    </div>
  );
}
