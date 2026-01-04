
import React, { useState } from 'react';
import { PawPrint, UserPlus, Lock, Store, User, Heart, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface Props {
  onLogin: (role: UserRole, userName?: string, petName?: string) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [view, setView] = useState<'options' | 'customer' | 'adminLogin' | 'adminRegister'>('options');
  const [error, setError] = useState('');
  const [customerData, setCustomerData] = useState({ userName: '', petName: '' });
  const [adminFormData, setAdminFormData] = useState({ name: '', shopName: '', user: '', pass: '', confirmPass: '' });
  const [loginCreds, setLoginCreds] = useState({ user: '', pass: '' });

  const getStoredAdmin = () => JSON.parse(localStorage.getItem('kinho_pet_admin') || 'null');

  const handleAdminRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminFormData.pass !== adminFormData.confirmPass) return setError('Senhas diferentes!');
    localStorage.setItem('kinho_pet_admin', JSON.stringify(adminFormData));
    setView('adminLogin');
    alert('Dono cadastrado!');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = getStoredAdmin();
    if (stored && loginCreds.user === stored.user && loginCreds.pass === stored.pass) {
      onLogin('owner', stored.name);
    } else {
      setError('Acesso negado');
    }
  };

  return (
    <div className="h-screen flex flex-col p-8 justify-between bg-[#0F172A]">
      <div className="text-center mt-10">
        <div className="inline-flex p-4 bg-[#22C55E]/10 rounded-3xl mb-6">
          <PawPrint size={48} className="text-[#22C55E]" />
        </div>
        <h2 className="text-4xl font-black">Kinho <span className="text-[#22C55E]">Pet Shop</span></h2>
      </div>

      <div className="w-full max-w-sm mx-auto">
        {view === 'options' ? (
          <div className="space-y-4">
            <button onClick={() => setView('customer')} className="w-full bg-[#22C55E] py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
              <UserPlus size={20} /> Sou Cliente
            </button>
            <button onClick={() => getStoredAdmin() ? setView('adminLogin') : setView('adminRegister')} className="w-full bg-slate-800 py-4 rounded-2xl font-bold text-slate-300 flex items-center justify-center gap-3">
              <Lock size={18} /> {getStoredAdmin() ? 'Área do Dono' : 'Cadastrar Dono'}
            </button>
          </div>
        ) : view === 'customer' ? (
          <form onSubmit={() => onLogin('customer', customerData.userName, customerData.petName)} className="space-y-4">
             <input required type="text" placeholder="Seu nome" value={customerData.userName} onChange={e => setCustomerData({...customerData, userName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4" />
             <input required type="text" placeholder="Nome do Pet" value={customerData.petName} onChange={e => setCustomerData({...customerData, petName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4" />
             <button type="submit" className="w-full bg-[#22C55E] py-4 rounded-xl font-bold">Entrar</button>
             <button onClick={() => setView('options')} className="w-full text-slate-500 text-sm">Voltar</button>
          </form>
        ) : (
          <form onSubmit={view === 'adminLogin' ? handleAdminLogin : handleAdminRegister} className="space-y-4">
             <input required type="text" placeholder="Usuário" value={view === 'adminLogin' ? loginCreds.user : adminFormData.user} onChange={e => view === 'adminLogin' ? setLoginCreds({...loginCreds, user: e.target.value}) : setAdminFormData({...adminFormData, user: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4" />
             <input required type="password" placeholder="Senha" value={view === 'adminLogin' ? loginCreds.pass : adminFormData.pass} onChange={e => view === 'adminLogin' ? setLoginCreds({...loginCreds, pass: e.target.value}) : setAdminFormData({...adminFormData, pass: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4" />
             {view === 'adminRegister' && <input required type="password" placeholder="Confirmar Senha" value={adminFormData.confirmPass} onChange={e => setAdminFormData({...adminFormData, confirmPass: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4" />}
             <button type="submit" className="w-full bg-blue-600 py-4 rounded-xl font-bold">Confirmar</button>
             <button onClick={() => setView('options')} className="w-full text-slate-500 text-sm">Voltar</button>
          </form>
        )}
      </div>
      <p className="text-center text-slate-600 text-[10px] pb-4 uppercase tracking-widest">Kinho Pet Shopping • v1.0</p>
    </div>
  );
};
export default LoginScreen;
