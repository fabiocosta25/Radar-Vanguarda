
import React from 'react';
import { Cpu, Network, ShieldCheck, Zap, Layers, Terminal } from 'lucide-react';

const ArchitectureInfo: React.FC = () => {
  const sections = [
    {
      title: "1. Fluxo de Dados (Pipeline)",
      icon: Network,
      content: "Arquitetura distribuída com scrapers resilientes que monitoram Diários Oficiais via APIs REST e integração direta com sistemas públicos. Dados brutos são normalizados em armazenamento de alta disponibilidade."
    },
    {
      title: "2. Motor de IA Multimodal",
      icon: Cpu,
      content: "Gemini 3 Flash atua na triagem de volume, enquanto Gemini 3 Pro analisa cláusulas complexas. Otimização de janela de contexto para cruzar documentos de centenas de páginas."
    },
    {
      title: "3. Heurísticas de Risco",
      icon: Layers,
      content: "Algoritmos proprietários para detectar padrões de gasto e conexões ocultas. Pontuação de confiança calibrada via feedback jornalístico contínuo."
    },
    {
      title: "4. Protocolo de Veracidade",
      icon: ShieldCheck,
      content: "Sistema de validação cruzada que exige citação direta da fonte original. A IA sugere caminhos, mas o selo de 'Publicado' depende exclusivamente da validação humana."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-blue-500 text-[10px] font-black uppercase tracking-widest">
            <Terminal size={12} /> Pilha Tecnológica v2.5
          </div>
          <h2 className="text-5xl font-serif font-bold text-white tracking-tight">Especificação do Sistema</h2>
          <p className="text-slate-500 text-xl max-w-xl">O Radar Vanguarda analisa as notícias que estão em alta no Vale do Paraíba e Região.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Disponibilidade da Rede</p>
            <p className="text-2xl font-black text-emerald-500">99.98%</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {sections.map((sec, i) => (
          <div key={i} className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <sec.icon size={120} />
            </div>
            <div className="w-16 h-16 bg-slate-950 text-blue-500 rounded-3xl flex items-center justify-center mb-8 border border-slate-800 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl shadow-blue-500/5">
              <sec.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">{sec.title}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{sec.content}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 p-12 rounded-[3.5rem] border border-blue-500/20 space-y-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <h3 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
          <Zap className="text-yellow-400 fill-yellow-400" /> Sustentabilidade e Integração
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {[
            { title: "SaaS Corporativo", desc: "Instância isolada para grandes redações com retenção de dados ilimitada e segurança crítica." },
            { title: "API de Inteligência", desc: "Acessos para ferramentas de BI e monitoramento de políticas públicas em tempo real." },
            { title: "Núcleo Aberto", desc: "Versão comunitária para pequenos veículos locais, democratizando a tecnologia de apuração." }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-slate-950/80 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all shadow-2xl">
              <h4 className="font-black text-sm text-blue-400 mb-3 uppercase tracking-widest">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureInfo;
