import { useApp } from '@/main';
import { User, Target, Settings, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { profile, navigate } = useApp();

  const menuItems = [
    { label: 'Calculated Targets', icon: Target, desc: 'BMR, TDEE & Macros', path: '/onboarding' },
    { label: 'Health Profile', icon: ShieldCheck, desc: 'Conditions & Preferences', path: '/health-conditions' },
    { label: 'Account Settings', icon: Settings, desc: 'Personal Information', path: '#' },
  ];

  return (
    <div className="page-container">
      <h1 className="text-2xl font-extrabold tracking-tight mb-8">My Profile 👤</h1>

      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-full bg-lime-400 flex items-center justify-center text-white text-3xl font-black mb-4 border-4 border-white shadow-xl">
          {profile?.name?.charAt(0) || 'U'}
        </div>
        <h2 className="text-xl font-extrabold">{profile?.name || 'User'}</h2>
        <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">{profile?.diet_preference} • {profile?.goal?.replace('_', ' ')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="glass-card-flat p-4 text-center">
          <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Weight</div>
          <div className="text-lg font-black">{profile?.weight_kg} <span className="text-xs font-bold text-gray-300">kg</span></div>
        </div>
        <div className="glass-card-flat p-4 text-center">
          <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Height</div>
          <div className="text-lg font-black">{profile?.height_cm} <span className="text-xs font-bold text-gray-300">cm</span></div>
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, i) => (
          <button 
            key={i} 
            onClick={() => item.path !== '#' && navigate(item.path)}
            className="w-full glass-card p-4 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-lime-50 group-hover:text-lime-600 transition-colors">
                <item.icon size={20} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">{item.label}</div>
                <div className="text-[10px] font-bold text-gray-400">{item.desc}</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        ))}
      </div>

      <button className="w-full mt-10 p-4 flex items-center justify-center gap-2 text-sm font-bold text-red-400 hover:bg-red-50 rounded-2xl transition-colors">
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );
}
