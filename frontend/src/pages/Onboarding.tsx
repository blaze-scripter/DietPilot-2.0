import { useState } from 'react';
import { useApp } from '@/main';
import { profileApi, targetsApi } from '@/services/api';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const STEPS = ['Welcome', 'Basics', 'Body', 'Activity', 'Goal', 'Diet', 'Health', 'Summary'];

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', emoji: '🛋️' },
  { value: 'light', label: 'Light', desc: '1-3 days/week', emoji: '🚶' },
  { value: 'moderate', label: 'Moderate', desc: '3-5 days/week', emoji: '🏃' },
  { value: 'active', label: 'Active', desc: '6-7 days/week', emoji: '💪' },
  { value: 'very_active', label: 'Very Active', desc: 'Athlete / 2x daily', emoji: '🏋️' },
];

const GOAL_OPTIONS = [
  { value: 'lose_fat', label: 'Lose Fat', desc: 'Calorie deficit of 500 kcal', emoji: '🔥', color: '#ef4444' },
  { value: 'maintain', label: 'Maintain', desc: 'Stay at current weight', emoji: '⚖️', color: '#3b82f6' },
  { value: 'bulk', label: 'Bulk Up', desc: 'Calorie surplus of 300 kcal', emoji: '💪', color: '#10b981' },
];

const DIET_OPTIONS = [
  { value: 'any', label: 'Any', emoji: '🍽️' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'keto', label: 'Keto', emoji: '🥑' },
  { value: 'halal', label: 'Halal', emoji: '🍖' },
];

const HEALTH_OPTIONS = [
  { value: 'diabetes', label: 'Diabetes', emoji: '🩸' },
  { value: 'hypertension', label: 'Hypertension', emoji: '❤️' },
  { value: 'PCOS', label: 'PCOS', emoji: '🩺' },
  { value: 'high_cholesterol', label: 'High Cholesterol', emoji: '🫀' },
  { value: 'thyroid', label: 'Thyroid', emoji: '🦋' },
  { value: 'none', label: 'None', emoji: '✅' },
];

