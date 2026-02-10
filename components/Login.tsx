
import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ChevronRight, 
  AlertCircle, 
  Loader2, 
  User as UserIcon, 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { authService } from '../services/authService';
import { RADAR_LOGO_SVG } from '../constants';
import { UserRole } from '../types';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('editor');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (isRegistering && name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres.');
      return false;
    }
    if (!email.includes('@')) {
      setError('Por favor, insira um e-mail válido.');
      return false;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    // Simulação de delay de rede
    setTimeout(() => {
      if (isRegistering) {
        const user = authService.register(name, email, password, role);
        if (user) {
          setSuccess('Conta criada com sucesso! Redirecionando...');
          setTimeout(onLoginSuccess, 1000);
        } else {
          setError('Este e-mail já está em uso ou ocorreu um erro no banco.');
          setLoading(false);
        }
      } else {
        const user = authService.login(email, password);
        if (user) {
          onLoginSuccess();
        } else {
          setError('Acesso negado. E-mail ou senha incorretos.');
          setLoading(false);
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
              <img src={RADAR_LOGO_SVG} alt="Radar Logo" className="w-20 h-20 object-contain relative z-10 drop-shadow-2xl" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight">
              {isRegistering ? 'Nova Credencial' : 'Terminal de Redação'}
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-1">
              Radar Regional IA
            </p>
            <div className="h-0.5 w-12 bg-blue-600 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {isRegistering && (
                <div className="relative group animate-in slide-in-from-top-2">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    required
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail funcional"
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  required
                />
              </div>

              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegistering ? "Crie uma senha forte" : "Sua senha secreta"}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isRegistering && (
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 animate-in fade-in duration-500">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Shield size={12} className="text-blue-500" /> Nível Editorial
                  </p>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setRole('editor')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${role === 'editor' ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                    >
                      Editor
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${role === 'admin' ? 'bg-purple-600/10 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                    >
                      Diretor
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!isRegistering && (
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700 group-hover:border-blue-500/50 transition-all flex items-center justify-center">
                    <div className="w-2 h-2 rounded-sm bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Lembrar acesso</span>
                </label>
                <button type="button" className="text-[11px] font-bold text-blue-500/60 hover:text-blue-400 uppercase tracking-widest transition-colors">Esqueci a senha</button>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-semibold animate-in slide-in-from-top-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-500 text-xs font-semibold animate-in slide-in-from-top-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>{isRegistering ? 'Confirmar Registro' : 'Acessar Central'} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
                setPassword('');
              }}
              className="text-[11px] font-black text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-[0.2em]"
            >
              {isRegistering ? 'Voltar para o Login' : 'Solicitar Novo Cadastro'}
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest mb-1">Criptografia Ponta-a-Ponta</p>
            <p className="text-[9px] text-slate-800">Sua sessão é protegida por protocolos de inteligência regional.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
