
import React, { useState } from 'react';
import { 
  Target, 
  Scale, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Trash2, 
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';
import { analyzeHeadlines } from '../services/geminiService';
import { HeadlineAnalysis } from '../types';

const HeadlinePredictor: React.FC = () => {
  const [headlineInputs, setHeadlineInputs] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HeadlineAnalysis[]>([]);

  const addField = () => {
    if (headlineInputs.length < 3) {
      setHeadlineInputs([...headlineInputs, '']);
    }
  };

  const removeField = (index: number) => {
    const newFields = [...headlineInputs];
    newFields.splice(index, 1);
    setHeadlineInputs(newFields);
  };

  const handleInputChange = (index: number, value: string) => {
    const newFields = [...headlineInputs];
    newFields[index] = value;
    setHeadlineInputs(newFields);
  };

  const handleAnalyze = async () => {
    const validHeadlines = headlineInputs.filter(h => h.trim().length > 5);
    if (validHeadlines.length === 0) return;

    setLoading(true);
    try {
      const data = await analyzeHeadlines(validHeadlines);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-500 text-[10px] font-black uppercase tracking-widest">
            <Target size={12} /> Editorial Labs
          </div>
          <h2 className="text-5xl font-serif font-bold text-white tracking-tight">Analisador de Pauta</h2>
          <p className="text-slate-500 text-xl max-w-xl">Preveja o impacto e valide a ética das suas manchetes antes da publicação.</p>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={loading || headlineInputs.every(h => h.trim().length < 5)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
          Iniciar Simulação
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input Side */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Plus size={14} /> Variações de Título
            </h3>
            {headlineInputs.length < 3 && (
              <button onClick={addField} className="text-[10px] font-black text-blue-500 hover:text-white transition-colors uppercase tracking-widest">
                + Adicionar Variação
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {headlineInputs.map((input, index) => (
              <div key={index} className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 group-focus-within:bg-blue-600 group-focus-within:text-white transition-all">
                  {index + 1}
                </div>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder="Digite sua manchete aqui..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-[1.5rem] py-6 pl-20 pr-16 text-white text-lg placeholder:text-slate-700 focus:border-blue-500/50 outline-none transition-all"
                />
                {headlineInputs.length > 1 && (
                  <button 
                    onClick={() => removeField(index)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
             <div className="flex items-center gap-3 text-orange-500 mb-2">
                <AlertCircle size={20} />
                <h4 className="font-bold text-sm">Diretrizes do Lab</h4>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed">
                Nossa IA avalia o engajamento através de gatilhos psicológicos regionais, mas prioriza o **Índice Ético**. Manchetes com nota ética abaixo de 60 são marcadas como sensacionalistas.
             </p>
          </div>
        </section>

        {/* Results Side */}
        <section className="space-y-8">
           {loading ? (
             <div className="h-full bg-slate-900/30 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center p-20 gap-4">
                <div className="relative">
                   <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                   <Loader2 size={48} className="text-blue-500 animate-spin relative z-10" />
                </div>
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest text-center max-w-xs">
                  Aguarde. O Gemini Pro está simulando a reação do público e analisando vieses éticos...
                </p>
             </div>
           ) : results.length > 0 ? (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                {results.map((res, i) => (
                  <div key={i} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6 hover:border-blue-500/30 transition-all relative overflow-hidden group">
                     {/* Leader Badge */}
                     {i === 0 && (
                       <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                          Recomendação Editorial
                       </div>
                     )}

                     <h4 className="text-xl font-bold text-white font-serif leading-tight">"{res.text}"</h4>
                     
                     <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                        <div className="space-y-1">
                           <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                              <TrendingUp size={10} /> Engajamento
                           </div>
                           <p className={`text-2xl font-black ${getMetricColor(res.engagementScore)}`}>{res.engagementScore}%</p>
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                              <Scale size={10} /> Índice Ético
                           </div>
                           <p className={`text-2xl font-black ${getMetricColor(res.ethicsScore)}`}>{res.ethicsScore}%</p>
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                              <Search size={10} /> Clareza
                           </div>
                           <p className={`text-2xl font-black ${getMetricColor(res.clarityScore)}`}>{res.clarityScore}%</p>
                        </div>
                     </div>

                     <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-3">
                        <p className="text-xs text-slate-400 leading-relaxed italic">"{res.critique}"</p>
                        <div className="flex items-center gap-2 text-blue-400">
                           <Sparkles size={14} />
                           <p className="text-[10px] font-bold uppercase tracking-tight">Sugestão: {res.improvement}</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="h-full bg-slate-900/30 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center p-20 text-center space-y-6">
                <Target size={48} className="text-slate-800" />
                <div className="space-y-2">
                  <h4 className="text-white font-bold">Laboratório Vazio</h4>
                  <p className="text-slate-600 text-sm max-w-xs mx-auto">Insira uma ou mais manchetes ao lado para receber uma análise profunda de engajamento e ética.</p>
                </div>
             </div>
           )}
        </section>
      </div>

      {/* Footer Info */}
      <footer className="bg-emerald-500/5 border border-emerald-500/10 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-500/10 rounded-3xl text-emerald-500">
               <CheckCircle2 size={32} />
            </div>
            <div className="space-y-1">
               <h4 className="text-white font-bold text-lg">Validador de Integridade</h4>
               <p className="text-slate-500 text-sm">Nossa IA está calibrada para detectar Gatilhos de Pânico e Clickbait Sensacionalista, protegendo a marca do seu veículo.</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default HeadlinePredictor;
