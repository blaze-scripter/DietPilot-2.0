import { useState, useEffect } from 'react';
import { useApp } from '@/main';
import { remindersApi } from '@/services/api';

export default function Reminders() {
  const { profile } = useApp();
  const [reminders, setReminders] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newReminder, setNewReminder] = useState({ type: 'water', label: '', time: '09:00' });

  useEffect(() => { loadReminders(); }, []);

  async function loadReminders() {
    try { setReminders(await remindersApi.list()); } catch { /* ignore */ }
  }

  const handleAdd = async () => {
    if (!newReminder.label.trim()) return;
    try {
      await remindersApi.create({ ...newReminder, profile_id: profile?.id ?? 1, enabled: true });
      setShowAdd(false);
      setNewReminder({ type: 'water', label: '', time: '09:00' });
      loadReminders();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    try { await remindersApi.delete(id); loadReminders(); } catch { /* ignore */ }
  };

  const toggleReminder = async (rem: any) => {
    try { await remindersApi.update(rem.id, { ...rem, enabled: !rem.enabled }); loadReminders(); } catch { /* ignore */ }
  };

  const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
    water: { icon: 'water_drop', color: '#2563eb', bg: '#dbeafe' },
    meal: { icon: 'restaurant', color: '#16a34a', bg: '#dcfce7' },
    medication: { icon: 'medication', color: '#9333ea', bg: '#f3e8ff' },
  };

  return (
    <div className="page-container relative" style={{ paddingTop: 0 }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center justify-between animate-slideUp">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-headline text-on-surface leading-none">Reminders</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-1">{reminders.length} active schedules</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            width: 48, height: 48, borderRadius: '999px', border: 'none',
            background: '#a3e635', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(163,230,53,0.4)', cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#416400', fontVariationSettings: "'wght' 700" }}>add</span>
        </button>
      </div>

      {/* Empty State */}
      {reminders.length === 0 && !showAdd && (
        <div className="flex flex-col items-center justify-center py-20 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f3f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#c2cab0', fontVariationSettings: "'FILL' 1" }}>notifications_off</span>
          </div>
          <p className="text-base font-bold text-on-surface-variant">No reminders yet</p>
          <p className="text-sm text-on-surface-variant/70 mt-1">Tap + to add your first reminder</p>
        </div>
      )}

      {/* Reminder Cards */}
      <div className="px-4 space-y-3 animate-slideUp stagger-children" style={{ animationDelay: '0.08s' }}>
        {reminders.map((rem) => {
          const cfg = typeConfig[rem.type] || typeConfig.water;
          return (
            <div
              key={rem.id}
              style={{
                background: rem.enabled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(12px)', borderRadius: '1.25rem', padding: '16px',
                display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: rem.enabled ? '0 4px 16px rgba(45,47,47,0.07)' : 'none',
                border: '1px solid rgba(194,202,176,0.15)',
                opacity: rem.enabled ? 1 : 0.55,
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '0.875rem', background: rem.enabled ? cfg.bg : '#f3f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: rem.enabled ? cfg.color : '#c2cab0', fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c', textDecoration: !rem.enabled ? 'line-through' : 'none' }}>
                  {rem.label || rem.type}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#5a5c5c', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                  {rem.time} · Daily
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Toggle */}
                <button
                  onClick={() => toggleReminder(rem)}
                  style={{
                    width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer',
                    background: rem.enabled ? '#a3e635' : '#eeeeee', position: 'relative',
                    transition: 'background 0.3s ease',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3, width: 20, height: 20,
                    borderRadius: '50%', background: 'white',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    left: rem.enabled ? 21 : 3, transition: 'left 0.3s ease',
                  }} />
                </button>
                <button onClick={() => handleDelete(rem.id)} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ef4444' }}>delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Reminder Drawer */}
      {showAdd && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              width: '100%', maxWidth: 480, margin: '0 auto',
              background: 'white', borderRadius: '2rem 2rem 0 0',
              padding: '20px 24px 40px',
            }}
            onClick={(e) => e.stopPropagation()}
            className="animate-slideUp"
          >
            <div style={{ width: 40, height: 4, background: '#eeeeee', borderRadius: 999, margin: '0 auto 20px' }} />
            <h2 className="text-xl font-extrabold font-headline text-on-surface mb-6">New Reminder</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Label</label>
                <input
                  type="text" value={newReminder.label}
                  onChange={(e) => setNewReminder({ ...newReminder, label: e.target.value })}
                  placeholder="e.g. Morning Hydration"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '1rem', border: 'none', background: '#f3f3f4', fontSize: '0.95rem', fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c', outline: 'none' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Type</label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                    style={{ width: '100%', padding: '14px', borderRadius: '1rem', border: 'none', background: '#f3f3f4', fontSize: '0.9rem', fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c', outline: 'none' }}
                  >
                    <option value="water">Water 💧</option>
                    <option value="meal">Meal 🍽️</option>
                    <option value="medication">Medication 💊</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Time</label>
                  <input
                    type="time" value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    style={{ width: '100%', padding: '14px', borderRadius: '1rem', border: 'none', background: '#f3f3f4', fontSize: '0.9rem', fontFamily: 'Plus Jakarta Sans', color: '#1a1c1c', outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="btn-primary w-full mt-6"
              style={{ padding: '18px', fontSize: '1rem', borderRadius: '999px' }}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
              Create Reminder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
