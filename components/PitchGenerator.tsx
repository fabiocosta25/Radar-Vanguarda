
import React, { useState } from 'react';
import { Sparkles, FileText, Send, Loader2, Plus, Zap } from 'lucide-react';
import { generateJournalisticPitch } from '../services/geminiService';
import { EditorialPitch, EditorialProfile } from '../types';

const PitchGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState<EditorialPitch | null>(null);

  const profile: EditorialProfile = {
    region: 'vale',
    vehicleType: 'digital',
    editorialLine: 'geral',
    priorityThemes: ['Geral', 'Serviços'],
    targetAudience: 'População Regional'
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const result = await generateJournalisticPitch(topic, profile);
      setPitch({ ...result, id: Math.random().toString(), tags: ['IA', 'Planejamento'] });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-20">
      <header className="text-center space-y-6">
        <div className="inline-flex p-4 bg-blue-600/20 text-blue-500 rounded-3xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <Sparkles size={40} className="animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-5xl font-serif font-bold text-white tracking-tight">Cérebro Editorial</h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Transforme temas gerais em pautas estruturadas e prontas para cobertura.</p>
        </div>
      </header>

      <div className="bg-slate-900 p-2 rounded-[2.5rem] border border-slate-800 shadow-2xl flex items-center group focus-within:border-blue-500/50 transition-all focus-within:shadow-[0_0_40px_rgba(59,130,246,0.1)]">
        <div className="pl-6 text-slate-600 group-focus-within:text-blue-500 transition-colors">
          <Zap size={24} />
        </div>
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Qual o tema da próxima matéria? Ex: Festivais de Inverno"
          className="flex-1 px-6 py-6 bg-transparent outline-none text-xl text-white placeholder:text-slate-600"
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          Estruturar
        </button>
      </div>

      {pitch && (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="p-10 bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800">
            <div className="flex justify-between items-start mb-8">
              <span className="text-[10px] font-black px-4 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full uppercase tracking-[0.2em]">Pauta Estruturada</span>
              <button className="text-xs font-black text-slate-500 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <Plus size={16} /> Salvar no Planner
              </button>
            </div>
            <h3 className="text-5xl font-serif font-bold text-white mb-6 leading-tight">{pitch.title}</h3>
            <p className="text-slate-400 text-xl leading-relaxed max-w-4xl">{pitch.context}</p>
          </div>

          <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <section>
                <h4 className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Perguntas Essenciais
                </h4>
                <ul className="space-y-5">
                  {pitch.keyQuestions.map((q, i) => (
                    <li key={i} className="flex gap-4 text-slate-300 text-lg leading-relaxed group">
                      <span className="font-black text-blue-500 bg-blue-500/5 w-8 h-8 rounded-lg flex items-center justify-center border border-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-all">{i + 1}</span>
                      <span className="flex-1 pt-0.5">{q}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Sugestão de Fontes
                </h4>
                <div className="flex flex-wrap gap-3">
                  {pitch.recommendedSources.map((s, i) => (
                    <span key={i} className="bg-slate-950 px-5 py-3 rounded-2xl text-sm text-slate-400 font-bold border border-slate-800 hover:border-slate-700 transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-12">
              <section className="bg-slate-950 p-10 rounded-[2.5rem] border border-slate-800 shadow-inner">
                <h4 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-8">Formatos de Matéria</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pitch.suggestedFormats.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 text-white font-bold bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all group">
                      <div className="p-2 bg-slate-950 rounded-lg group-hover:bg-blue-600 transition-colors">
                        <FileText size={18} className="text-blue-500 group-hover:text-white" />
                      </div>
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-10 border border-slate-800 rounded-[2.5rem] bg-slate-900/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Alcance Estimado</span>
                  <span className="font-black text-sm uppercase text-blue-400 bg-blue-400/10 px-4 py-1.5 rounded-full border border-blue-400/20">{pitch.impactLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Prioridade Editorial</span>
                  <span className="font-black text-sm uppercase text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">{pitch.urgency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchGenerator;
