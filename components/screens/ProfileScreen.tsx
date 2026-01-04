
import React from 'react';
import { LogOut, Settings, Bell, Camera, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface Props { petName: string; onLogout: () => void; userRole: UserRole; userName: string; }

const ProfileScreen: React.FC<Props> = ({ petName, onLogout, userRole, userName }) => {
  const isAdmin = userRole === 'owner';
  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between pt-4"><h1 className="text-xl font-bold">Meu Perfil</h1><div className="flex gap-2"><Bell/><Settings/></div></header>
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-[#22C55E]">
            <img src={isAdmin ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" : "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400"} className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 bg-[#22C55E] p-2 rounded-xl border-4 border-[#0F172A]"><Camera size={16}/></button>
        </div>
        <h2 className="text-2xl font-black mt-4">{isAdmin ? userName : petName}</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase">{isAdmin ? 'Proprietário' : `Pet de ${userName}`}</p>
      </div>

      {isAdmin && (
        <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
          <h3 className="font-bold mb-4">Painel do Dono</h3>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-slate-900 p-4 rounded-xl text-center"><p className="text-[#22C55E] font-black">R$ 1.250</p><p className="text-[10px] text-slate-500">VENDAS</p></div>
             <div className="bg-slate-900 p-4 rounded-xl text-center"><p className="text-[#22C55E] font-black">8</p><p className="text-[10px] text-slate-500">AGENDA</p></div>
          </div>
        </div>
      )}

      <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-500 font-bold py-5 rounded-2xl border border-red-500/20">
        <LogOut size={20} /> Sair
      </button>
    </div>
  );
};
export default ProfileScreen;
