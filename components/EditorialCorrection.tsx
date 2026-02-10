
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Type as FontIcon, 
  Eraser, 
  Sparkles, 
  Loader2, 
  Copy, 
  FileCheck
} from 'lucide-react';
import { correctEditorialText } from '../services/geminiService';
import { EditorialCorrection } from '../types';

const EditorialCorrectionView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EditorialCorrection | null>(null);

  const handleCorrection = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const data = await correctEditorialText(inputText);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setInputText('');
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <header className="flex items-center justify-between border-b border-slate-900 pb-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Revisão Editorial</h2>
          <p className="text-slate-500 text-lg">Módulo de ortografia, gramática e adequação de tom jornalístico.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={clear}
            className="p-4 bg-slate-900 text-slate-400 hover:text-white rounded-2xl border border-slate-800 transition-all"
            title="Limpar editor"
          >
            <Eraser size={20} />
          </button>
          <button 
            onClick={handleCorrection}
            disabled={loading || !inputText}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            Analisar Pauta
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Editor Area */}
        <div className="space-y-4">
           <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <FontIcon size={14} className="text-blue-500" /> Texto Original
          </label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Cole sua pauta ou matéria aqui para revisão..."
            className="w-full h-[600px] bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-slate-200 text-lg leading-relaxed outline-none focus:border-blue-500/50 transition-all shadow-inner placeholder:text-slate-700 resize-none"
          />
        </div>

        {/* Results Area */}
        <div className="space-y-8">
          {!result && !loading && (
            <div className="h-[600px] bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-4">
               <div className="p-6 bg-slate-900 rounded-full border border-slate-800 text-slate-700">
                  <FileCheck size={48} />
               </div>
               <p className="text-slate-500 font-medium max-w-xs">Aguardando entrada de texto para iniciar a varredura editorial por IA.</p>
            </div>
          )}

          {loading && (
            <div className="h-[600px] bg-slate-900/50 rounded-[2.5rem] border border-slate-800 animate-pulse flex flex-col items-center justify-center space-y-4">
               <Loader2 className="animate-spin text-blue-500" size={40} />
               <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Processando regras de estilo...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={14} /> Texto Sugerido
                  </label>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.correctedText)}
                    className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase hover:text-white transition-colors"
                  >
                    <Copy size={12} /> Copiar Texto
                  </button>
                </div>
                <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 text-lg leading-relaxed italic">
                  {result.correctedText}
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                   <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{width: `${result.journalisticToneScore}%`}}></div>
                   </div>
                   <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Tom Jornalístico: {result.journalisticToneScore}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-500/5 p-8 rounded-[2rem] border border-red-500/10 space-y-4">
                  <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={14} /> Ajustes Técnicos
                  </h4>
                  <ul className="space-y-3">
                    {result.errorsFound.map((err, i) => (
                      <li key={i} className="text-xs text-slate-400 flex gap-2">
                        <span className="text-red-500">•</span> {err}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-500/5 p-8 rounded-[2rem] border border-blue-500/10 space-y-4">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} /> Sugestões de Estilo
                  </h4>
                  <ul className="space-y-3">
                    {result.styleSuggestions.map((sug, i) => (
                      <li key={i} className="text-xs text-slate-400 flex gap-2">
                        <span className="text-blue-500">•</span> {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorialCorrectionView;
