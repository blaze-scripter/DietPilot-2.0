import { useState, useRef } from 'react';
import { useApp } from '@/main';
import { profileApi, targetsApi } from '@/services/api';

const STEPS = ['Welcome', 'Basics', 'Body', 'Activity', 'Goal', 'Diet', 'Health', 'Summary'];
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
    if (c === 'none') { setForm((p) => ({ ...p, health_conditions: [] })); return; }
    setForm((p) => ({
      ...p,
      health_conditions: p.health_conditions.includes(c)
        ? p.health_conditions.filter((x) => x !== c)
        : [...p.health_conditions, c],
    }));
  };

  const canNext = () => { if (step === 1) return form.name.trim().length > 0; return true; };

  const goTo = (newStep: number) => {
    setDirection(newStep > step ? 'right' : 'left');
    setAnimKey((k) => k + 1);
    setStep(newStep);
  };

  const handleNext = async () => {
    if (step === STEPS.length - 2) {
      try { const t = await targetsApi.calculate(form); setTargets(t); }
      catch { setTargets({ bmr: 0, tdee: 0, calories: 0, protein: 0, carbs: 0, fat: 0 }); }
    }
    goTo(Math.min(step + 1, STEPS.length - 1));
  };

  const handleBack = () => goTo(Math.max(step - 1, 0));

  const handleSave = async () => {
    setSaving(true);
    try {
      let p;
      try { p = await profileApi.create({ ...form, targets }); }
      catch { p = await profileApi.update({ ...form, targets }); }
      setProfile(p);
      await refreshLog();
      navigate('/dashboard');
    } catch (err) { console.error('Failed to save profile:', err); }
    setSaving(false);
  };

  const animClass = direction === 'right' ? 'animate-slideInRight' : 'animate-slideInLeft';

  const inputStyle = {
    width: '100%', padding: '14px 16px', fontSize: '1rem',
    border: 'none', borderRadius: '1rem',
    background: '#f3f3f4', outline: 'none',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    color: '#1a1c1c',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.7rem', fontWeight: 700,
    textTransform: 'uppercase' as const, letterSpacing: '0.1em',
    color: '#5a5c5c', marginBottom: '8px', marginLeft: '4px',
  };

  // ── Step renderers ──────────────────────────────────────────────────────────
  const renderWelcome = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 px-6" key={animKey}>
      <div className="absolute top-0 left-0 w-full flex justify-start px-6 pt-6">
        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', color: '#1a1c1c' }}>DietPilot</span>
      </div>
      <div className="animate-float mb-10 mt-20">
        <div style={{
          width: 200, height: 200, borderRadius: '50%',
          background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 30px 60px rgba(163, 230, 53, 0.35)',
        }}>
          <span style={{ fontSize: '5rem' }}>🥗</span>
        </div>
      </div>
      <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '2.75rem', lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '1rem', color: '#1a1c1c' }}>
        Your Personal<br /><span style={{ color: '#446900' }}>Diet Pilot.</span>
      </h1>
      <p style={{ color: '#5a5c5c', fontSize: '1rem', maxWidth: '300px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        High-performance nutrition tracking tailored for the modern lifestyle.
      </p>
      <button
        onClick={() => goTo(1)}
        className="w-full btn-primary flex items-center justify-center gap-3"
        style={{ padding: '18px', fontSize: '1.1rem', borderRadius: '999px' }}
      >
        Get Started <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 700" }}>arrow_forward</span>
      </button>
      <div className="flex gap-8 mt-8">
        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Privacy Policy</a>
        <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Terms</a>
      </div>
    </div>
  );

  const renderBasics = () => (
    <div className={`space-y-5 ${animClass}`} key={animKey}>
      <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', borderRadius: '1.25rem', padding: '1.5rem' }}>
        <div className="space-y-2 mb-5">
          <label style={labelStyle}>Full Name</label>
          <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
            placeholder="How should we call you?" style={inputStyle} />
        </div>
        <div className="space-y-2 mb-5">
          <label style={labelStyle}>Age — <span style={{ color: '#446900' }}>{form.age}</span></label>
          <input type="range" min={15} max={80} value={form.age} onChange={(e) => update('age', parseInt(e.target.value))} />
        </div>
        <div className="space-y-2">
          <label style={labelStyle}>Gender</label>
          <div className="flex gap-2">
            {(['male', 'female', 'other'] as const).map((g) => (
              <button key={g} onClick={() => update('gender', g)} style={{
                flex: 1, padding: '14px 8px', borderRadius: '1rem',
                border: form.gender === g ? '2px solid #a3e635' : '1px solid rgba(194,202,176,0.4)',
                background: form.gender === g ? '#a3e635' : '#f3f3f4',
                color: form.gender === g ? '#416400' : '#5a5c5c',
                fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans', transition: 'all 0.2s ease',
              }}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBody = () => (
    <div className={`space-y-5 ${animClass}`} key={animKey}>
      <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', borderRadius: '1.25rem', padding: '1.5rem' }}>
        <div className="space-y-2 mb-8">
          <label style={labelStyle}>Height — <span style={{ color: '#446900' }}>{form.height_cm} cm</span></label>
          <input type="range" min={120} max={220} value={form.height_cm} onChange={(e) => update('height_cm', parseInt(e.target.value))} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9ca3af' }}><span>120 cm</span><span>220 cm</span></div>
        </div>
        <div className="space-y-2">
          <label style={labelStyle}>Weight — <span style={{ color: '#446900' }}>{form.weight_kg} kg</span></label>
          <input type="range" min={30} max={200} value={form.weight_kg} onChange={(e) => update('weight_kg', parseInt(e.target.value))} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9ca3af' }}><span>30 kg</span><span>200 kg</span></div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className={`stagger-children space-y-3 ${animClass}`} key={animKey}>
      {ACTIVITY_OPTIONS.map((opt) => (
        <button key={opt.value} onClick={() => update('activity_level', opt.value)}
          className={opt.value === form.activity_level ? 'option-selected-glow' : ''}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 18px', borderRadius: '1rem', border: '1px solid',
            borderColor: form.activity_level === opt.value ? '#a3e635' : 'rgba(194,202,176,0.3)',
            background: form.activity_level === opt.value ? 'rgba(163, 230, 53, 0.12)' : 'rgba(255,255,255,0.8)',
            cursor: 'pointer', transition: 'all 0.25s ease', textAlign: 'left',
          }}>
          <div style={{
            width: 44, height: 44, borderRadius: '0.875rem',
            background: form.activity_level === opt.value ? '#a3e635' : 'rgba(163, 230, 53, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#416400', fontVariationSettings: form.activity_level === opt.value ? "'FILL' 1" : "'FILL' 0" }}>{opt.icon}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c' }}>{opt.label}</div>
            <div style={{ fontSize: '0.8rem', color: '#5a5c5c' }}>{opt.desc}</div>
          </div>
          {form.activity_level === opt.value && (
            <span className="material-symbols-outlined" style={{ color: '#446900', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          )}
        </button>
      ))}
    </div>
  );

  const renderGoal = () => (
    <div className={`stagger-children space-y-4 ${animClass}`} key={animKey}>
      {GOAL_OPTIONS.map((opt) => (
        <button key={opt.value} onClick={() => update('goal', opt.value)}
          className={opt.value === form.goal ? 'option-selected-glow' : ''}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 16,
            padding: '20px', borderRadius: '1rem',
            border: form.goal === opt.value ? '2px solid #a3e635' : '1px solid transparent',
            background: form.goal === opt.value ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(16px)', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'left', position: 'relative', overflow: 'hidden',
          }}>
          {form.goal === opt.value && (
            <div style={{ position: 'absolute', top: 0, right: 0, padding: 10 }}>
              <div style={{ background: '#a3e635', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1", color: '#416400' }}>check</span>
              </div>
            </div>
          )}
          <div style={{ width: 52, height: 52, borderRadius: '1rem', background: form.goal === opt.value ? '#a3e635' : 'rgba(163, 230, 53, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#416400', fontVariationSettings: form.goal === opt.value ? "'FILL' 1" : "'FILL' 0" }}>{opt.icon}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c' }}>{opt.label}</div>
            <div style={{ fontSize: '0.8rem', color: '#5a5c5c', marginTop: 2 }}>{opt.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderDiet = () => (
    <div className={`${animClass}`} key={animKey} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {DIET_OPTIONS.map((opt) => (
        <button key={opt.value} onClick={() => update('diet_preference', opt.value)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          padding: '22px 12px', borderRadius: '1.25rem',
          border: form.diet_preference === opt.value ? '2px solid #a3e635' : '1px solid rgba(194,202,176,0.3)',
          background: form.diet_preference === opt.value ? '#ecfccb' : 'rgba(255,255,255,0.8)',
          cursor: 'pointer', transition: 'all 0.25s ease',
        }}>
          <div style={{ width: 48, height: 48, borderRadius: '0.875rem', background: form.diet_preference === opt.value ? '#a3e635' : '#f3f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: '#416400', fontVariationSettings: form.diet_preference === opt.value ? "'FILL' 1" : "'FILL' 0" }}>{opt.icon}</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c' }}>{opt.label}</span>
        </button>
      ))}
    </div>
  );

  const renderHealth = () => (
    <div className={`${animClass}`} key={animKey} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {HEALTH_OPTIONS.map((opt) => {
        const selected = opt.value === 'none' ? form.health_conditions.length === 0 : form.health_conditions.includes(opt.value);
        return (
          <button key={opt.value} onClick={() => toggleCondition(opt.value)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            padding: '18px 12px', borderRadius: '1.25rem',
            border: selected ? '2px solid #a3e635' : '1px solid rgba(194,202,176,0.3)',
            background: selected ? '#ecfccb' : 'rgba(255,255,255,0.8)',
            cursor: 'pointer', transition: 'all 0.25s ease',
          }}>
            <div style={{ width: 44, height: 44, borderRadius: '0.875rem', background: selected ? '#a3e635' : '#f3f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#416400', fontVariationSettings: selected ? "'FILL' 1" : "'FILL' 0" }}>{opt.icon}</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1a1c1c' }}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );

  const renderSummary = () => (
    <div className={`space-y-4 ${animClass}`} key={animKey}>
      <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderRadius: '1.25rem', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1", color: '#446900' }}>monitoring</span> Calculated Targets
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
            <div key={item.label} style={{ background: '#f3f3f4', borderRadius: '0.875rem', padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#5a5c5c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c' }}>
                {item.value}<span style={{ fontSize: '0.65rem', fontWeight: 500, color: '#5a5c5c', marginLeft: 2 }}>{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderRadius: '1.25rem', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1", color: '#446900' }}>person</span> Profile Summary
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[['Name', form.name], ['Age', form.age], ['Gender', form.gender], ['Height', `${form.height_cm} cm`], ['Weight', `${form.weight_kg} kg`], ['Activity', form.activity_level.replace('_', ' ')], ['Goal', form.goal.replace('_', ' ')], ['Diet', form.diet_preference]].map(([label, value]) => (
            <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#5a5c5c' }}>{label}</span>
              <span style={{ fontWeight: 700, textTransform: 'capitalize', color: '#1a1c1c' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const stepRenderers = [renderWelcome, renderBasics, renderBody, renderActivity, renderGoal, renderDiet, renderHealth, renderSummary];
  const stepTitles = ['', 'Tell us about yourself.', 'Your body measurements', 'How active are you?', 'What is your primary goal?', 'Diet preference', 'Any health conditions?', "You're all set! 🎉"];
  const stepSubtitles = ['', 'This helps us calibrate your daily energy needs.', 'We need these to calculate your metabolic rate.', 'This determines your daily calorie multiplier.', "We'll tailor your macro targets based on this.", 'Choose your dietary style.', 'We adapt recommendations for your conditions.', 'Review your profile and start your journey.'];

  if (step === 0) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#f0fdf4', padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(163,230,53,0.15) 0%, transparent 70%)' }} />
        {renderWelcome()}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#f9f9f9', padding: '24px', paddingBottom: 140, position: 'relative', overflow: 'hidden' }}>
      {/* Radial glow */}
      <div className="absolute top-[-15%] right-[-15%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(163,230,53,0.1) 0%, transparent 70%)' }} />

      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10, marginBottom: 4 }}>
        <button onClick={handleBack} style={{
          width: 44, height: 44, borderRadius: '0.875rem', border: 'none',
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#1a1c1c' }}>chevron_left</span>
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Plus Jakarta Sans', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5a5c5c' }}>
            Step {step} of {STEPS.length - 1}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans', color: '#446900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{STEPS[step]}</div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.04em', color: '#1a1c1c' }}>DietPilot</div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 999, marginBottom: 24, overflow: 'hidden', position: 'relative', zIndex: 10, marginTop: 8 }}>
        <div style={{
          height: '100%', borderRadius: 999, background: '#a3e635',
          width: `${(step / (STEPS.length - 1)) * 100}%`,
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      {/* Step Icon */}
      <div style={{ textAlign: 'center', marginBottom: 12, position: 'relative', zIndex: 10 }}>
        <div className="animate-float" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
          fontSize: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}>{STEP_ICONS[step]}</div>
      </div>

      {/* Headline */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.65rem', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 6, color: '#1a1c1c' }}>
          {stepTitles[step]}
        </h1>
        <p style={{ color: '#5a5c5c', fontSize: '0.875rem', lineHeight: 1.5 }}>{stepSubtitles[step]}</p>
      </div>

      {/* Step Content */}
      <div ref={contentRef} style={{ flex: 1, position: 'relative', zIndex: 10, overflowY: 'auto' }}>
        {stepRenderers[step]()}
      </div>

      {/* Bottom Action */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, padding: '16px 24px 32px',
        background: 'linear-gradient(transparent, rgba(249,249,249,0.95) 30%)',
        backdropFilter: 'blur(8px)', zIndex: 20,
      }}>
        {step === STEPS.length - 1 ? (
          <button className="btn-primary" onClick={handleSave} disabled={saving}
            style={{ width: '100%', padding: '18px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: '999px' }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            {saving ? 'Saving...' : 'Save & Start'}
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '0.7rem', color: '#5a5c5c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>You can change this anytime</p>
            <button onClick={handleNext} disabled={!canNext()} style={{
              width: 56, height: 56, borderRadius: '50%',
              background: canNext() ? '#a3e635' : '#eeeeee',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: canNext() ? 'pointer' : 'not-allowed', transition: 'all 0.25s ease',
              boxShadow: canNext() ? '0 8px 24px rgba(163, 230, 53, 0.4)' : 'none',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#416400', fontVariationSettings: "'wght' 700" }}>arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
