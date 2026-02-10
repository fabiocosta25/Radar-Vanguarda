
import React, { useState } from 'react';
import { Globe, RefreshCcw, Loader2, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { compareNewsSources } from '../services/geminiService';
import { NewsItem } from '../types';

const NewsComparison: React.FC = () => {
  const [loading, setLoading] = useState(false);
  // Fix: Align state type with compareNewsSources return value
  const [analysis, setAnalysis] = useState<{ rawBriefing: string; news: NewsItem[] } | null>(null);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const result = await compareNewsSources();
      setAnalysis(result);
    } catch (error) {
      console.error("Erro ao comparar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
            <MapPin size={12} /> Foco Regional Ativado
          </div>
          <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Monitoramento Cruzado</h2>
          <p className="text-slate-500 text-lg">
            Vale do Paraíba, Região Bragantina e Litoral Norte: <span className="text-blue-400">AquiVale</span> vs <span className="text-blue-400">OVale</span>.
          </p>
        </div>
        <button 
          onClick={handleCompare}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCcw size={20} />}
          Sincronizar Fontes
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800">
            <Globe className="text-slate-400" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Portal Principal 01</p>
            <p className="text-white font-bold">portalaquivale.com.br</p>
          </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800">
            <Globe className="text-slate-400" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Portal Principal 02</p>
            <p className="text-white font-bold">sampi.net.br/ovale</p>
          </div>
        </div>
      </div>

      {!analysis && !loading && (
        <div className="bg-slate-900 p-20 rounded-[3rem] border border-slate-800 border-dashed text-center space-y-4">
          <Globe size={48} className="mx-auto text-slate-800" />
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            A IA analisará as notícias de hoje com foco no Vale do Paraíba, Bragantina e Litoral Norte para identificar divergências e furos.
          </p>
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          <div className="h-64 bg-slate-900 rounded-[3rem] border border-slate-800 animate-pulse flex items-center justify-center">
             <div className="flex flex-col items-center gap-4 text-slate-600 text-center px-6">
                <Loader2 size={32} className="animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest">Cruzando dados regionais e detectando pautas quentes...</p>
             </div>
          </div>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl prose prose-invert prose-blue max-w-none">
            <div className="flex items-center gap-2 mb-8 text-blue-500">
               <ShieldCheck size={20} />
               <span className="text-xs font-black uppercase tracking-widest">Análise Regional Gerada por IA Grounding</span>
            </div>
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-lg">
               {analysis.rawBriefing}
            </div>
          </div>

          {analysis.news.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest px-2">Links Regionais Verificados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.news.map((item, i) => (
                  <a 
                    key={item.id || i} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{item.title || 'Referência Regional'}</p>
                      <p className="text-slate-600 text-[10px] truncate">{item.url}</p>
                    </div>
                    <ExternalLink size={14} className="text-slate-500 group-hover:text-blue-500 ml-3" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsComparison;
