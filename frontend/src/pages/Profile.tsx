import { useState } from 'react';
import { useApp } from '@/main';
import { profileApi, targetsApi } from '@/services/api';
import { User, Edit3, Save, Trash2, ChevronRight, RefreshCw } from 'lucide-react';

export default function Profile() {
  const { profile, setProfile, navigate } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const update = (key: string, value: any) => setForm((p: any) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const newTargets = await targetsApi.calculate(form);
      const updated = await profileApi.update({ ...form, targets: newTargets });
      setProfile(updated);
      setEditing(false);
      showToast('Profile updated! ✅');
    } catch { showToast('Failed to save'); }
    setSaving(false);
  };

  const handleRecalculate = async () => {
    try {
      const newTargets = await targetsApi.calculate(profile);
      const updated = await profileApi.update({ ...profile, targets: newTargets });
      setProfile(updated);
      showToast('Targets recalculated! 📊');
    } catch { showToast('Failed to recalculate'); }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  if (!profile) return null;

  const targets = profile.targets || {};

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6 animate-fadeIn">
        <h1 className="text-2xl font-extrabold tracking-tight">Profile 👤</h1>
        <button onClick={() => { setEditing(!editing); setForm({ ...profile }); }}
          className="btn-icon">
          {editing ? <Save size={18} /> : <Edit3 size={18} />}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-2"
          style={{ background: 'var(--primary-soft)' }}>
          {profile.gender === 'female' ? '👩' : profile.gender === 'other' ? '🧑' : '👨'}
        </div>
        <h2 className="text-lg font-extrabold">{profile.name}</h2>
        <span className="badge badge-lime mt-1 capitalize">{profile.goal?.replace('_', ' ')}</span>
      </div>

      {/* Targets Card */}
      <div className="glass-card p-5 mb-4 animate-slideUp">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">Daily Targets</h3>
          <button onClick={handleRecalculate} className="text-xs font-semibold flex items-center gap-1"
            style={{ color: 'var(--primary-dark)' }}>
            <RefreshCw size={12} /> Recalculate
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Calories', value: targets.calories, unit: 'kcal' },
            { label: 'Protein', value: targets.protein, unit: 'g' },
            { label: 'Carbs', value: targets.carbs, unit: 'g' },
            { label: 'Fat', value: targets.fat, unit: 'g' },
            { label: 'BMR', value: targets.bmr, unit: 'kcal' },
            { label: 'TDEE', value: targets.tdee, unit: 'kcal' },
          ].map((t) => (
            <div key={t.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-[10px] font-medium" style={{ color: 'var(--muted)' }}>{t.label}</div>
              <div className="text-sm font-extrabold">{t.value || 0}
                <span className="text-[9px] font-medium ml-0.5" style={{ color: 'var(--muted)' }}>{t.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Details */}
      <div className="glass-card p-5 mb-4 animate-slideUp" style={{ animationDelay: '0.05s' }}>
        <h3 className="text-sm font-bold mb-3">Details</h3>
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1 block">Name</label>
              <input type="text" value={form.name || ''} onChange={(e) => update('name', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-lime-400" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Age: {form.age}</label>
              <input type="range" min={15} max={80} value={form.age || 25}
                onChange={(e) => update('age', parseInt(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Height: {form.height_cm} cm</label>
              <input type="range" min={120} max={220} value={form.height_cm || 170}
                onChange={(e) => update('height_cm', parseInt(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Weight: {form.weight_kg} kg</label>
              <input type="range" min={30} max={200} value={form.weight_kg || 70}
                onChange={(e) => update('weight_kg', parseInt(e.target.value))} />
            </div>
            <button onClick={handleSave} className="btn-primary w-full py-2.5" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {[
              { label: 'Age', value: `${profile.age} years` },
              { label: 'Gender', value: profile.gender },
              { label: 'Height', value: `${profile.height_cm} cm` },
              { label: 'Weight', value: `${profile.weight_kg} kg` },
              { label: 'Activity', value: profile.activity_level?.replace('_', ' ') },
              { label: 'Diet', value: profile.diet_preference },
              { label: 'Conditions', value: profile.health_conditions?.length ? profile.health_conditions.join(', ') : 'None' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>{item.label}</span>
                <span className="font-semibold capitalize">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Health Conditions Link */}
      {profile.health_conditions?.length > 0 && (
        <button onClick={() => navigate('/health-conditions')}
          className="glass-card-flat w-full p-4 flex items-center justify-between mb-4 animate-slideUp"
          style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <span className="text-xl">❤️</span>
            <span className="text-sm font-bold">Health Guide</span>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
        </button>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
