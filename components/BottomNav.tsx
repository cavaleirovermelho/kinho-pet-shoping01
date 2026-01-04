
import React from 'react';
import { Screen } from '../types';
import { Home, Calendar, ShoppingBag, User } from 'lucide-react';

const BottomNav: React.FC<{ currentScreen: Screen, onNavigate: (s: Screen) => void }> = ({ currentScreen, onNavigate }) => {
  const items = [
    { id: Screen.HOME, icon: Home, label: 'Início' },
    { id: Screen.BOOKING, icon: Calendar, label: 'Agenda' },
    { id: Screen.PRODUCT_DETAIL, icon: ShoppingBag, label: 'Loja' },
    { id: Screen.PET_PROFILE, icon: User, label: 'Perfil' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-4 flex justify-around z-50">
      {items.map(item => (
        <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex flex-col items-center gap-1 ${currentScreen === item.id ? 'text-[#22C55E]' : 'text-slate-500'}`}>
          <item.icon size={24} />
          <span className="text-[9px] font-bold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
export default BottomNav;
