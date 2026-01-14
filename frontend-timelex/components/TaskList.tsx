import React, { useState, useMemo } from 'react';
import { Play, Trash2, LayoutGrid, Calendar, MessageSquare, Image as ImageIcon, CheckCircle2, Circle, Square, CheckSquare, X, RefreshCw, SortAsc, SortDesc } from 'lucide-react';
import { Task, Project, Client, TaskPriority } from '../types';
import { formatDuration } from './Formatters';

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  clients: Client[];
  searchQuery: string;
  onPlay?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleComplete?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onBulkComplete?: (ids: string[], complete: boolean) => void;
  onPriorityChange?: (id: string, priority: TaskPriority) => void;
  onDateChange?: (id: string, date: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, projects, clients, searchQuery, onPlay, onDelete, onToggleComplete, onBulkDelete, onBulkComplete, onPriorityChange, onDateChange 
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  const priorityWeight = { 'high': 3, 'medium': 2, 'low': 1 };

  const filteredTasks = useMemo(() => {
    let list = tasks.filter(t => 
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    list.sort((a, b) => {
      if (sortBy === 'priority') {
        const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
        return sortOrder === 'desc' ? diff : -diff;
      } else {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortOrder === 'desc' ? diff : -diff;
      }
    });

    return list;
  }, [tasks, searchQuery, sortBy, sortOrder]);

  const getProject = (id: string) => projects.find(p => p.id === id);
  const getClient = (id: string) => clients.find(c => c.id === getProject(id)?.clientId);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map(t => t.id));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const handleBulkCompleteAction = (complete: boolean) => {
    onBulkComplete?.(selectedIds, complete);
    clearSelection();
  };

  const handleBulkDeleteAction = () => {
    if (window.confirm(`Prune these ${selectedIds.length} timeline branches?`)) {
      onBulkDelete?.(selectedIds);
      clearSelection();
    }
  };

  const handlePriorityCycle = (id: string, current: TaskPriority) => {
    if (!onPriorityChange) return;
    const next: Record<TaskPriority, TaskPriority> = {
      'low': 'medium',
      'medium': 'high',
      'high': 'low'
    };
    onPriorityChange(id, next[current]);
  };

  const handleToggleComplete = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      setJustCompletedId(id);
      setTimeout(() => setJustCompletedId(null), 1000);
    }
    onToggleComplete?.(id);
  };

  const getPriorityConfig = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return { bg: 'bg-tva-red/10', text: 'text-tva-red', border: 'border-tva-red/20', label: 'CRITICAL' };
      case 'medium':
        return { bg: 'bg-tva-orange/10', text: 'text-tva-orange', border: 'border-tva-orange/20', label: 'STABLE' };
      default:
        return { bg: 'bg-tva-green/10', text: 'text-tva-green', border: 'border-tva-green/20', label: 'LOW RISK' };
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-tva-brown/40 dark:text-tva-orange/40 p-6 md:p-10 transition-colors">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-tva-beige dark:bg-tva-black rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-tva-brown/5">
          <LayoutGrid size={32} />
        </div>
        <p className="text-sm font-black uppercase tracking-widest">Temporal Archives Empty</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden transition-colors">
      <div className="px-6 md:px-8 pb-4 flex items-center justify-between shrink-0 overflow-x-auto no-scrollbar border-b border-tva-brown/5 dark:border-tva-orange/5 mb-4">
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-[10px] font-black text-tva-brown/60 dark:text-tva-orange/60 uppercase tracking-widest transition-colors"
          >
            {selectedIds.length > 0 && selectedIds.length === filteredTasks.length ? <CheckSquare size={16} /> : <Square size={16} />}
            {selectedIds.length > 0 ? `${selectedIds.length} MARKED` : 'SELECT ALL'}
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="flex items-center gap-1 bg-tva-beige/40 dark:bg-tva-black/40 p-1 rounded-xl border border-tva-brown/10 dark:border-tva-orange/10">
            <button 
              onClick={() => setSortBy('date')}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${sortBy === 'date' ? 'bg-tva-orange text-tva-white shadow-md' : 'text-tva-brown/40 dark:text-tva-orange/40'}`}
            >
              Time
            </button>
            <button 
              onClick={() => setSortBy('priority')}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${sortBy === 'priority' ? 'bg-tva-orange text-tva-white shadow-md' : 'text-tva-brown/40 dark:text-tva-orange/40'}`}
            >
              Risk
            </button>
          </div>
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 text-tva-brown/40 dark:text-tva-orange/40 hover:text-tva-orange transition-colors"
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-24 md:pb-32 custom-scrollbar">
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const project = getProject(task.projectId);
            const client = getClient(task.projectId);
            const isSelected = selectedIds.includes(task.id);
            const pConfig = getPriorityConfig(task.priority);
            
            return (
              <div 
                key={task.id} 
                className={`group flex flex-col p-4 md:p-5 rounded-2xl border task-item-transition transition-all relative overflow-hidden ${
                  task.isCompleted 
                  ? 'bg-tva-brown/5 dark:bg-tva-black/20 border-tva-brown/10 dark:border-tva-orange/10 opacity-60' 
                  : isSelected 
                    ? 'bg-tva-orange/5 border-tva-orange shadow-inner' 
                    : 'bg-white/40 dark:bg-tva-black/40 border-tva-brown/5 dark:border-tva-orange/5 hover:border-tva-orange/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex flex-col gap-3 pt-1">
                       <button 
                        onClick={(e) => { e.stopPropagation(); toggleSelection(task.id); }}
                        className={`transition-all ${isSelected ? 'text-tva-orange' : 'text-tva-brown/20 dark:text-tva-orange/20 hover:text-tva-orange'}`}
                      >
                        {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleComplete(task.id, task.isCompleted); }}
                        className={`transition-all ${task.isCompleted ? 'text-tva-orange' : 'text-tva-brown/20 dark:text-tva-orange/20 hover:text-tva-orange'}`}
                      >
                        {task.isCompleted ? <CheckCircle2 size={18} className="animate-check-pop" /> : <Circle size={18} />}
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`text-[15px] font-black tracking-tight transition-all leading-snug uppercase ${task.isCompleted ? 'text-tva-brown/40 dark:text-tva-orange/40 line-through opacity-70' : 'text-tva-brown dark:text-tva-white'}`}>
                          {task.description}
                        </h4>
                        {!task.isCompleted && (
                           <div className="flex items-center gap-1">
                             <button 
                               onClick={(e) => { e.stopPropagation(); handlePriorityCycle(task.id, task.priority); }}
                               className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${pConfig.bg} ${pConfig.text} ${pConfig.border}`}
                             >
                               {pConfig.label}
                             </button>
                           </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-bold text-[10px] uppercase tracking-widest text-tva-brown/40 dark:text-tva-orange/40">
                        <div className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project?.color || '#C46A2D' }} />
                           <span className="truncate max-w-[120px]">{project?.name}</span>
                        </div>
                        <span className="opacity-20">/</span>
                        <span className="truncate max-w-[100px]">{client?.name}</span>
                        <span className="opacity-20">/</span>
                        <input 
                          type="date"
                          className="bg-transparent outline-none border-none p-0 w-24 text-tva-brown/40 dark:text-tva-orange/40"
                          value={task.date}
                          onChange={(e) => onDateChange?.(task.id, e.target.value)}
                          disabled={task.isCompleted}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {task.duration > 0 && (
                      <span className="text-sm font-mono font-black text-tva-brown dark:text-tva-orange tabular-nums">
                        {formatDuration(task.duration)}
                      </span>
                    )}
                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onPlay && !task.isCompleted && (
                        <button onClick={(e) => { e.stopPropagation(); onPlay(task.id); }} className="p-2 text-tva-orange hover:bg-tva-orange/10 rounded-xl transition-colors">
                          <Play size={16} fill="currentColor" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="p-2 text-tva-red hover:bg-tva-red/10 rounded-xl transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {(task.comment || task.imageUrl) && (
                  <div className="mt-4 ml-8 pl-4 border-l-2 border-tva-orange/20">
                    {task.comment && (
                      <div className="bg-tva-brown/5 dark:bg-tva-black/40 p-3 rounded-xl mb-3 flex gap-2 border border-tva-brown/5">
                        <MessageSquare size={14} className="text-tva-orange shrink-0 mt-0.5" />
                        <p className="text-xs text-tva-brown/60 dark:text-tva-orange/60 font-medium italic">{task.comment}</p>
                      </div>
                    )}
                    {task.imageUrl && (
                      <div className="relative inline-block max-w-sm rounded-2xl overflow-hidden border border-tva-brown/10 dark:border-tva-orange/10 shadow-lg grayscale hover:grayscale-0 transition-all">
                        <img src={task.imageUrl} alt="Variant Proof" className="w-full h-auto object-cover max-h-48" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed md:absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-tva-brown dark:bg-tva-orange text-tva-white px-8 py-5 rounded-[2rem] shadow-2xl z-[80] border border-white/10 transition-all animate-in slide-in-from-bottom-8">
          <div className="flex flex-col pr-6 border-r border-white/10 shrink-0">
             <span className="text-[10px] font-black text-tva-beige/60 uppercase tracking-widest leading-none mb-1">Variant Logs</span>
             <span className="text-lg font-black leading-none">{selectedIds.length} MARKED</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => handleBulkCompleteAction(true)} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-tva-gold">
              <CheckCircle2 size={24} />
            </button>
            <button onClick={handleBulkDeleteAction} className="p-3 hover:bg-tva-red/20 text-tva-white rounded-2xl transition-all">
              <Trash2 size={24} />
            </button>
            <button onClick={clearSelection} className="p-3 hover:bg-white/10 rounded-2xl text-tva-white/60">
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;