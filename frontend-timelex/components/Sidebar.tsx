
import React from 'react';
import { LayoutGrid, Folder, Users, BarChart3, LogOut, Settings, Moon, Sun, FileText, PieChart } from 'lucide-react';
import { View, Task, UserRole } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  tasks: Task[];
  onLogout: () => void;
  role: UserRole;
  userName: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, tasks, onLogout, role, userName, isDarkMode, toggleDarkMode }) => {
  const adminNav = [
    { id: 'tasks', label: 'Case Logs', icon: LayoutGrid },
    { id: 'projects', label: 'Timeline Units', icon: Folder },
    { id: 'clients', label: 'Variant Orgs', icon: Users },
    { id: 'reports', label: 'Temporal Reports', icon: BarChart3 },
    { id: 'settings', label: 'Temporal Settings', icon: Settings },
  ];

  const clientNav = [
    { id: 'reports', label: 'Timeline Overview', icon: PieChart },
    { id: 'tasks', label: 'Active Logs', icon: LayoutGrid },
    { id: 'clients', label: 'My Plan', icon: FileText },
  ];

  const navItems = role === 'admin' ? adminNav : clientNav;

  return (
    <div className="w-64 h-full flex flex-col border-r border-tva-brown/10 dark:border-tva-orange/10 bg-tva-beige dark:bg-tva-black/90 shadow-2xl transition-colors duration-300 font-montserrat">
      <div className="p-8 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tighter text-tva-brown dark:text-tva-orange flex items-center gap-3 uppercase">
          <img
            src={`http://${window.location.hostname}:8000/media/timex-logo.png`}
            alt="Timelex Logo"
            className="w-10 h-10 object-contain drop-shadow-lg contrast-125"
          />
          Timelex
        </h1>
      </div>

      <nav className="flex-1 px-4 mt-2 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${currentView === item.id
                ? 'bg-tva-brown dark:bg-tva-orange text-tva-beige dark:text-tva-white shadow-xl'
                : 'text-tva-brown/60 dark:text-tva-orange/60 hover:bg-tva-brown/10 dark:hover:bg-tva-orange/10 hover:text-tva-brown dark:hover:text-tva-orange'
              }`}
          >
            <item.icon size={20} className={currentView === item.id ? 'text-tva-gold' : 'text-tva-brown/40 dark:text-tva-orange/40'} />
            <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="px-2 mb-2">
          <h3 className="text-[10px] font-black text-tva-brown/30 dark:text-tva-orange/30 uppercase tracking-[0.2em] mb-4">TVA AGENT</h3>

          <div className="space-y-3">
            <div className="w-full flex items-center justify-between p-3.5 bg-white/40 dark:bg-tva-black/60 rounded-2xl border border-tva-brown/10 dark:border-tva-orange/10 shadow-sm transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-tva-brown/10 dark:bg-tva-orange/10 rounded-xl flex items-center justify-center text-tva-brown dark:text-tva-orange shrink-0">
                  <Users size={18} />
                </div>
                <div className="overflow-hidden text-left">
                  <p className="text-xs font-black text-tva-brown dark:text-tva-white truncate leading-none mb-1 uppercase tracking-tighter">{userName}</p>
                  <p className="text-[10px] font-bold text-tva-orange/60 capitalize leading-none tracking-widest">{role}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleDarkMode}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl text-tva-brown/60 dark:text-tva-orange/60 hover:text-tva-orange transition-all font-bold text-[10px] uppercase tracking-tighter"
              >
                {isDarkMode ? <Sun size={14} className="text-tva-gold" /> : <Moon size={14} />}
                {isDarkMode ? 'LIGHT' : 'DARK'}
              </button>

              <button
                onClick={onLogout}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl text-tva-red hover:bg-tva-red/10 transition-all font-bold text-[10px] uppercase tracking-tighter group"
              >
                <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                PRUNE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
