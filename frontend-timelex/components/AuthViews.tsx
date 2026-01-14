
import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, ShieldCheck, RefreshCw, User, Briefcase, ChevronRight, HelpCircle } from 'lucide-react';
import { UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthViewsProps {
  onLogin: (role: UserRole, clientId?: string) => void;
}

type AuthMode = 'selection' | 'freelancer-login' | 'client-login' | 'forgot-password' | 'reset-success';

const AuthViews: React.FC<AuthViewsProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSelectedRole, setLastSelectedRole] = useState<UserRole>('admin');

  const handleSubmit = async (e: React.FormEvent, role: UserRole) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      onLogin(result.role, result.clientId);
    } catch (error: any) {
      alert("Login failed: " + (error.message || "Invalid credentials"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.resetPassword(email);
      setMode('reset-success');
    } catch (error: any) {
      alert(error.message || "Failed to send reset link. Please try again or contact admin.");
    } finally {
      setIsLoading(false);
    }
  };

  const openLogin = (role: UserRole) => {
    setLastSelectedRole(role);
    setMode(role === 'admin' ? 'freelancer-login' : 'client-login');
  };

  const renderSelection = () => (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-tva-brown dark:text-tva-orange tracking-tighter uppercase">ACCESS PORTAL</h1>
        <p className="text-tva-brown/40 dark:text-tva-orange/40 mt-2 font-bold uppercase tracking-widest text-[10px]">VERIFY AGENT CREDENTIALS</p>
      </div>

      <button
        onClick={() => openLogin('admin')}
        className="group w-full bg-white dark:bg-tva-black border-2 border-tva-brown/5 hover:border-tva-orange p-8 rounded-3xl shadow-2xl transition-all flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-tva-brown/10 dark:bg-tva-orange/10 text-tva-brown dark:text-tva-orange rounded-2xl flex items-center justify-center group-hover:bg-tva-brown group-hover:text-tva-beige transition-colors">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-tva-brown dark:text-tva-white uppercase tracking-tight">TVA AGENT</h3>
            <p className="text-xs text-tva-brown/40 dark:text-tva-orange/40 font-bold uppercase tracking-widest">Case Log Access</p>
          </div>
        </div>
        <ChevronRight className="text-tva-brown/20 dark:text-tva-orange/20 group-hover:text-tva-orange group-hover:translate-x-1 transition-all" size={24} />
      </button>

      <button
        onClick={() => openLogin('client')}
        className="group w-full bg-white dark:bg-tva-black border-2 border-tva-brown/5 hover:border-tva-orange p-8 rounded-3xl shadow-2xl transition-all flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-tva-orange/10 text-tva-orange rounded-2xl flex items-center justify-center group-hover:bg-tva-orange group-hover:text-tva-white transition-colors">
            <Briefcase size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-tva-brown dark:text-tva-white uppercase tracking-tight">VARIANT ORIGIN</h3>
            <p className="text-xs text-tva-brown/40 dark:text-tva-orange/40 font-bold uppercase tracking-widest">Timeline Monitoring</p>
          </div>
        </div>
        <ChevronRight className="text-tva-brown/20 dark:text-tva-orange/20 group-hover:text-tva-orange group-hover:translate-x-1 transition-all" size={24} />
      </button>
    </div>
  );

  const renderLoginForm = (role: UserRole) => (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-tva-brown dark:text-tva-orange tracking-tighter uppercase">
          {role === 'admin' ? 'AGENT LOGIN' : 'VARIANT AUTH'}
        </h1>
        <p className="text-tva-brown/40 dark:text-tva-orange/40 mt-2 font-bold uppercase tracking-widest text-[10px]">
          FOR ALL TIME. ALWAYS.
        </p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, role)} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-tva-brown/40 dark:text-tva-orange/40" size={20} />
          <input
            type="email" required placeholder="Temporal ID (Email)"
            className="w-full bg-tva-beige/20 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl pl-14 pr-5 py-5 outline-none focus:ring-2 focus:ring-tva-orange/30 transition-all text-sm font-black text-tva-brown dark:text-tva-white uppercase tracking-widest placeholder-tva-brown/30"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-tva-brown/40 dark:text-tva-orange/40" size={20} />
            <input
              type="password" required placeholder="Access Code"
              className="w-full bg-tva-beige/20 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl pl-14 pr-5 py-5 outline-none focus:ring-2 focus:ring-tva-orange/30 transition-all text-sm font-black text-tva-brown dark:text-tva-white tracking-widest placeholder-tva-brown/30"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end px-1">
            <button
              type="button"
              onClick={() => setMode('forgot-password')}
              className="text-[10px] font-black text-tva-orange/60 hover:text-tva-orange uppercase tracking-widest transition-colors"
            >
              Forgot Access Code?
            </button>
          </div>
        </div>

        <button
          type="submit" disabled={isLoading}
          className="w-full bg-tva-orange text-tva-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-2xl hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <RefreshCw size={24} className="animate-spin mx-auto" /> : 'INITIALIZE'}
        </button>
      </form>

      <button
        onClick={() => setMode('selection')}
        className="mt-10 flex items-center gap-2 text-[10px] text-tva-brown/40 dark:text-tva-orange/40 font-black uppercase tracking-widest mx-auto hover:text-tva-orange transition-colors"
      >
        <ArrowLeft size={16} /> RE-SPECIFY ROLE
      </button>
    </div>
  );

  const renderForgotPasswordForm = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-tva-brown dark:text-tva-orange tracking-tighter uppercase">RECOVERY</h1>
        <p className="text-tva-brown/40 dark:text-tva-orange/40 mt-2 font-bold uppercase tracking-widest text-[10px]">
          RESET TEMPORAL CREDENTIALS
        </p>
      </div>

      <div className="mb-8 p-6 bg-tva-orange/5 border border-tva-orange/10 rounded-2xl flex items-start gap-4">
        <HelpCircle size={20} className="text-tva-orange shrink-0 mt-1" />
        <p className="text-xs text-tva-brown/60 dark:text-tva-orange/60 font-medium leading-relaxed uppercase tracking-wide">
          Enter the Temporal ID associated with your timeline account. We will transmit a reset beacon to your archive.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-tva-brown/40 dark:text-tva-orange/40" size={20} />
          <input
            type="email" required placeholder="Temporal ID (Email)"
            className="w-full bg-tva-beige/20 dark:bg-tva-black/60 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl pl-14 pr-5 py-5 outline-none focus:ring-2 focus:ring-tva-orange/30 transition-all text-sm font-black text-tva-brown dark:text-tva-white uppercase tracking-widest placeholder-tva-brown/30"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit" disabled={isLoading}
          className="w-full bg-tva-orange text-tva-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-2xl hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <RefreshCw size={24} className="animate-spin mx-auto" /> : 'SEND BEACON'}
        </button>
      </form>

      <button
        onClick={() => setMode(lastSelectedRole === 'admin' ? 'freelancer-login' : 'client-login')}
        className="mt-10 flex items-center gap-2 text-[10px] text-tva-brown/40 dark:text-tva-orange/40 font-black uppercase tracking-widest mx-auto hover:text-tva-orange transition-colors"
      >
        <ArrowLeft size={16} /> RETURN TO LOGIN
      </button>
    </div>
  );

  const renderResetSuccess = () => (
    <div className="animate-in zoom-in-95 duration-500 text-center">
      <div className="w-24 h-24 bg-tva-orange/10 text-tva-orange rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-tva-orange/20 shadow-xl shadow-tva-orange/10">
        <ShieldCheck size={48} />
      </div>

      <h1 className="text-3xl font-black text-tva-brown dark:text-tva-orange tracking-tighter uppercase mb-4">BEACON SENT</h1>
      <p className="text-sm text-tva-brown/60 dark:text-tva-orange/60 font-bold uppercase tracking-[0.15em] mb-10 leading-relaxed max-w-sm mx-auto">
        Credential recovery protocol initiated. Please check your temporal archive for further instructions.
      </p>

      <button
        onClick={() => setMode('selection')}
        className="w-full bg-tva-brown text-tva-beige py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-2xl hover:brightness-110 transition-all active:scale-95"
      >
        BACK TO PORTAL
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-tva-beige dark:bg-tva-dark flex items-center justify-center p-6 relative overflow-hidden font-montserrat">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-tva-orange/5 via-transparent to-transparent opacity-50" />
      <div className="w-full max-w-lg bg-white/60 dark:bg-tva-black/80 rounded-[3rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-tva-brown/10 dark:border-tva-orange/10 relative overflow-hidden backdrop-blur-xl">
        <div className="flex justify-center mb-16">
          <img src={`http://${window.location.hostname}:8000/media/timex-logo.png`} alt="Timelex" className="w-48 h-48 object-contain drop-shadow-2xl grayscale brightness-125 hover:grayscale-0 transition-all duration-700 cursor-help" />
        </div>

        {mode === 'selection' && renderSelection()}
        {mode === 'freelancer-login' && renderLoginForm('admin')}
        {mode === 'client-login' && renderLoginForm('client')}
        {mode === 'forgot-password' && renderForgotPasswordForm()}
        {mode === 'reset-success' && renderResetSuccess()}
      </div>
    </div>
  );
};

export default AuthViews;