
import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Hash,
  ArrowRight
} from 'lucide-react';
import { generateHeadlinesFromPitch } from '../services/geminiService';

const HeadlineGenerator: React.FC = () => {
  const [pitch, setPitch] = useState('');
  const [loading, setLoading] = useState(false);
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!pitch.trim()) return;
    setLoading(true);
    setHeadlines([]);
    try {
      const result = await generateHeadlinesFromPitch(pitch);
      setHeadlines(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getStyleLabel = (index: number) => {
    switch(index) {
      case 0: return 'Informativa';
      case 1: return 'Impactante';
      case 2: return 'Provocativa';
      default: return 'Alternativa';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-500 text-[10px] font-black uppercase tracking-widest">
            <PenTool size={12} /> Newsroom Factory
          </div>
          <h2 className="text-5xl font-serif font-bold text-white tracking-tight">Gerador de Manchete</h2>
          <p className="text-slate-500 text-xl max-w-xl"> Insira o texto da pauta abaixo para gerar opções otimizadas.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Pitch Input Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={14} className="text-blue-500" /> Contexto da Pauta
            </h3>
          </div>

          <div className="relative">
            <textarea 
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Insira sua Pauta aqui !!! "
              className="w-full h-80 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 text-slate-200 text-lg leading-relaxed outline-none focus:border-blue-500/50 transition-all shadow-inner placeholder:text-slate-700 resize-none"
            />
            <div className="absolute bottom-6 right-8 text-[10px] font-black text-slate-600 uppercase">
              {pitch.length} caracteres
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !pitch.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
            Gerar 3 Versões
          </button>
        </section>

        {/* Results Section */}
        <section className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
            <Hash size={14} className="text-blue-500" /> Resultados (Máximo de 50 Characteres)
          </h3>

          {loading ? (
            <div className="h-80 bg-slate-900/30 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center p-12 space-y-4">
              <Loader2 size={48} className="text-blue-500 animate-spin" />
              <p className="text-xs font-black text-slate-600 uppercase tracking-widest text-center">
                Destilando a pauta para o limite técnico...
              </p>
            </div>
          ) : headlines.length > 0 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              {headlines.map((headline, index) => (
                <div key={index} className="bg-slate-900 border border-white/5 rounded-3xl p-6 hover:border-blue-500/30 transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest px-2 py-0.5 bg-blue-500/10 rounded">
                      {getStyleLabel(index)}
                    </span>
                    <div className="flex items-center gap-1.5">
                       <span className={`text-[10px] font-black font-mono ${headline.length > 45 ? 'text-orange-500' : 'text-slate-500'}`}>
                        {headline.length}/50
                       </span>
                    </div>
                  </div>

                  <p className="text-lg font-bold text-white font-mono tracking-tight leading-snug mb-4 uppercase">
                    {headline}
                  </p>

                  <button 
                    onClick={() => copyToClipboard(headline, index)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-black text-slate-500 uppercase hover:text-white hover:bg-blue-600 transition-all"
                  >
                    {copiedIndex === index ? (
                      <><CheckCircle2 size={14} /> Copiado</>
                    ) : (
                      <><Copy size={14} /> Copiar Manchete</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-80 bg-slate-900/30 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center space-y-4">
              <PenTool size={48} className="text-slate-800" />
              <div className="space-y-2">
                <p className="text-white font-bold">Fábrica de Manchetes Ociosa</p>
                <p className="text-slate-600 text-xs max-w-xs mx-auto">
                  Insira o texto da pauta ao lado para gerar opções otimizadas.
                </p>
              </div>
            </div>
          )}

          <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-[2rem] flex gap-4">
             <AlertCircle size={24} className="text-orange-500 shrink-0" />
             <p className="text-[10px] text-slate-500 leading-relaxed italic">
                Nota Técnica: Manchetes de até 50 caracteres (...) .
             </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeadlineGenerator;
