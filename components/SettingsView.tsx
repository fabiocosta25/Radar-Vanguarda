
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Map, 
  Globe, 
  Save, 
  Database, 
  ShieldCheck, 
  Trash2, 
  Plus,
  Cpu,
  Eye,
  CheckCircle2
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const [model, setModel] = useState('gemini-3-flash-preview');
  const [creativity, setCreativity] = useState(30);
  const [regions, setRegions] = useState(['SJC', 'Jacareí', 'Taubaté', 'Ilhabela']);
  const [sources, setSources] = useState<string[]>([]);
  const [newSource, setNewSource] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Carregar fontes do localStorage na montagem
  useEffect(() => {
    const savedSources = localStorage.getItem('radar_sources');
    if (savedSources) {
      setSources(JSON.parse(savedSources));
    } else {
      setSources([
        'portalvalenoticias.com.br',
        'vale360news.com.br',
        'sampi.net.br/ovale',
        'lifeinforma.com.br',
        'meon.com.br'
      ]);
    }
  }, []);

  const availableCities = [
    'SJC', 'Jacareí', 'Taubaté', 'Caçapava', 'Pinda', 'Guará', 'Lorena', 
    'Cunha', 'Ilhabela', 'Ubatuba', 'Caraguá', 'S. Sebastião', 'Bragança', 'Atibaia'
  ];

  const toggleRegion = (city: string) => {
    setRegions(prev => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]);
  };

  const addSource = () => {
    if (newSource && !sources.includes(newSource)) {
      setSources([...sources, newSource]);
      setNewSource('');
    }
  };

  const removeSource = (s: string) => {
    setSources(sources.filter(item => item !== s));
  };

  const handleSave = () => {
    localStorage.setItem('radar_sources', JSON.stringify(sources));
    localStorage.setItem('radar_regions', JSON.stringify(regions));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-blue-500 text-[10px] font-black uppercase tracking-widest">
            <Settings size={12} /> Configuração de Sistema
          </div>
          <h2 className="text-5xl font-serif font-bold text-white tracking-tight">Centro de Comando</h2>
          <p className="text-slate-500 text-xl max-w-xl">Ajuste os parâmetros neurais e geográficos da sua redação.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`${isSaved ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'} text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3 active:scale-95`}
        >
          {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {isSaved ? 'Configurações Salvas' : 'Salvar Alterações'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Configurações do Motor de IA */}
        <section className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-8 backdrop-blur-sm">
          <div className="flex items-center gap-4 text-blue-500">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Motor de Inteligência</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Modelo de Processamento</label>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setModel('gemini-3-flash-preview')}
                  className={`p-4 rounded-2xl border text-left transition-all ${model === 'gemini-3-flash-preview' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 bg-slate-950/50 text-slate-500 hover:border-white/10'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">Gemini 3 Flash</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded">Mais Rápido</span>
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-60 text-slate-400">Ideal para monitoramento em tempo real e revisões gramaticais rápidas.</p>
                </button>
                <button 
                  onClick={() => setModel('gemini-3-pro-preview')}
                  className={`p-4 rounded-2xl border text-left transition-all ${model === 'gemini-3-pro-preview' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-white/5 bg-slate-950/50 text-slate-500 hover:border-white/10'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">Gemini 3 Pro</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded">Investigativo</span>
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-60 text-slate-400">Raciocínio complexo para análise profunda de pautas e licitações.</p>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sensibilidade Criativa</label>
                <span className="text-xs font-mono font-bold text-blue-400">{creativity}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={creativity}
                onChange={(e) => setCreativity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[8px] font-black text-slate-700 uppercase">
                <span>Factual / Estrito</span>
                <span>Narrativo / Fluído</span>
              </div>
            </div>
          </div>
        </section>

        {/* Configurações de Monitoramento Regional */}
        <section className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-8 backdrop-blur-sm">
          <div className="flex items-center gap-4 text-emerald-500">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <Map size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Geofencing Editorial</h3>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cidades em Monitoramento Ativo</label>
            <div className="flex flex-wrap gap-2">
              {availableCities.map(city => (
                <button
                  key={city}
                  onClick={() => toggleRegion(city)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${regions.includes(city) ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-950/50 border-white/5 text-slate-600 hover:border-white/20'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                <ShieldCheck size={14} className="text-emerald-500" /> Validação Regional Ativa
             </div>
             <div className="w-10 h-5 bg-emerald-500/20 border border-emerald-500/30 rounded-full relative p-1 cursor-pointer">
                <div className="w-3 h-3 bg-emerald-500 rounded-full absolute right-1"></div>
             </div>
          </div>
        </section>

        {/* Fontes e Whitelist */}
        <section className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-8 backdrop-blur-sm lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-orange-500">
              <div className="p-3 bg-orange-500/10 rounded-2xl">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Fontes e Indexadores</h3>
                <p className="text-xs text-slate-500">Portais prioritários para o scanner regional.</p>
              </div>
            </div>
            
            <div className="flex gap-2">
               <input 
                type="text" 
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSource()}
                placeholder="novo-portal.com.br"
                className="bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-orange-500/50 min-w-[200px]"
               />
               <button onClick={addSource} className="bg-orange-500 hover:bg-orange-400 text-slate-950 p-2 rounded-xl transition-all">
                  <Plus size={20} />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map(source => (
              <div key={source} className="group bg-slate-950/80 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:border-orange-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-600 group-hover:text-orange-500">
                    <Database size={14} />
                  </div>
                  <span className="text-xs font-mono text-slate-400">{source}</span>
                </div>
                <button 
                  onClick={() => removeSource(source)}
                  className="p-2 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="pt-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
             <AlertCircle size={12} className="text-orange-500/50" /> Clique em "Salvar Alterações" para aplicar as novas fontes ao Scanner de Notícias.
          </div>
        </section>
      </div>

      <footer className="bg-blue-600/5 border border-blue-500/10 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600/10 rounded-3xl text-blue-500">
               <Eye size={32} />
            </div>
            <div className="space-y-1">
               <h4 className="text-white font-bold text-lg">Modo de Alta Visibilidade</h4>
               <p className="text-slate-500 text-sm">Ajusta o contraste e as fontes para leitura rápida em ambientes de redação (Newsroom Mode).</p>
            </div>
         </div>
         <button className="whitespace-nowrap px-8 py-3 bg-slate-950 border border-blue-500/20 text-blue-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all">
            Ativar Interface Pro
         </button>
      </footer>
    </div>
  );
};

// Componente simples para ícone de alerta
const AlertCircle = ({ size, className }: { size: number, className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

export default SettingsView;
