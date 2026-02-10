
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  FileEdit,
  Users,
  Shield,
  Target,
  PenTool
} from 'lucide-react';
import { ViewType, User } from '../types';
import { RADAR_LOGO_SVG } from '../constants';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, user }) => {
  const VANGUARDA_LOGO = "https://upload.wikimedia.org/wikipedia/pt/thumb/0/09/Logotipo_da_Rede_Vanguarda.png/250px-Logotipo_da_Rede_Vanguarda.png";
  
  const [imgSrc, setImgSrc] = useState(VANGUARDA_LOGO);
  const [isFallback, setIsFallback] = useState(false);

  const handleImgError = () => {
    if (!isFallback) {
      setImgSrc(RADAR_LOGO_SVG);
      setIsFallback(true);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Scanner de Notícias', icon: LayoutDashboard },
    { id: 'headline-generator', label: 'Gerador de Manchete', icon: PenTool },
    { id: 'headline-predictor', label: 'Analisador de Pauta', icon: Target },
    { id: 'correction', label: 'Revisão Editorial', icon: FileEdit },
    { id: 'pitches', label: 'Planejamento de Pautas', icon: FileText },
    { id: 'profile', label: 'Configurações', icon: Settings },
  ];

  menuItems.push({ id: 'admin-users', label: 'Gestão de Redação', icon: Users });

  return (
    <div className="w-64 bg-slate-950 text-white h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800">
      <div className="p-8 flex flex-col items-center gap-4 border-b border-slate-800 bg-slate-900/50">
        <div className="w-full flex items-center justify-center min-h-[100px] relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-75 opacity-20"></div>
              <img 
                src={imgSrc} 
                alt="Radar Vanguarda Notícias IA" 
                onError={handleImgError}
                className={`w-24 h-24 relative z-10 object-contain transition-all duration-500 group-hover:scale-110 ${isFallback ? 'drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'brightness-110'}`}
              />
            </div>
        </div>
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold leading-tight text-white">
            Radar Vanguarda
          </h1>
          <span className="text-[10px] font-sans font-black tracking-[0.3em] text-blue-500 uppercase">Notícias Regionais</span>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500' 
                  : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon size={18} className={currentView === item.id ? 'text-blue-400' : ''} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center font-bold text-sm shadow-lg text-white uppercase">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">{user.name}</p>
            <div className="flex items-center gap-1">
              <Shield size={8} className="text-purple-400" />
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Acesso Direto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
