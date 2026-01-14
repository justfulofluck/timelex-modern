
import React from 'react';
import { LayoutGrid, Folder, Users, BarChart3, Clock, MoreHorizontal, LogOut, FileText, PieChart } from 'lucide-react';
import { View, Task, UserRole } from '../types';
import { formatDuration } from './Formatters';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  tasks: Task[];
  onLogout: () => void;
  role: UserRole;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, tasks, onLogout, role, userName }) => {
  const adminNav = [
    { id: 'tasks', label: 'Tasks', icon: LayoutGrid },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const clientNav = [
    { id: 'reports', label: 'Overview', icon: PieChart },
    { id: 'tasks', label: 'Activity', icon: LayoutGrid },
    { id: 'clients', label: 'My Plan', icon: FileText },
  ];

  const navItems = role === 'admin' ? adminNav : clientNav;

  return (
    <div className="w-64 h-full flex flex-col border-r border-gray-100 bg-[#f3f4f6]">
      <div className="p-8 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight text-[#1e293b] flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center transform rotate-0">
             <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          Timelex
        </h1>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 mt-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${
              currentView === item.id 
              ? 'bg-[#e5e7eb] text-[#1e293b] shadow-none' 
              : 'text-gray-500 hover:bg-[#ebedf0] hover:text-gray-700'
            }`}
          >
            <item.icon size={20} className={currentView === item.id ? 'text-[#3b82f6]' : 'text-gray-400 group-hover:text-gray-500'} />
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 space-y-4">
        <div className="px-2 mb-2">
            <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-3">User Profile</h3>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-gray-100 text-gray-400 shadow-sm">
                    <Users size={20} />
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-black text-[#1e293b] truncate">{userName}</p>
                    <p className="text-[10px] font-bold text-gray-400 capitalize">{role}</p>
                </div>
            </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-red-400 hover:bg-red-50 transition-all group mt-4"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-bold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
