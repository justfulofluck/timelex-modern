
import React, { useState } from 'react';
import { Plus, User, Banknote, Trash2, Edit2, AlertCircle, X } from 'lucide-react';
import { Client, UserRole } from '../types';
import { formatCurrency } from './Formatters';

interface ClientsViewProps {
  clients: Client[];
  role: UserRole;
  onAddClick: () => void;
  onEditClick: (client: Client) => void;
  onDeleteClick: (id: string) => void;
}

const ClientsView: React.FC<ClientsViewProps> = ({ clients, role, onAddClick, onEditClick, onDeleteClick }) => {
  const isAdmin = role === 'admin';
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deletingId) {
      onDeleteClick(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col relative bg-tva-white dark:bg-tva-black/20 transition-colors duration-300 font-ibm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-tva-brown dark:text-tva-orange uppercase tracking-tight">Variant Organizations</h2>
          <p className="text-tva-brown/60 dark:text-tva-orange/60 font-bold text-xs uppercase tracking-widest mt-1">Manage business entities and temporal rates</p>
        </div>
        {isAdmin && (
          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 bg-tva-brown text-tva-beige px-6 py-3 rounded-2xl hover:brightness-110 transition-all font-black text-sm uppercase tracking-widest shadow-xl"
          >
            <Plus size={20} /> New Entity
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1 custom-scrollbar pr-2">
        <div className="grid gap-6">
          {clients.map(c => (
            <div key={c.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-white/60 dark:bg-tva-black/40 border border-tva-brown/10 dark:border-tva-orange/10 rounded-3xl shadow-lg hover:shadow-2xl hover:border-tva-orange/40 transition-all group relative overflow-hidden">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-14 h-14 bg-tva-orange/10 dark:bg-tva-orange/20 text-tva-orange rounded-2xl flex items-center justify-center border border-tva-orange/10 shrink-0 group-hover:rotate-12 transition-transform">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-tva-brown dark:text-tva-white uppercase tracking-tight">{c.name}</h3>
                  <div className="flex items-center gap-2 text-tva-orange font-bold text-xs uppercase tracking-[0.15em] mt-1">
                    <Banknote size={16} className="opacity-60" />
                    <span>{formatCurrency(c.hourlyRate, c.currency)} / Hour</span>
                  </div>
                </div>
              </div>
              
              {isAdmin && (
                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-tva-brown/5 dark:border-tva-orange/5">
                  <button 
                    onClick={() => onEditClick(c)}
                    className="flex-1 md:flex-none text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border border-tva-brown/20 dark:border-tva-orange/20 text-tva-brown/60 dark:text-tva-orange/60 hover:text-tva-orange hover:border-tva-orange transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={14} />
                    Modify Rate
                  </button>
                  <button 
                    onClick={() => setDeletingId(c.id)}
                    className="p-2.5 text-tva-brown/20 dark:text-tva-orange/20 hover:text-tva-red hover:bg-tva-red/10 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TVA Styled Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-tva-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-tva-beige dark:bg-tva-black w-full max-w-md rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-10 border border-tva-brown/10 dark:border-tva-orange/10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center w-20 h-20 bg-tva-red/10 text-tva-red rounded-[2rem] mb-8 mx-auto border border-tva-red/20 shadow-lg shadow-tva-red/10">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-center text-tva-brown dark:text-tva-white mb-3 uppercase tracking-tight">PRUNE ENTITY?</h3>
            <p className="text-sm text-center text-tva-brown/60 dark:text-tva-orange/60 mb-10 font-bold uppercase tracking-wider leading-relaxed">
              This will permanently delete this Variant Organization and all associated temporal links from the archive.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeletingId(null)}
                className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-tva-brown/60 dark:text-tva-orange/60 bg-white/40 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 hover:brightness-105 transition-all"
              >
                ABORT
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white bg-tva-red hover:brightness-110 shadow-xl shadow-tva-red/20 transition-all active:scale-95"
              >
                CONFIRM PRUNE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsView;
