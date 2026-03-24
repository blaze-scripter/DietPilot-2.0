import { useState, useRef } from 'react';
import { useApp } from '@/main';
import { profileApi, targetsApi } from '@/services/api';

const STEPS = ['Welcome', 'Basics', 'Body', 'Activity', 'Goal', 'Diet', 'Health', 'Summary'];

const STEP_COLORS = [
  '#f0fdf4', '#fef3c7', '#e0f2fe', '#fce7f3',
  '#ecfccb', '#f5f3ff', '#ccfbf1', '#fef9c3',
];

const STEP_ICONS = ['🥗', '👤', '📏', '🏃', '🎯', '🍽️', '💊', '✨'];

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', icon: 'weekend' },
  { value: 'light', label: 'Light', desc: '1-3 days / week', icon: 'directions_walk' },
  { value: 'moderate', label: 'Moderate', desc: '3-5 days / week', icon: 'directions_run' },
  { value: 'active', label: 'Active', desc: '6-7 days / week', icon: 'fitness_center' },
  { value: 'very_active', label: 'Very Active', desc: 'Athlete / 2× daily', icon: 'sports_martial_arts' },
];

const GOAL_OPTIONS = [
  { value: 'lose_fat', label: 'Lose Fat', desc: 'Caloric deficit focused on lean body mass.', icon: 'trending_down' },
  { value: 'maintain', label: 'Maintain', desc: 'Equilibrium nutrition for long-term health.', icon: 'balance' },
  { value: 'bulk', label: 'Bulk Up', desc: 'Caloric surplus for muscle hypertrophy.', icon: 'fitness_center' },
];

const DIET_OPTIONS = [
  { value: 'any', label: 'Any', icon: 'restaurant' },
  { value: 'vegetarian', label: 'Vegetarian', icon: 'eco' },
  { value: 'vegan', label: 'Vegan', icon: 'spa' },
  { value: 'keto', label: 'Keto', icon: 'local_fire_department' },
  { value: 'halal', label: 'Halal', icon: 'verified' },
];

const HEALTH_OPTIONS = [
  { value: 'diabetes', label: 'Diabetes', icon: 'monitor_heart' },
  { value: 'hypertension', label: 'Hypertension', icon: 'favorite' },
  { value: 'PCOS', label: 'PCOS', icon: 'female' },
  { value: 'high_cholesterol', label: 'High Cholesterol', icon: 'bloodtype' },
  { value: 'thyroid', label: 'Thyroid', icon: 'science' },
  { value: 'none', label: 'None', icon: 'check_circle' },
];

