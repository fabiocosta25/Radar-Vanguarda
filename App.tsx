
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PitchGenerator from './components/PitchGenerator';
import EditorialCorrectionView from './components/EditorialCorrection';
import AdminUsers from './components/AdminUsers';
import SettingsView from './components/SettingsView';
import HeadlinePredictor from './components/HeadlinePredictor';
import HeadlineGenerator from './components/HeadlineGenerator';
import { ViewType, User } from './types';
import { authService } from './services/authService';
import { Bell, Activity, Zap, Loader2 } from 'lucide-react';

const DEFAULT_USER: User = {
  id: '1',
  name: 'Diretor Editorial',
  email: 'diretoria@radar.ia',
  role: 'admin'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await authService.initialize();
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin mb-4" size={48} />
        <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Sincronizando Terminal...</p>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'pitches': return <PitchGenerator />;
      case 'correction': return <EditorialCorrectionView />;
      case 'admin-users': return <AdminUsers />;
      case 'profile': return <SettingsView />;
      case 'headline-predictor': return <HeadlinePredictor />;
      case 'headline-generator': return <HeadlineGenerator />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex selection:bg-blue-500 selection:text-white">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={DEFAULT_USER}
      />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 relative">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <span className="hover:text-slate-300 cursor-pointer transition-colors" onClick={() => setCurrentView('dashboard')}>Radar Vanguarda</span>
            <span className="text-slate-700">/</span>
            <span className="text-blue-500">{currentView.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
              <Activity size={12} className="text-emerald-500" /> Cobertura em Tempo Real
            </div>
            <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-slate-800">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <div className="h-6 w-[1px] bg-slate-800"></div>
            <div className="w-10 h-10 rounded-full bg-purple-600 border border-slate-800 flex items-center justify-center overflow-hidden hover:opacity-80 transition-all cursor-pointer shadow-lg" onClick={() => setCurrentView('profile')}>
              <span className="text-white font-black text-xs">{DEFAULT_USER.name.charAt(0)}</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      <div className="fixed bottom-10 right-10">
        <button className="bg-blue-600/10 text-blue-500 border border-blue-500/20 px-6 py-4 rounded-3xl shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:bg-blue-600 hover:text-white transition-all hover:scale-105 active:scale-95 group flex items-center gap-3 backdrop-blur-md">
          <Zap size={24} />
          <span className="font-black text-sm tracking-tighter uppercase">Plantão Regional</span>
        </button>
      </div>
    </div>
  );
};

export default App;
