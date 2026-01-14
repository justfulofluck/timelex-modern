import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, MoreVertical, Briefcase, Calendar, Clock, AlertCircle, X, Trash2, Edit2 } from 'lucide-react';
import { Project, Client, Task } from '../types';
import { formatDuration } from './Formatters';
import { dataService } from '../services/dataService';

interface ProjectsViewProps {
  projects: Project[];
  clients: Client[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tasks: Task[];
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, clients, setProjects, tasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [newProject, setNewProject] = useState({
    id: '',
    name: '',
    clientId: clients[0]?.id || '',
    color: '#C46A2D',
    deadline: '',
    estimatedDuration: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const durationMs = parseFloat(newProject.estimatedDuration) * 3600000;

    try {
      if (isEditing) {
        const updated = await dataService.updateProject(newProject.id, {
          name: newProject.name,
          clientId: newProject.clientId,
          color: newProject.color,
          deadline: newProject.deadline || undefined,
          estimatedDuration: isNaN(durationMs) ? undefined : durationMs
        });
        setProjects(prev => prev.map(p => p.id === newProject.id ? updated : p));
      } else {
        const created = await dataService.createProject({
          name: newProject.name,
          clientId: newProject.clientId,
          color: newProject.color,
          deadline: newProject.deadline || undefined,
          estimatedDuration: isNaN(durationMs) ? undefined : durationMs
        });
        setProjects(prev => [...prev, created]);
      }
      closeModal();
    } catch (e) {
      console.error("Failed to save project", e);
      alert("Failed to save unit. Check connection.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setNewProject({ id: '', name: '', clientId: clients[0]?.id || '', color: '#C46A2D', deadline: '', estimatedDuration: '' });
  };

  const handleEditClick = (p: Project) => {
    setNewProject({
      id: p.id,
      name: p.name,
      clientId: p.clientId,
      color: p.color,
      deadline: p.deadline || '',
      estimatedDuration: p.estimatedDuration ? (p.estimatedDuration / 3600000).toString() : ''
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Delete this timeline unit? Data will be lost to the void.')) {
      try {
        await dataService.deleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
        setOpenMenuId(null);
      } catch (e) {
        console.error("Delete failed", e);
      }
    }
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto bg-tva-white dark:bg-tva-black/20 font-ibm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-tva-brown dark:text-tva-orange uppercase tracking-tight">Timeline Units</h2>
          <p className="text-tva-brown/60 dark:text-tva-orange/60 font-bold text-xs uppercase tracking-widest">Organize branches for tracking</p>
        </div>
        <button
          onClick={() => { setIsEditing(false); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-tva-brown text-tva-beige px-6 py-3 rounded-2xl hover:brightness-110 transition-all font-black text-sm uppercase tracking-widest shadow-xl"
        >
          <Plus size={20} /> New Unit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(p => {
          const client = clients.find(c => c.id === p.clientId);
          const projectTasks = tasks.filter(t => t.projectId === p.id);
          const completedTasks = projectTasks.filter(t => t.isCompleted);
          const progress = projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;

          const isOverdue = p.deadline && new Date(p.deadline) < new Date() && progress < 100;
          const loggedTime = projectTasks.reduce((acc, t) => acc + t.duration, 0);

          return (
            <div key={p.id} className="bg-white/60 dark:bg-tva-black/40 border border-tva-brown/10 dark:border-tva-orange/10 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
              {isOverdue && (
                <div className="absolute top-0 right-0 bg-tva-red text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-2xl flex items-center gap-1 z-10">
                  <AlertCircle size={12} /> CRITICAL DELAY
                </div>
              )}

              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-tva-white shadow-2xl transition-transform group-hover:rotate-12" style={{ backgroundColor: p.color }}>
                  <Briefcase size={26} />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                    className={`p-2 rounded-xl transition-colors ${openMenuId === p.id ? 'bg-tva-brown/10 text-tva-brown' : 'text-tva-brown/40 dark:text-tva-orange/40 hover:text-tva-orange'}`}
                  >
                    <MoreVertical size={22} />
                  </button>

                  {openMenuId === p.id && (
                    <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-tva-beige dark:bg-tva-black border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl shadow-2xl z-20 overflow-hidden">
                      <button onClick={() => handleEditClick(p)} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-tva-brown dark:text-tva-orange hover:bg-tva-orange/10 transition-colors">
                        <Edit2 size={16} /> Edit Unit
                      </button>
                      <button onClick={() => handleDeleteClick(p.id)} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-tva-red hover:bg-tva-red/10 transition-colors">
                        <Trash2 size={16} /> Prune Unit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-black text-tva-brown dark:text-tva-white mb-1 uppercase tracking-tight group-hover:text-tva-orange transition-colors">{p.name}</h3>
                <p className="text-[10px] font-black text-tva-orange uppercase tracking-[0.2em] opacity-80">{client?.name || 'ROOT TIMELINE'}</p>
              </div>

              <div className="space-y-6 mb-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                    <span className="text-tva-brown/40 dark:text-tva-orange/40">Temporal Progress</span>
                    <span className="text-tva-orange font-mono">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 w-full bg-tva-brown/10 dark:bg-tva-orange/10 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out shadow-lg"
                      style={{ backgroundColor: p.color, width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-tva-brown/5 dark:border-tva-orange/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-tva-brown/30 dark:text-tva-orange/30 uppercase tracking-widest">
                      <Clock size={12} /> Logged
                    </div>
                    <p className="text-xs font-black text-tva-brown dark:text-tva-white tabular-nums">
                      {formatDuration(loggedTime)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-tva-brown/30 dark:text-tva-orange/30 uppercase tracking-widest">
                      <Calendar size={12} /> Limit
                    </div>
                    <p className={`text-xs font-black tabular-nums ${isOverdue ? 'text-tva-red' : 'text-tva-brown dark:text-tva-white'}`}>
                      {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-tva-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-tva-beige dark:bg-tva-black w-full max-w-md rounded-[3rem] shadow-2xl p-10 border border-tva-brown/10 dark:border-tva-orange/10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-tva-brown dark:text-tva-orange uppercase tracking-tight">{isEditing ? 'MODIFY UNIT' : 'NEW UNIT'}</h2>
              <button onClick={closeModal} className="text-tva-brown/40 dark:text-tva-orange/40 hover:text-tva-red"><X size={28} /></button>
            </div>
            <form onSubmit={handleAddProject} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">UNIT IDENTIFIER</label>
                <input required type="text" className="w-full bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl px-6 py-4 outline-none text-sm font-black text-tva-brown dark:text-tva-white uppercase" placeholder="BRANCH ID..." value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">ORG ORIGIN</label>
                <select className="w-full bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl px-6 py-4 outline-none text-sm font-black text-tva-brown dark:text-tva-white cursor-pointer" value={newProject.clientId} onChange={e => setNewProject({ ...newProject, clientId: e.target.value })}>
                  {clients.map(c => <option key={c.id} value={c.id} className="dark:bg-tva-black">{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">EST. HRS</label>
                  <input type="number" step="0.5" className="w-full bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl px-6 py-4 outline-none text-sm font-black text-tva-brown dark:text-tva-white" value={newProject.estimatedDuration} onChange={e => setNewProject({ ...newProject, estimatedDuration: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">LIMIT DATE</label>
                  <input type="date" className="w-full bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl px-6 py-4 outline-none text-sm font-black text-tva-brown dark:text-tva-white" value={newProject.deadline} onChange={e => setNewProject({ ...newProject, deadline: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="w-full bg-tva-orange text-tva-white py-5 rounded-2xl font-black uppercase tracking-[0.4em] shadow-2xl hover:brightness-110 active:scale-95 transition-all">
                {isEditing ? 'UPDATE' : 'STABILIZE'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;