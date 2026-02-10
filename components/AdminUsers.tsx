
import React from 'react';
import { Users, Shield, User as UserIcon, MoreVertical, Search, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';

const AdminUsers: React.FC = () => {
  const users = authService.getUsers();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-500 text-[10px] font-black uppercase tracking-widest">
            <Shield size={12} /> Console Administrativo
          </div>
          <h2 className="text-5xl font-serif font-bold text-white tracking-tight">Gestão de Redação</h2>
          <p className="text-slate-500 text-xl max-w-xl">Gerencie permissões e visualize a atividade da equipe editorial em tempo real.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/20 transition-all flex items-center gap-3">
          <UserPlus size={18} /> Novo Usuário
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Equipe</p>
           <p className="text-3xl font-black text-white">{users.length}</p>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Administradores</p>
           <p className="text-3xl font-black text-purple-500">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Editores Ativos</p>
           <p className="text-3xl font-black text-blue-500">{users.filter(u => u.role === 'editor').length}</p>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Status Sistema</p>
           <p className="text-3xl font-black text-emerald-500">Normal</p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Users size={16} /> Diretório de Usuários
          </h3>
          <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
             <input type="text" placeholder="Filtrar equipe..." className="bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-purple-500/50" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Membro</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Nível</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">E-mail</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${u.role === 'admin' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'} flex items-center justify-center font-black`}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-500">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      u.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-400 font-medium">
                    {u.email}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
