import { useState, useEffect } from 'react';
import { useApp } from '@/main';
import { remindersApi } from '@/services/api';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';

export default function Reminders() {
  const { profile } = useApp();
  const [reminders, setReminders] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newReminder, setNewReminder] = useState({ type: 'water', label: '', time: '09:00' });

  useEffect(() => {
    loadReminders();
  }, []);

  async function loadReminders() {
    try {
      const data = await remindersApi.list();
      setReminders(data);
    } catch { /* ignore */ }
  }

  const handleAdd = async () => {
    try {
      await remindersApi.create({ ...newReminder, profile_id: profile.id, enabled: true });
      setShowAdd(false);
      loadReminders();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    try {
      await remindersApi.delete(id);
      loadReminders();
    } catch { /* ignore */ }
  };

  const toggleReminder = async (rem: any) => {
    try {
      await remindersApi.update(rem.id, { ...rem, enabled: !rem.enabled });
      loadReminders();
    } catch { /* ignore */ }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Reminders 🔔</h1>
        <button onClick={() => setShowAdd(true)} className="btn-icon bg-lime-400 text-lime-950">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {reminders.map((rem) => (
          <div key={rem.id} className="glass-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${rem.enabled ? 'bg-lime-50 text-lime-600' : 'bg-gray-50 text-gray-400'}`}>
                <Bell size={20} />
              </div>
              <div>
                <div className={`text-sm font-bold ${!rem.enabled && 'text-gray-400 line-through'}`}>{rem.label || rem.type}</div>
                <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {rem.time} • Daily
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleReminder(rem)}
                className={`w-10 h-6 rounded-full relative transition-colors ${rem.enabled ? 'bg-lime-400' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rem.enabled ? 'right-1' : 'left-1'}`} />
              </button>
              <button onClick={() => handleDelete(rem.id)} className="text-red-400 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-extrabold mb-6">New Reminder</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Label</label>
                <input 
                  type="text" 
                  value={newReminder.label} 
                  onChange={e => setNewReminder({...newReminder, label: e.target.value})}
                  placeholder="e.g. Morning Hydration"
                  className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Type</label>
                  <select 
                    value={newReminder.type}
                    onChange={e => setNewReminder({...newReminder, type: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm"
                  >
                    <option value="water">Water 💧</option>
                    <option value="meal">Meal 🍽️</option>
                    <option value="medication">Meds 💊</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Time</label>
                  <input 
                    type="time" 
                    value={newReminder.time}
                    onChange={e => setNewReminder({...newReminder, time: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm"
                  />
                </div>
              </div>
            </div>
            <button onClick={handleAdd} className="btn-primary w-full py-3.5">Create Reminder</button>
          </div>
        </div>
      )}
    </div>
  );
}
