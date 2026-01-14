
import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Calendar, MessageSquare, ClipboardList, AlertCircle, Layers } from 'lucide-react';
import { Project, TaskPriority, TaskRecurrence } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    title: string;
    comment: string;
    image: string | null;
    date: string;
    dueDate: string;
    projectId: string;
    priority: TaskPriority;
    recurrence: TaskRecurrence;
  }) => void;
  projects: Project[];
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onSubmit, projects }) => {
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [isDragging, setIsDragging] = useState(false);
  // Fixed: Added const keyword to correctly declare fileInputRef
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (projects.length > 0 && (!projectId || !projects.find(p => p.id === projectId))) {
      setProjectId(projects[0].id);
    }
  }, [projects, projectId]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Please identify the Case.");
      return;
    }
    if (!projectId) {
      alert("No Timeline Unit (Project) selected. Please ask an administrator to assign a Project to your Organization first.");
      return;
    }
    onSubmit({
      title,
      comment,
      image,
      date,
      dueDate,
      projectId,
      priority,
      recurrence: 'none'
    });
    setTitle('');
    setComment('');
    setImage(null);
    setDueDate('');
    setPriority('medium');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-tva-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-tva-beige dark:bg-tva-black w-full max-w-xl h-full md:h-auto max-h-[95vh] rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border border-tva-brown/10 dark:border-tva-orange/10 transition-colors font-ibm">
        {/* Header */}
        <div className="px-8 py-6 border-b border-tva-brown/5 dark:border-tva-orange/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-tva-orange/10 dark:bg-tva-orange/20 text-tva-orange rounded-2xl flex items-center justify-center border border-tva-orange/10 transition-colors">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-tva-brown dark:text-tva-white uppercase tracking-tight">New Case Request</h2>
              <p className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.2em]">Temporal Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-tva-red/10 rounded-full transition-colors text-tva-brown/40 dark:text-tva-orange/40 hover:text-tva-red">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Title & Project Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">CASE IDENTIFIER</label>
              <input
                type="text" required placeholder="What needs to be logged?"
                className="w-full bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 focus:border-tva-orange dark:focus:border-tva-orange/50 rounded-2xl px-5 py-4 outline-none text-sm font-bold text-tva-brown dark:text-tva-white placeholder-tva-brown/30 dark:placeholder-tva-orange/20 transition-all uppercase tracking-tight"
                value={title} onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">TIMELINE UNIT</label>
              <div className="relative">
                <select
                  required className="w-full bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 focus:border-tva-orange dark:focus:border-tva-orange/50 rounded-2xl px-5 py-4 outline-none text-sm font-black text-tva-brown dark:text-tva-white cursor-pointer appearance-none transition-all"
                  value={projectId} onChange={(e) => setProjectId(e.target.value)}
                >
                  {projects.length > 0 ? (
                    projects.map(p => <option key={p.id} value={p.id} className="dark:bg-tva-black">{p.name}</option>)
                  ) : (
                    <option value="">No Active Timeline Units</option>
                  )}
                </select>
                <Layers className="absolute right-5 top-1/2 -translate-y-1/2 text-tva-brown/20 dark:text-tva-orange/20 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          {/* Comment Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em]">NARRATIVE & COMMENTS</label>
              <MessageSquare size={14} className="text-tva-brown/20 dark:text-tva-orange/20" />
            </div>
            <textarea
              placeholder="Provide more details about this branch event..."
              className="w-full bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 focus:border-tva-orange dark:focus:border-tva-orange/50 rounded-2xl px-5 py-4 outline-none text-sm font-medium text-tva-brown dark:text-tva-white min-h-[100px] resize-none transition-all placeholder-tva-brown/20 dark:placeholder-tva-orange/10"
              value={comment} onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">RISK LEVEL</label>
            <div className="flex p-1 bg-white/40 dark:bg-tva-black/60 rounded-2xl border border-tva-brown/10 dark:border-tva-orange/10 gap-1 transition-colors">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                <button
                  key={p} type="button" onClick={() => setPriority(p)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${priority === p
                    ? 'bg-tva-orange text-tva-white shadow-lg'
                    : 'text-tva-brown/40 dark:text-tva-orange/40 hover:text-tva-brown dark:hover:text-tva-orange'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Image */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">TEMPORAL PROOF / ATTACHMENT</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[2.5rem] p-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group relative overflow-hidden ${isDragging
                ? 'border-tva-orange bg-tva-orange/5 dark:bg-tva-orange/10'
                : 'border-tva-brown/10 dark:border-tva-orange/10 bg-white/20 dark:bg-tva-black/40 hover:bg-white/40 dark:hover:bg-tva-black/60 hover:border-tva-orange/40 dark:hover:border-tva-orange/40'
                }`}
            >
              <input type="file" hidden ref={fileInputRef} onChange={onFileSelect} accept="image/*" />
              {image ? (
                <div className="absolute inset-0 w-full h-full">
                  <img src={image} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-500" alt="Preview" />
                  <div className="absolute inset-0 bg-tva-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-tva-white text-[10px] font-black uppercase tracking-widest bg-tva-orange/80 backdrop-blur-md px-6 py-3 rounded-full">Replace Archive</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white dark:bg-tva-black/60 rounded-[1.5rem] shadow-xl flex items-center justify-center text-tva-orange transition-transform group-hover:scale-110 border border-tva-brown/5 dark:border-tva-orange/10">
                    <Upload size={28} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-tva-brown dark:text-tva-white uppercase tracking-tight">Drop Archive File</p>
                    <p className="text-[10px] font-black text-tva-brown/30 dark:text-tva-orange/30 uppercase tracking-[0.1em] mt-1">PNG, JPG or WEBP (MAX 10MB)</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">ABSOLUTE LIMIT (DUE DATE)</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-tva-brown/20 dark:text-tva-orange/20" size={18} />
              <input
                type="date"
                className="w-full bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 focus:border-tva-orange dark:focus:border-tva-orange/50 rounded-2xl pl-14 pr-5 py-4 outline-none text-sm font-bold text-tva-brown dark:text-tva-white transition-all"
                value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-8 bg-tva-brown/5 dark:bg-tva-black/80 border-t border-tva-brown/5 dark:border-tva-orange/10">
          <button
            type="button" onClick={handleSubmit}
            className="w-full bg-tva-orange hover:brightness-110 text-tva-white py-5 rounded-2xl font-black uppercase tracking-[0.4em] shadow-2xl shadow-tva-orange/20 transition-all active:scale-[0.98]"
          >
            Stabilize Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
