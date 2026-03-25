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
    <div className="page-shell" style={{ paddingTop: 24 }}>

      {/* ▸ Header ─────────────────────────────── */}
      <header className="anim-fade-up" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', lineHeight: 1.1 }}>Reminders</h1>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#72796a', marginTop: 4 }}>
            {reminders.filter(r => r.enabled).length} active schedules
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            width: 44, height: 44, borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #bef264, #4d7c0f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(77,124,15,0.25)', cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 20, fontVariationSettings: "'wght' 700" }}>add</span>
        </button>
      </header>

      {/* ▸ Empty State ────────────────────────── */}
      {reminders.length === 0 && !showAdd && (
        <div className="anim-fade-up anim-delay-1 card" style={{
          padding: '48px 24px', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: '#f0f0eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#c6c8b9', fontVariationSettings: "'FILL' 1" }}>notifications_off</span>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1b1c18', fontFamily: 'var(--font-display)' }}>No reminders yet</p>
          <p style={{ fontSize: '0.75rem', color: '#a1a79a', marginTop: 4 }}>Tap + to add your first reminder</p>
        </div>
      )}

      {/* ▸ Reminder Cards ─────────────────────── */}
      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reminders.map((rem) => {
          const cfg = typeConfig[rem.type] || typeConfig.water;
          return (
            <div key={rem.id} className="card" style={{
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: rem.enabled ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 14,
                background: rem.enabled ? cfg.bg : '#f0f0eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span className="material-symbols-outlined" style={{
                  color: rem.enabled ? cfg.color : '#c6c8b9',
                  fontVariationSettings: "'FILL' 1", fontSize: 20,
                }}>{cfg.icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 700, fontSize: '0.8125rem', fontFamily: 'var(--font-display)',
                  color: '#1b1c18', textDecoration: !rem.enabled ? 'line-through' : 'none',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{rem.label || rem.type}</div>
                <div style={{
                  fontSize: '0.6875rem', color: '#72796a',
                  display: 'flex', alignItems: 'center', gap: 4, marginTop: 3,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>schedule</span>
                  {rem.time} · Daily
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                {/* Toggle */}
                <button
                  onClick={() => toggleReminder(rem)}
                  style={{
                    width: 42, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
                    background: rem.enabled ? '#a3e635' : '#e9e9e4', position: 'relative',
                    transition: 'background 0.3s ease', flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 2, width: 20, height: 20,
                    borderRadius: '50%', background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    left: rem.enabled ? 20 : 2, transition: 'left 0.3s ease',
                  }} />
                </button>
                <button onClick={() => handleDelete(rem.id)} style={{
                  width: 28, height: 28, borderRadius: '50%', border: 'none',
                  background: '#fee2e2', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#ef4444' }}>close</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ▸ Add Reminder Drawer ────────────────── */}
      {showAdd && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              width: '100%', maxWidth: 430,
              background: '#fff', borderRadius: '28px 28px 0 0',
              padding: '20px 24px calc(24px + env(safe-area-inset-bottom, 16px))',
            }}
            onClick={(e) => e.stopPropagation()}
            className="animate-slideUp"
          >
            <div style={{ width: 40, height: 4, background: '#e9e9e4', borderRadius: 999, margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1b1c18', fontFamily: 'var(--font-display)', marginBottom: 20 }}>New Reminder</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Label */}
              <div>
                <label style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#72796a', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Label</label>
                <input
                  type="text" value={newReminder.label}
                  onChange={(e) => setNewReminder({ ...newReminder, label: e.target.value })}
                  placeholder="e.g. Morning Hydration"
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 14,
                    border: 'none', background: '#f0f0eb', fontSize: '0.875rem',
                    fontFamily: 'var(--font-display)', color: '#1b1c18', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Type + Time row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#72796a', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Type</label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                    style={{
                      width: '100%', padding: '14px 12px', borderRadius: 14,
                      border: 'none', background: '#f0f0eb', fontSize: '0.8125rem',
                      fontFamily: 'var(--font-display)', color: '#1b1c18', outline: 'none',
                      WebkitAppearance: 'none', appearance: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="water">💧 Water</option>
                    <option value="meal">🍽️ Meal</option>
                    <option value="medication">💊 Medication</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#72796a', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Time</label>
                  <input
                    type="time" value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    style={{
                      width: '100%', padding: '14px 12px', borderRadius: 14,
                      border: 'none', background: '#f0f0eb', fontSize: '0.8125rem',
                      fontFamily: 'var(--font-display)', color: '#1b1c18', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="btn-lime"
              style={{ width: '100%', padding: '16px', fontSize: '0.875rem', marginTop: 20 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
              Create Reminder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
