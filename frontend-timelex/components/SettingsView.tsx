
import React, { useState, useEffect } from 'react';
import { Save, Globe, Key, Wifi, AlertTriangle, CheckCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { AIConfig } from '../types';

interface SettingsViewProps {
  aiConfig: AIConfig;
  setAIConfig: (config: AIConfig) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ aiConfig, setAIConfig }) => {
  const [localConfig, setLocalConfig] = useState<AIConfig>(aiConfig);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const handleSave = () => {
    setAIConfig(localConfig);
    localStorage.setItem('timelex_ai_config', JSON.stringify(localConfig));
    alert('Temporal configuration stabilized.');
  };

  const handleReset = () => {
    if (window.confirm("Restore default TVA protocols? This will clear custom timeline endpoints.")) {
      const defaultConfig = { useCustom: false, endpoint: '', apiKey: '', model: '' };
      setLocalConfig(defaultConfig);
      setTestStatus('idle');
      setTestMessage('');
    }
  };

  const testConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Pinging timeline endpoint...');

    try {
      const response = await fetch(localConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localConfig.apiKey}`
        },
        body: JSON.stringify({ test: true })
      });

      if (response.ok) {
        setTestStatus('success');
        setTestMessage('Endpoint verified. Timeline synced.');
      } else {
        throw new Error(`Temporal drift detected: ${response.status}`);
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'Connection failed. Variant detected.');
    }
  };

  return (
    <div className="p-8 md:p-12 h-full flex flex-col overflow-y-auto bg-tva-white dark:bg-tva-black/20 font-ibm custom-scrollbar">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-tva-brown dark:text-tva-orange uppercase tracking-tight">Temporal Settings</h2>
        <p className="text-tva-brown/60 dark:text-tva-orange/60 font-bold text-xs uppercase tracking-widest mt-1">Configure external timeline intelligence</p>
      </div>

      <div className="max-w-3xl space-y-10">
        <section className="bg-white/40 dark:bg-tva-black/60 p-8 rounded-[2.5rem] border border-tva-brown/10 dark:border-tva-orange/10 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-tva-brown dark:text-tva-orange uppercase tracking-[0.2em] flex items-center gap-3">
              <Globe size={18} />
              Chronos API Protocol
            </h3>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={localConfig.useCustom}
                  onChange={(e) => setLocalConfig({ ...localConfig, useCustom: e.target.checked })}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${localConfig.useCustom ? 'bg-tva-orange' : 'bg-tva-brown/20'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${localConfig.useCustom ? 'translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-tva-brown/60 dark:text-tva-orange/60">
                {localConfig.useCustom ? 'CUSTOM ACTIVE' : 'TVA BUILT-IN'}
              </span>
            </label>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">ENDPOINT URL</label>
              <div className="relative">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-tva-brown/20 dark:text-tva-orange/20" size={18} />
                <input
                  type="url"
                  placeholder="https://api.your-ai.com/v1/analyze"
                  className="w-full bg-tva-beige/20 dark:bg-tva-black/40 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl pl-14 pr-5 py-4 outline-none text-sm font-bold text-tva-brown dark:text-tva-white focus:ring-2 focus:ring-tva-orange/20"
                  value={localConfig.endpoint}
                  onChange={(e) => setLocalConfig({ ...localConfig, endpoint: e.target.value })}
                  disabled={!localConfig.useCustom}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">ACCESS TOKEN / KEY</label>
              <div className="relative">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-tva-brown/20 dark:text-tva-orange/20" size={18} />
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  className="w-full bg-tva-beige/20 dark:bg-tva-black/40 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl pl-14 pr-5 py-4 outline-none text-sm font-bold text-tva-brown dark:text-tva-white focus:ring-2 focus:ring-tva-orange/20"
                  value={localConfig.apiKey}
                  onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                  disabled={!localConfig.useCustom}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-tva-brown/40 dark:text-tva-orange/40 uppercase tracking-[0.3em] px-1">MODEL ID</label>
              <div className="relative">
                <CheckCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-tva-brown/20 dark:text-tva-orange/20" size={18} />
                <input
                  type="text"
                  placeholder="e.g. GLM-4.6V-Flash or gpt-4o"
                  className="w-full bg-tva-beige/20 dark:bg-tva-black/40 border border-tva-brown/10 dark:border-tva-orange/10 rounded-2xl pl-14 pr-5 py-4 outline-none text-sm font-bold text-tva-brown dark:text-tva-white focus:ring-2 focus:ring-tva-orange/20"
                  value={localConfig.model || ''}
                  onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value })}
                  disabled={!localConfig.useCustom}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-tva-brown text-tva-beige py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Save size={18} /> Stabilize Settings
            </button>
            <button
              onClick={testConnection}
              disabled={!localConfig.useCustom || !localConfig.endpoint || testStatus === 'testing'}
              className="flex-1 bg-white/40 dark:bg-tva-black border border-tva-brown/10 dark:border-tva-orange/10 text-tva-brown dark:text-tva-orange py-4 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-tva-orange/10 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
            >
              {testStatus === 'testing' ? <RefreshCw size={18} className="animate-spin" /> : <Wifi size={18} />}
              Test Connection
            </button>
            <button
              onClick={handleReset}
              className="flex-none px-6 bg-transparent border border-tva-brown/10 dark:border-tva-orange/10 text-tva-brown/40 dark:text-tva-orange/40 py-4 rounded-2xl font-black uppercase tracking-[0.2em] hover:text-tva-red hover:border-tva-red/20 hover:bg-tva-red/5 transition-all flex items-center justify-center gap-3"
              title="Reset Protocol"
            >
              <RotateCcw size={18} />
              <span className="md:hidden lg:inline">RESET</span>
            </button>
          </div>

          {testStatus !== 'idle' && (
            <div className={`mt-6 p-4 rounded-2xl flex items-center gap-4 border animate-in slide-in-from-top-2 ${testStatus === 'success' ? 'bg-tva-green/10 border-tva-green/20 text-tva-green' :
              testStatus === 'error' ? 'bg-tva-red/10 border-tva-red/20 text-tva-red' :
                'bg-tva-orange/10 border-tva-orange/20 text-tva-orange'
              }`}>
              {testStatus === 'success' ? <CheckCircle size={20} /> : testStatus === 'error' ? <AlertTriangle size={20} /> : <RefreshCw size={20} className="animate-spin" />}
              <span className="text-xs font-bold uppercase tracking-widest">{testMessage}</span>
            </div>
          )}
        </section>

        <section className="p-8 bg-tva-orange/5 border border-tva-orange/10 rounded-[2.5rem]">
          <h4 className="text-[10px] font-black text-tva-orange uppercase tracking-[0.3em] mb-4">API Response Format</h4>
          <p className="text-xs text-tva-brown/60 dark:text-tva-orange/60 font-medium leading-relaxed">
            Your custom endpoint should accept a POST request with a JSON body containing task and project context.
            It must return a JSON object with a <code className="bg-tva-brown/10 px-1 rounded">text</code> field containing the analysis in Markdown format.
          </p>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