export default function Onboarding() {
  const { setProfile, navigate, refreshLog } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    age: 25,
    gender: 'male' as string,
    height_cm: 170,
    weight_kg: 70,
    activity_level: 'moderate',
    goal: 'lose_fat',
    diet_preference: 'any',
    health_conditions: [] as string[],
  });
  const [targets, setTargets] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const toggleCondition = (c: string) => {
    if (c === 'none') {
      setForm((p) => ({ ...p, health_conditions: [] }));
      return;
    }
    setForm((p) => ({
      ...p,
      health_conditions: p.health_conditions.includes(c)
        ? p.health_conditions.filter((x) => x !== c)
        : [...p.health_conditions, c],
    }));
  };

  const canNext = () => {
    if (step === 1) return form.name.trim().length > 0;
    return true;
  };

  const handleNext = async () => {
    if (step === STEPS.length - 2) {
      try {
        const t = await targetsApi.calculate(form);
        setTargets(t);
      } catch {
        setTargets({ bmr: 0, tdee: 0, calories: 0, protein: 0, carbs: 0, fat: 0 });
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const profile = await profileApi.create({ ...form, targets });
      setProfile(profile);
      await refreshLog();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
    setSaving(false);
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 animate-fadeIn">
      <div className="text-7xl mb-6">🥗</div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--foreground)' }}>
        Welcome to <span style={{ color: 'var(--primary-dark)' }}>DietPilot</span>
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
        Your personal diet companion, designed to help you hit your daily macro targets with ease.
      </p>
      <button className="btn-primary text-base px-8 py-3.5 flex items-center gap-2" onClick={() => setStep(1)}>
        <Sparkles size={18} /> Get Started
      </button>
    </div>
  );

  const renderBasics = () => (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Your Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-100 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">
          Age: <span style={{ color: 'var(--primary-dark)' }}>{form.age}</span>
        </label>
        <input
          type="range" min={15} max={80} value={form.age}
          onChange={(e) => update('age', parseInt(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-3">Gender</label>
        <div className="grid grid-cols-3 gap-3">
          {(['male', 'female', 'other'] as const).map((g) => (
            <button
              key={g}
              onClick={() => update('gender', g)}
              className="py-3 rounded-xl text-sm font-semibold transition-all border"
              style={{
                background: form.gender === g ? 'var(--primary-soft)' : 'white',
                borderColor: form.gender === g ? 'var(--primary)' : '#e5e7eb',
                color: form.gender === g ? '#3f6212' : 'var(--foreground)',
              }}
            >
              {g === 'male' ? '👨 Male' : g === 'female' ? '👩 Female' : '🧑 Other'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBody = () => (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <label className="block text-sm font-semibold mb-2">
          Height: <span style={{ color: 'var(--primary-dark)' }}>{form.height_cm} cm</span>
        </label>
        <input
          type="range" min={120} max={220} value={form.height_cm}
          onChange={(e) => update('height_cm', parseInt(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2">
          Weight: <span style={{ color: 'var(--primary-dark)' }}>{form.weight_kg} kg</span>
        </label>
        <input
          type="range" min={30} max={200} value={form.weight_kg}
          onChange={(e) => update('weight_kg', parseInt(e.target.value))}
        />
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-3 animate-fadeIn">
      {ACTIVITY_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => update('activity_level', opt.value)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all"
          style={{
            background: form.activity_level === opt.value ? 'var(--primary-soft)' : 'white',
            borderColor: form.activity_level === opt.value ? 'var(--primary)' : '#e5e7eb',
          }}
        >
          <span className="text-2xl">{opt.emoji}</span>
          <div className="text-left">
            <div className="text-sm font-bold">{opt.label}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{opt.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderGoal = () => (
    <div className="space-y-4 animate-fadeIn">
      {GOAL_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => update('goal', opt.value)}
          className="w-full flex items-center gap-4 p-5 rounded-2xl border transition-all"
          style={{
            background: form.goal === opt.value ? 'var(--primary-soft)' : 'white',
            borderColor: form.goal === opt.value ? 'var(--primary)' : '#e5e7eb',
          }}
        >
          <span className="text-3xl">{opt.emoji}</span>
          <div className="text-left">
            <div className="text-base font-bold">{opt.label}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{opt.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderDiet = () => (
    <div className="grid grid-cols-2 gap-3 animate-fadeIn">
      {DIET_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => update('diet_preference', opt.value)}
          className="flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all"
          style={{
            background: form.diet_preference === opt.value ? 'var(--primary-soft)' : 'white',
            borderColor: form.diet_preference === opt.value ? 'var(--primary)' : '#e5e7eb',
          }}
        >
          <span className="text-3xl">{opt.emoji}</span>
          <span className="text-sm font-semibold">{opt.label}</span>
        </button>
      ))}
    </div>
  );

  const renderHealth = () => (
    <div className="grid grid-cols-2 gap-3 animate-fadeIn">
      {HEALTH_OPTIONS.map((opt) => {
        const selected = opt.value === 'none'
          ? form.health_conditions.length === 0
          : form.health_conditions.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => toggleCondition(opt.value)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all"
            style={{
              background: selected ? 'var(--primary-soft)' : 'white',
              borderColor: selected ? 'var(--primary)' : '#e5e7eb',
            }}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span className="text-xs font-semibold">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">📊 Calculated Targets</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'BMR', value: `${targets?.bmr || 0}`, unit: 'kcal' },
            { label: 'TDEE', value: `${targets?.tdee || 0}`, unit: 'kcal' },
            { label: 'Daily Calories', value: `${targets?.calories || 0}`, unit: 'kcal' },
            { label: 'Protein', value: `${targets?.protein || 0}`, unit: 'g' },
            { label: 'Carbs', value: `${targets?.carbs || 0}`, unit: 'g' },
            { label: 'Fat', value: `${targets?.fat || 0}`, unit: 'g' },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{item.label}</div>
              <div className="text-lg font-extrabold" style={{ color: 'var(--foreground)' }}>
                {item.value}<span className="text-xs font-medium ml-0.5" style={{ color: 'var(--muted)' }}>{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const stepRenderers = [renderWelcome, renderBasics, renderBody, renderActivity, renderGoal, renderDiet, renderHealth, renderSummary];

  if (step === 0) return renderWelcome();

  return (
    <div className="page-container" style={{ paddingBottom: '120px' }}>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setStep((s) => Math.max(s - 1, 0))} className="btn-icon">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Step {step} of {STEPS.length - 1}</div>
          <div className="text-sm font-bold">{STEPS[step]}</div>
        </div>
        <div className="w-10" />
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(step / (STEPS.length - 1)) * 100}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--primary-dark))',
          }}
        />
      </div>
      {stepRenderers[step]()}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full p-4"
        style={{ maxWidth: '480px', background: 'linear-gradient(transparent, var(--background) 30%)' }}
      >
        {step === STEPS.length - 1 ? (
          <button className="btn-primary w-full py-3.5 text-base" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '🚀 Save & Start'}
          </button>
        ) : (
          <button
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
            onClick={handleNext}
            disabled={!canNext()}
            style={{ opacity: canNext() ? 1 : 0.5 }}
          >
            Continue <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
