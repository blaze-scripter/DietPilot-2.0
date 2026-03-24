import { useState, useEffect } from 'react';
import { remindersApi } from '@/services/api';
import { Bell, Plus, X, Clock, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const REMINDER_TYPES = [
  { value: 'meal', label: 'Meal', emoji: '🍽️' },
  { value: 'water', label: 'Water', emoji: '💧' },
  { value: 'medication', label: 'Medication', emoji: '💊' },
];

export default function Reminders() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: 'meal', label: '', time: '08:00', repeat: 'daily' });
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await remindersApi.list();
      setReminders(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.label.trim()) return;
    try {
      await remindersApi.create({ ...form, enabled: true });
      await loadReminders();
      setShowModal(false);
      setForm({ type: 'meal', label: '', time: '08:00', repeat: 'daily' });
      showToast('Reminder created! 🔔');
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } catch { showToast('Failed to create reminder'); }
  };

  const handleToggle = async (reminder: any) => {
    try {
      await remindersApi.update(reminder.id, { ...reminder, enabled: !reminder.enabled });
      await loadReminders();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    try {
      await remindersApi.delete(id);
      await loadReminders();
      showToast('Reminder deleted');
    } catch { showToast('Failed to delete'); }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const getTypeEmoji = (type: string) => REMINDER_TYPES.find((t) => t.value === type)?.emoji || '🔔';

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6 animate-fadeIn">
        <h1 className="text-2xl font-extrabold tracking-tight">Reminders 🔔</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary py-2 px-3 text-xs flex items-center gap-1">
          <Plus size={14} /> Add
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>Loading...</p>
      ) : reminders.length === 0 ? (
        <div className="text-center py-16 animate-fadeIn">
          <div className="text-5xl mb-4">🔕</div>
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>No reminders yet</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Tap + to add meal, water, or medication reminders</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((r) => (
            <div key={r.id} className={`glass-card p-4 animate-fadeIn ${!r.enabled ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeEmoji(r.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{r.label}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock size={12} style={{ color: 'var(--muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{r.time}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 font-medium">{r.repeat}</span>
                  </div>
                </div>
                <button onClick={() => handleToggle(r)} className="mr-1">
                  {r.enabled ? (
                    <ToggleRight size={28} style={{ color: 'var(--primary)' }} />
                  ) : (
                    <ToggleLeft size={28} style={{ color: 'var(--muted-light)' }} />
                  )}
                </button>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold">New Reminder</h3>
              <button onClick={() => setShowModal(false)} className="btn-icon w-8 h-8"><X size={18} /></button>
            </div>

            {/* Type */}
            <label className="block text-xs font-semibold mb-2">Type</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {REMINDER_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm((p) => ({ ...p, type: t.value }))}
                  className="py-3 rounded-xl text-xs font-semibold border transition-all"
                  style={{
                    background: form.type === t.value ? 'var(--primary-soft)' : 'white',
                    borderColor: form.type === t.value ? 'var(--primary)' : '#e5e7eb',
                  }}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>

            {/* Label */}
            <label className="block text-xs font-semibold mb-2">Label</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              placeholder="e.g. Drink Water"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mb-4 focus:outline-none focus:border-lime-400"
            />

            {/* Time */}
            <label className="block text-xs font-semibold mb-2">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mb-4 focus:outline-none focus:border-lime-400"
            />

            {/* Repeat */}
            <label className="block text-xs font-semibold mb-2">Repeat</label>
            <div className="flex gap-2 mb-6">
              {['daily', 'weekdays', 'weekends'].map((r) => (
                <button
                  key={r}
                  onClick={() => setForm((p) => ({ ...p, repeat: r }))}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize"
                  style={{
                    background: form.repeat === r ? '#1f2937' : 'white',
                    color: form.repeat === r ? 'white' : 'var(--foreground)',
                    borderColor: form.repeat === r ? '#1f2937' : '#e5e7eb',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <button onClick={handleCreate} className="btn-primary w-full py-3" disabled={!form.label.trim()}>
              Create Reminder
            </button>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
