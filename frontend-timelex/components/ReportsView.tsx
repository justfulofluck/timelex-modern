
import React, { useState, useMemo } from 'react';
import { Download, Sparkles, TrendingUp, Wallet, Clock as ClockIcon } from 'lucide-react';
import { Task, Project, Client, UserRole, AIConfig } from '../types';
import { formatDuration, formatCurrency } from './Formatters';
import { getSmartInsights } from '../services/aiService';

interface ReportsViewProps {
  tasks: Task[];
  projects: Project[];
  clients: Client[];
  role: UserRole;
  aiConfig?: AIConfig;
}

const ReportsView: React.FC<ReportsViewProps> = ({ tasks, projects, clients, role, aiConfig }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const isAdmin = role === 'admin';

  const projectStats = useMemo(() => {
    const stats: Record<string, { name: string, color: string, time: number, earnings: number, currency: string }> = {};
    
    tasks.forEach(t => {
      const p = projects.find(proj => proj.id === t.projectId);
      const c = clients.find(cl => cl.id === p?.clientId);
      const projId = t.projectId;
      const currency = c?.currency || 'USD';
      
      if (!stats[projId]) {
        stats[projId] = { 
          name: p?.name || 'Unknown', 
          color: p?.color || '#C46A2D', 
          time: 0, 
          earnings: 0,
          currency: currency
        };
      }
      
      const durationHours = t.duration / (1000 * 60 * 60);
      stats[projId].time += t.duration;
      stats[projId].earnings += durationHours * (c?.hourlyRate || 0);
    });

    return Object.values(stats);
  }, [tasks, projects, clients]);

  const earningsByCurrency = useMemo(() => {
    const totals: Record<string, number> = {};
    projectStats.forEach(p => {
      totals[p.currency] = (totals[p.currency] || 0) + p.earnings;
    });
    return totals;
  }, [projectStats]);

  const totalTime = projectStats.reduce((acc, p) => acc + p.time, 0);

  const handleGetInsight = async () => {
    setLoadingInsight(true);
    const text = await getSmartInsights(tasks, projects, clients, aiConfig);
    setInsight(text || "No insights available from the archives.");
    setLoadingInsight(false);
  };

  return (
    <div className="p-6 md:p-10 h-full flex flex-col overflow-y-auto bg-tva-white dark:bg-tva-black/20 custom-scrollbar transition-colors font-ibm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-tva-brown dark:text-tva-orange uppercase tracking-tight">Temporal Analysis</h2>
          <p className="text-tva-brown/60 dark:text-tva-orange/60 font-bold text-xs mt-1 uppercase tracking-widest">Efficiency metrics for assigned timeline units</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleGetInsight}
            disabled={loadingInsight}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-tva-orange text-tva-white px-7 py-3 rounded-2xl hover:brightness-110 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-tva-orange/20 disabled:opacity-50"
          >
            <Sparkles size={18} className="text-tva-gold" /> 
            {loadingInsight ? 'SCANNING...' : aiConfig?.useCustom ? 'QUERY CUSTOM API' : 'AI INSIGHTS'}
          </button>
          <button className="hidden md:flex items-center gap-2 bg-tva-brown text-tva-beige px-6 py-3 rounded-2xl hover:brightness-110 transition-all font-black text-sm uppercase tracking-widest shadow-lg">
            <Download size={18} /> EXPORT
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isAdmin ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-6 md:gap-8 mb-8 md:mb-10`}>
        <div className="bg-tva-beige/40 dark:bg-tva-black/60 p-8 md:p-10 rounded-[2.5rem] border border-tva-brown/10 dark:border-tva-orange/10 shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-3 text-tva-brown dark:text-tva-orange mb-6 font-black uppercase tracking-[0.2em] text-[10px]">
            <ClockIcon size={18} />
            <span>ACCUMULATED TIME</span>
          </div>
          <p className="text-4xl md:text-5xl font-mono font-bold text-tva-brown dark:text-tva-white tracking-tighter tabular-nums">
            {formatDuration(totalTime)}
          </p>
        </div>

        <div className="bg-tva-brown/5 dark:bg-tva-black/60 p-8 md:p-10 rounded-[2.5rem] border border-tva-brown/10 dark:border-tva-orange/10 shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-3 text-tva-brown/60 dark:text-tva-orange/60 mb-6 font-black uppercase tracking-[0.2em] text-[10px]">
            <TrendingUp size={18} />
            <span>TIMELINE STABILITY</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl md:text-5xl font-bold text-tva-orange tracking-tighter">+12.5%</p>
            <span className="text-[10px] font-black text-tva-green uppercase tracking-widest">Optimized</span>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-tva-orange/5 dark:bg-tva-black/60 p-8 md:p-10 rounded-[2.5rem] border border-tva-orange/10 dark:border-tva-orange/20 shadow-xl relative overflow-hidden group sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 text-tva-orange mb-6 font-black uppercase tracking-[0.2em] text-[10px]">
              <Wallet size={18} />
              <span>RESOURCE YIELD</span>
            </div>
            <div className="space-y-1">
              {Object.entries(earningsByCurrency).length > 0 ? (
                (Object.entries(earningsByCurrency) as [string, number][]).map(([curr, val]) => (
                  <p key={curr} className="text-4xl md:text-5xl font-bold text-tva-brown dark:text-tva-orange tracking-tighter tabular-nums">
                    {formatCurrency(val, curr)}
                  </p>
                ))
              ) : (
                <p className="text-4xl md:text-5xl font-bold text-tva-brown dark:text-tva-orange tracking-tighter font-mono">
                  {formatCurrency(0)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {insight && (
        <div className="mb-8 p-8 md:p-12 bg-white/60 dark:bg-tva-black/40 rounded-[3rem] border border-tva-orange/20 shadow-2xl animate-in slide-in-from-top-4 duration-500 relative">
          <div className="absolute top-0 right-10 bg-tva-orange text-tva-white px-4 py-1.5 rounded-b-xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Sparkles size={12} className="text-tva-gold" /> OFFICIAL ARCHIVE INSIGHT
          </div>
          <div className="text-tva-brown dark:text-tva-white whitespace-pre-wrap text-sm leading-relaxed font-bold uppercase tracking-wide opacity-80">
            {insight}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsView;