/* Circular Progress Ring Component */
function ProgressRing({ step, total }: { step: number; total: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const progress = step / (total - 1);
  const offset = circumference * (1 - progress);

  return (
    <svg width="64" height="64" className="absolute -inset-[6px]" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3" />
      <circle
        cx="32" cy="32" r={radius} fill="none"
        stroke="#a3e635" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="progress-ring"
      />
    </svg>
  );
}

export default function Onboarding() {
  const { setProfile, navigate, refreshLog } = useApp();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [animKey, setAnimKey] = useState(0);
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
  const contentRef = useRef<HTMLDivElement>(null);

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

  const goTo = (newStep: number) => {
    setDirection(newStep > step ? 'right' : 'left');
    setAnimKey((k) => k + 1);
    setStep(newStep);
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
    goTo(Math.min(step + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    goTo(Math.max(step - 1, 0));
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


  const animClass = direction === 'right' ? 'animate-slideInRight' : 'animate-slideInLeft';

  // ===== STEP RENDERERS =====

  const renderWelcome = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10" key={animKey}>
      {/* Logo */}
      <div className="absolute top-0 left-0 w-full flex justify-start">
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em' }}>
          DietPilot
        </span>
      </div>

      {/* Hero Illustration */}
      <div className="animate-float mb-8 mt-16">
        <div style={{
          width: 200, height: 200, borderRadius: '50%',
          background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 30px 60px rgba(163, 230, 53, 0.3)',
        }}>
          <span style={{ fontSize: '5rem' }}>🥗</span>
        </div>
      </div>

      {/* Editorial Headline */}
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: '2.5rem', lineHeight: 0.95, letterSpacing: '-0.04em',
        marginBottom: '1rem',
      }} className="animate-slideUp">
        Your Personal<br />
        <span style={{ color: 'var(--primary)' }}>Diet Pilot.</span>
      </h1>

      <p style={{
        color: 'var(--muted)', fontSize: '1rem', maxWidth: '320px',
        lineHeight: 1.6, marginBottom: '2rem',
      }} className="animate-slideUp" >
        High-performance nutrition tracking tailored for the modern Indian lifestyle.
      </p>

      <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '18px 40px' }}
        onClick={() => goTo(1)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          Get Started
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 700" }}>arrow_forward</span>
        </span>
      </button>

      {/* Footer */}
      <p style={{ position: 'absolute', bottom: 0, fontSize: '0.6rem', color: 'var(--muted-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        © 2026 DietPilot · Designed for Vitality
      </p>
    </div>
  );

  const renderBasics = () => (

    <div className={`space-y-6 ${animClass}`} key={animKey}>
      <div className="glass-card-stitch p-6" style={{ borderRadius: '20px' }}>
        {/* Name Field */}
        <div className="space-y-2 mb-6">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginLeft: 4 }}>
            Full Name
          </label>
          <input
            type="text" value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="How should we call you?"
            style={{
              width: '100%', padding: '16px', fontSize: '1rem',
              border: 'none', borderRadius: 12, background: 'white',
              outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>

        {/* Age */}
        <div className="space-y-2 mb-6">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginLeft: 4 }}>
            Age — <span style={{ color: 'var(--primary)' }}>{form.age}</span>
          </label>
          <input type="range" min={15} max={80} value={form.age}
            onChange={(e) => update('age', parseInt(e.target.value))} />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginLeft: 4 }}>
            Gender
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['male', 'female', 'other'] as const).map((g) => (
              <button key={g}
                onClick={() => update('gender', g)}
                style={{
                  flex: 1, padding: '14px 8px', borderRadius: 12,
                  border: form.gender === g ? '2px solid var(--primary-container)' : '1px solid var(--outline-variant)',
                  background: form.gender === g ? 'var(--primary-container)' : 'var(--surface-container-high)',
                  color: form.gender === g ? 'var(--on-primary-container)' : 'var(--muted)',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  transition: 'all 0.2s ease',
                }}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Tip */}
        <div style={{
          marginTop: 24, padding: 16, borderRadius: 12,
          background: 'rgba(105, 246, 184, 0.15)', display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#006947', fontSize: 20 }}>info</span>
          <p style={{ fontSize: '0.75rem', color: '#005c3d', lineHeight: 1.5 }}>
            Your data is encrypted and used only to calculate your Metabolic Rate.
          </p>

        </div>
      </div>
    </div>
  );

  const renderBody = () => (

    <div className={`space-y-8 ${animClass}`} key={animKey}>
      <div className="glass-card-stitch p-6" style={{ borderRadius: '20px' }}>
        <div className="space-y-2 mb-8">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginLeft: 4 }}>
            Height — <span style={{ color: 'var(--primary)' }}>{form.height_cm} cm</span>
          </label>
          <input type="range" min={120} max={220} value={form.height_cm}
            onChange={(e) => update('height_cm', parseInt(e.target.value))} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted-light)' }}>
            <span>120 cm</span><span>220 cm</span>
          </div>
        </div>

        <div className="space-y-2">
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginLeft: 4 }}>
            Weight — <span style={{ color: 'var(--primary)' }}>{form.weight_kg} kg</span>
          </label>
          <input type="range" min={30} max={200} value={form.weight_kg}
            onChange={(e) => update('weight_kg', parseInt(e.target.value))} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted-light)' }}>
            <span>30 kg</span><span>200 kg</span>
          </div>
        </div>

      </div>
    </div>
  );

  const renderActivity = () => (
    <div className={`stagger-children space-y-3 ${animClass}`} key={animKey}>
      {ACTIVITY_OPTIONS.map((opt) => (
        <button key={opt.value}
          onClick={() => update('activity_level', opt.value)}
          className={opt.value === form.activity_level ? 'option-selected-glow' : ''}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 16,
            padding: '18px 20px', borderRadius: 16, border: '1px solid',
            borderColor: form.activity_level === opt.value ? 'var(--primary-container)' : 'var(--outline-variant)',
            background: form.activity_level === opt.value ? 'rgba(163, 230, 53, 0.15)' : 'white',
            cursor: 'pointer', transition: 'all 0.25s ease', textAlign: 'left',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: form.activity_level === opt.value ? 'var(--primary-container)' : 'rgba(163, 230, 53, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}>
            <span className="material-symbols-outlined" style={{
              color: 'var(--on-primary-container)',
              fontVariationSettings: form.activity_level === opt.value ? "'FILL' 1" : "'FILL' 0"
            }}>{opt.icon}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>{opt.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{opt.desc}</div>
          </div>
          {form.activity_level === opt.value && (
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          )}
        </button>
      ))}
    </div>
  );

  const renderGoal = () => (
    <div className={`stagger-children space-y-4 ${animClass}`} key={animKey}>
      {GOAL_OPTIONS.map((opt) => (
        <button key={opt.value}
          onClick={() => update('goal', opt.value)}
          className={opt.value === form.goal ? 'option-selected-glow' : ''}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 16,
            padding: '20px', borderRadius: 16,
            border: form.goal === opt.value ? '2px solid var(--primary-container)' : '1px solid transparent',
            background: form.goal === opt.value ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(16px)',
            cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'left',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {form.goal === opt.value && (
            <div style={{ position: 'absolute', top: 0, right: 0, padding: 10 }}>
              <div style={{ background: 'var(--primary-container)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1", color: 'var(--on-primary-container)' }}>check</span>
              </div>
            </div>
          )}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: form.goal === opt.value ? 'var(--primary-container)' : 'rgba(163, 230, 53, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 28, color: 'var(--on-primary-container)',
              fontVariationSettings: form.goal === opt.value ? "'FILL' 1" : "'FILL' 0"
            }}>{opt.icon}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>{opt.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>{opt.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderDiet = () => (
    <div className={`${animClass}`} key={animKey}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {DIET_OPTIONS.map((opt) => (
        <button key={opt.value}
          onClick={() => update('diet_preference', opt.value)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            padding: '24px 12px', borderRadius: 20,
            border: form.diet_preference === opt.value ? '2px solid var(--primary-container)' : '1px solid var(--outline-variant)',
            background: form.diet_preference === opt.value ? 'var(--primary-soft)' : 'white',
            cursor: 'pointer', transition: 'all 0.25s ease',
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: form.diet_preference === opt.value ? 'var(--primary-container)' : 'var(--surface-container-low)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}>
            <span className="material-symbols-outlined" style={{
              color: 'var(--on-primary-container)',
              fontVariationSettings: form.diet_preference === opt.value ? "'FILL' 1" : "'FILL' 0"
            }}>{opt.icon}</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>{opt.label}</span>
        </button>
      ))}
    </div>
  );

  const renderHealth = () => (
    <div className={`${animClass}`} key={animKey}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {HEALTH_OPTIONS.map((opt) => {
        const selected = opt.value === 'none'
          ? form.health_conditions.length === 0
          : form.health_conditions.includes(opt.value);
        return (
          <button key={opt.value}
            onClick={() => toggleCondition(opt.value)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '20px 12px', borderRadius: 20,
              border: selected ? '2px solid var(--primary-container)' : '1px solid var(--outline-variant)',
              background: selected ? 'var(--primary-soft)' : 'white',
              cursor: 'pointer', transition: 'all 0.25s ease',
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: selected ? 'var(--primary-container)' : 'var(--surface-container-low)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}>
              <span className="material-symbols-outlined" style={{
                color: opt.value === 'none' ? '#10b981' : 'var(--on-primary-container)',
                fontVariationSettings: selected ? "'FILL' 1" : "'FILL' 0"
              }}>{opt.icon}</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );

  const renderSummary = () => (
    <div className={`space-y-4 ${animClass}`} key={animKey}>
      {/* Calculated Targets */}
      <div className="glass-card-stitch p-5" style={{ borderRadius: 20 }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1", color: 'var(--primary)' }}>monitoring</span>
          Calculated Targets
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { label: 'BMR', value: targets?.bmr || 0, unit: 'kcal' },
            { label: 'TDEE', value: targets?.tdee || 0, unit: 'kcal' },
            { label: 'Calories', value: targets?.calories || 0, unit: 'kcal' },
            { label: 'Protein', value: targets?.protein || 0, unit: 'g' },
            { label: 'Carbs', value: targets?.carbs || 0, unit: 'g' },
            { label: 'Fat', value: targets?.fat || 0, unit: 'g' },
          ].map((item) => (
            <div key={item.label} style={{ background: 'var(--surface-container-low)', borderRadius: 14, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                {item.value}<span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--muted)', marginLeft: 2 }}>{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Profile Summary */}
      <div className="glass-card-stitch p-5" style={{ borderRadius: 20 }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1", color: 'var(--primary)' }}>person</span>
          Profile Summary
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['Name', form.name],
            ['Age', form.age],
            ['Gender', form.gender],
            ['Height', `${form.height_cm} cm`],
            ['Weight', `${form.weight_kg} kg`],
            ['Activity', form.activity_level.replace('_', ' ')],
            ['Goal', form.goal.replace('_', ' ')],
            ['Diet', form.diet_preference],
          ].map(([label, value]) => (
            <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--muted)' }}>{label}</span>
              <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  const stepRenderers = [renderWelcome, renderBasics, renderBody, renderActivity, renderGoal, renderDiet, renderHealth, renderSummary];

  const stepTitles = [
    '',
    'Tell us about yourself.',
    'Your body measurements',
    'How active are you?',
    'What is your primary goal?',
    'Diet preference',
    'Any health conditions?',
    "You're all set! 🎉",
  ];

  const stepSubtitles = [
    '',
    'This helps us calibrate your daily energy needs.',
    'We need these to calculate your metabolic rate.',
    'This determines your daily calorie multiplier.',
    "We'll tailor your macro targets based on this.",
    'Choose your dietary style.',
    'We adapt recommendations for your conditions.',
    'Review your profile and start your journey.',
  ];

  // Welcome is fullscreen
  if (step === 0) {
    return (
      <div className="onboarding-step" style={{ background: STEP_COLORS[0] }}>
        {renderWelcome()}
      </div>
    );
  }

  return (

    <div className="onboarding-step" style={{ background: STEP_COLORS[step], paddingBottom: 140 }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10, marginBottom: 8 }}>
        <button onClick={handleBack} style={{
          width: 44, height: 44, borderRadius: 14, border: 'none',
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--foreground)' }}>chevron_left</span>

        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>
            Step {step} of {STEPS.length - 1}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{STEPS[step]}</div>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
          DietPilot
        </div>
      </div>


      {/* Progress Bar */}
      <div style={{ height: 5, background: 'rgba(0,0,0,0.06)', borderRadius: 999, marginBottom: 28, overflow: 'hidden', position: 'relative', zIndex: 10 }}>
        <div style={{
          height: '100%', borderRadius: 999,
          width: `${(step / (STEPS.length - 1)) * 100}%`,
          background: 'linear-gradient(90deg, var(--primary), var(--primary-container))',
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      {/* Step Illustration */}
      <div style={{ textAlign: 'center', marginBottom: 16, position: 'relative', zIndex: 10 }}>
        <div className="animate-float" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
          fontSize: '2.5rem', boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
        }}>
          {STEP_ICONS[step]}
        </div>
      </div>

      {/* Headline */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: '1.75rem', lineHeight: 1.15, letterSpacing: '-0.03em',
          marginBottom: 8,
        }}>
          {stepTitles[step]}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {stepSubtitles[step]}
        </p>
      </div>

      {/* Step Content */}
      <div ref={contentRef} style={{ flex: 1, position: 'relative', zIndex: 10, overflowY: 'auto' }}>
        {stepRenderers[step]()}
      </div>

      {/* Bottom Action */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, padding: '20px 24px 32px',
        background: 'linear-gradient(transparent, rgba(255,255,255,0.9) 30%)',
        backdropFilter: 'blur(8px)',
        zIndex: 20,
      }}>

        {step === STEPS.length - 1 ? (
          <button className="btn-primary" onClick={handleSave} disabled={saving}
            style={{ width: '100%', padding: '18px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            {saving ? 'Saving...' : 'Save & Start'}
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              You can change this anytime
            </p>
            <button onClick={handleNext} disabled={!canNext()}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: canNext() ? 'var(--primary-container)' : 'var(--surface-container-high)',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: canNext() ? 'pointer' : 'not-allowed',
                transition: 'all 0.25s ease', position: 'relative',
                boxShadow: canNext() ? '0 8px 24px rgba(163, 230, 53, 0.35)' : 'none',
              }}>
              <ProgressRing step={step} total={STEPS.length} />
              <span className="material-symbols-outlined" style={{
                color: 'var(--on-primary-container)', fontVariationSettings: "'wght' 700",
              }}>arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
