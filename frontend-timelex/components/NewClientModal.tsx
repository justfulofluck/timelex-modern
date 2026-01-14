
import React, { useState, useEffect } from 'react';
import { X, User, Banknote, Globe } from 'lucide-react';
import { Client } from '../types';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: { name: string; hourlyRate: number; currency: string; id?: string; email?: string; password?: string }) => void;
  initialData?: Client | null;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [currency, setCurrency] = useState('USD');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setHourlyRate(initialData.hourlyRate.toString());
      setCurrency(initialData.currency);
      setEmail('');
      setPassword('');
    } else {
      setName('');
      setHourlyRate('');
      setCurrency('USD');
      setEmail('');
      setPassword('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !hourlyRate) return;
    onSubmit({
      id: initialData?.id,
      name,
      hourlyRate: parseFloat(hourlyRate),
      currency,
      email: email || undefined,
      password: password || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-[#1e293b]">{initialData ? 'Edit Client' : 'New Variant Organization'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">CLIENT NAME</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                placeholder="e.g. Acme Corporation"
                className="w-full bg-[#f9fafb] border border-gray-100 rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/10 text-sm font-bold text-[#1e293b] placeholder-gray-300 transition-all hover:bg-white hover:border-gray-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">HOURLY RATE</label>
              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/10 text-sm font-bold text-[#1e293b] placeholder-gray-300 transition-all hover:bg-white hover:border-gray-200"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">CURRENCY</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/10 appearance-none text-sm font-bold text-[#1e293b] cursor-pointer transition-all hover:bg-white hover:border-gray-200"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {!initialData && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-tva-orange/10 flex items-center justify-center text-tva-orange">
                  <User size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-tva-brown uppercase tracking-wide">Portal Access</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Create credentials for client login</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">ACCESS ID (EMAIL)</label>
                <input
                  type="email"
                  placeholder="client@example.com"
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/10 text-sm font-bold text-[#1e293b] placeholder-gray-300 transition-all hover:bg-white hover:border-gray-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">ACCESS KEY (PASSWORD)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#f9fafb] border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/10 text-sm font-bold text-[#1e293b] placeholder-gray-300 transition-all hover:bg-white hover:border-gray-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white py-4.5 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-[0_12px_30px_-8px_rgba(59,130,246,0.6)] border border-blue-400/20 uppercase tracking-widest text-xs"
            >
              {initialData ? 'UPDATE ENTITY' : 'INITIALIZE ENTITY'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientModal;
