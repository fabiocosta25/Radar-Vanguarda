
import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Globe,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Clock,
  MapPin,
  TrendingUp,
  BarChart3,
  Waves,
  MousePointer2,
  Newspaper,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { RADAR_LOGO_SVG } from '../constants';
import { compareNewsSources } from '../services/geminiService';
import { NewsItem, NewsTrends } from '../types';

const Dashboard: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [trends, setTrends] = useState<NewsTrends | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('--:--');
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [activeSources, setActiveSources] = useState<string[]>([]);

  const loadingMessages = [
    "Acessando canais de Breaking News...",
    "Filtrando fatos das últimas 3 horas...",
    "Validando links diretos de matérias...",
    "Finalizando Varredura Flash..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhase(prev => (prev + 1) % loadingMessages.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const savedSources = localStorage.getItem('radar_sources');
    if (savedSources) {
      setActiveSources(JSON.parse(savedSources));
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const savedSources = localStorage.getItem('radar_sources');
      const sourcesToUse = savedSources ? JSON.parse(savedSources) : [];
      
      const result = await compareNewsSources("Vale do Paraíba e Região, SP", sourcesToUse);
      setNews(result.news);
      setTrends(result.trends);
      setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      setError("Erro ao carregar notícias. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryColor = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('segurança')) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (c.includes('política')) return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    if (c.includes('economia')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (c.includes('saúde')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  const getTrendLabel = (key: string) => {
    const labels: Record<string, string> = {
      politics: 'Política',
      economy: 'Economia',
      security: 'Segurança',
      health: 'Saúde',
      education: 'Educação'
    };
    return labels[key] || key;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto pb-24">
      <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-start gap-6">
          <div className="relative shrink-0">
            <div className={`absolute inset-0 bg-blue-500/30 rounded-full blur-xl ${loading ? 'animate-pulse' : ''}`}></div>
            <img src={RADAR_LOGO_SVG} alt="Radar Vanguarda" className="h-20 w-20 relative z-10" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-5xl font-serif font-bold text-white tracking-tight">Scanner Regional</h2>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <Zap size={12} className="text-yellow-400" /> Breaking News
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm font-medium">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500" /> Vale do Paraíba e Litoral</span>
              <span className="w-1 h-1 rounded-full bg-slate-800"></span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> {activeSources.length} Fontes Independentes</span>
            </div>
          </div>
        </div>

        <div className="flex items-stretch gap-3">
          <div className="bg-slate-900/60 p-4 rounded-3xl border border-white/5 flex flex-col justify-center min-w-[120px]">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Rede</span>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               <span className="text-white font-mono font-bold text-sm">FLASH ACTIVE</span>
            </div>
          </div>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-3xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center shadow-lg shadow-blue-600/20"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Alerta de Fontes Personalizadas */}
      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-[2rem] flex flex-wrap gap-3 items-center">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mr-2">Canais Monitorados (3h):</span>
        {activeSources.map(s => (
          <span key={s} className="px-3 py-1 bg-slate-950 rounded-lg text-[9px] font-bold text-blue-400 border border-white/5">
            {s}
          </span>
        ))}
      </div>

      <section className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 group-hover:opacity-10 transition-opacity">
           <BarChart3 size={200} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          <div className="lg:w-1/3 space-y-6">
            <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <TrendingUp size={16} /> Volume Instantâneo
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed font-medium">
              Analítica de publicações recentes em portais regionais independentes.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Média Latência</span>
                  <span className="text-xl font-bold text-white tracking-tighter">Fast Scan</span>
               </div>
               <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Scanner às</span>
                  <span className="text-xl font-bold text-emerald-500 tracking-tighter">{lastUpdate}</span>
               </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <div className="flex items-end justify-between gap-4 h-48 px-4">
              {trends && Object.entries(trends).filter(([key]) => key !== 'totalVolume').map(([key, value], i) => (
                <div key={key} className="flex-1 flex flex-col items-center gap-3 group/bar">
                  <div className="w-full relative flex flex-col justify-end h-full">
                     <div 
                      className={`w-full rounded-t-xl transition-all duration-1000 delay-${i*100} ease-out ${
                        key === 'politics' ? 'bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' :
                        key === 'economy' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
                        key === 'security' ? 'bg-red-500 shadow-[0_0_20_rgba(239,68,68,0.3)]' :
                        'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                      }`}
                      style={{ height: loading ? '0%' : `${(Number(value) / (Math.max(trends.totalVolume, 1))) * 100}%`, minHeight: Number(value) > 0 ? '15%' : '4px' }}
                    >
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate w-full text-center">
                    {getTrendLabel(key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Globe size={14} /> Resultados de Busca (Links Diretos)
          </h3>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            {news.length} Artigos Verificados
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 h-80 animate-pulse p-8 space-y-4">
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="h-10 bg-slate-800 rounded w-full"></div>
                <div className="h-24 bg-slate-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div 
                key={item.id} 
                className="group bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-blue-500/30 rounded-[2.5rem] p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 shadow-2xl relative overflow-hidden h-full"
              >
                <div 
                  className="absolute right-0 top-0 w-1 bg-blue-500 transition-all duration-700"
                  style={{ height: `${item.impactScore}%` }}
                ></div>
                
                <header className="mb-6 flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border w-fit ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <Clock size={12} /> {item.timeAgo}
                    </div>
                  </div>
                </header>

                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:text-blue-400 transition-colors"
                >
                  <h3 className="text-xl font-bold text-white mb-4 leading-tight font-serif line-clamp-3">
                    {item.title}
                  </h3>
                </a>
                
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 mb-8">
                  {item.summary}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter truncate max-w-[150px]">
                      <Globe size={12} className="shrink-0" />
                      {item.domain}
                    </div>
                    <div className="text-[9px] font-bold text-slate-700 bg-slate-950 px-2 py-1 rounded border border-white/5">
                       {item.impactScore}% Relevância
                    </div>
                  </div>
                  
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-slate-950 group-hover:bg-blue-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
                  >
                    Ler Matéria <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/30 border-2 border-dashed border-white/5 rounded-[3rem] p-24 text-center">
            <Newspaper size={64} className="mx-auto text-slate-800 mb-6" />
            <h3 className="text-2xl font-serif font-bold text-slate-500">Nenhum artigo detectado (3h)</h3>
            <p className="text-slate-600 text-sm mt-2">O motor Flash não encontrou publicações independentes recentes. Refine as fontes nas configurações.</p>
            <button onClick={fetchData} className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-transform">Nova Varredura</button>
          </div>
        )}
      </section>

      {loading && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
           <div className="bg-blue-600 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4">
              <RefreshCw size={20} className="animate-spin" />
              <span className="text-xs font-black uppercase tracking-widest">{loadingMessages[loadingPhase]}</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
