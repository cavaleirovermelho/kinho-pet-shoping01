
import React, { useState, useEffect } from 'react';
import { 
  PawPrint, UserPlus, Lock, Home, Calendar, ShoppingBag, 
  User, Bell, Plus, Edit, Trash2, MapPin, X, ChevronLeft, 
  CheckCircle2, ShoppingCart, Star, LogOut, Camera, Clock, Save,
  Check, Store, UserCheck, Scissors, ArrowRight, Search, Heart,
  PlusCircle, LayoutDashboard, Share2, Copy
} from 'lucide-react';
import { Booking, Product, UserRole } from './types';

// Chaves de armazenamento persistente
const STORAGE_KEYS = {
  ADMINS: 'kinho_pet_admins_v4',
  CURRENT_SESSION: 'kinho_pet_session_v4',
  CUSTOMER_DATA: 'kinho_customer_profile_v4',
  DATA_PREFIX: 'kinho_data_v4_'
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [activeAdmin, setActiveAdmin] = useState<any>(null); 
  const [userName, setUserName] = useState('');
  const [petName, setPetName] = useState('Seu Pet');
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>(["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Inicialização e Carregamento de Sessão (Dono ou Cliente)
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        const adminSession = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
        const customerSession = localStorage.getItem(STORAGE_KEYS.CUSTOMER_DATA);

        if (adminSession) {
          const admin = JSON.parse(adminSession);
          loadShopData(admin, 'owner');
          setCurrentScreen('home');
        } else if (customerSession) {
          const profile = JSON.parse(customerSession);
          // Tenta encontrar a loja no registro local
          const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
          const shop = admins.find((a: any) => a.user === profile.shopId);
          
          if (shop) {
            setUserName(profile.userName);
            setPetName(profile.petName);
            loadShopData(shop, 'customer');
            setCurrentScreen('home');
          } else {
            setCurrentScreen('login');
          }
        } else {
          setCurrentScreen('login');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const loadShopData = (admin: any, role: UserRole) => {
    setActiveAdmin(admin);
    setUserRole(role);
    if (role === 'owner') setUserName(admin.name);
    
    const savedData = localStorage.getItem(STORAGE_KEYS.DATA_PREFIX + admin.user);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setProducts(parsed.products || []);
      setBookings(parsed.bookings || []);
      setAvailableTimes(parsed.availableTimes || ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]);
    } else {
      setProducts([]);
      setBookings([]);
      setAvailableTimes(["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]);
    }
  };

  const persistShopData = () => {
    if (activeAdmin) {
      const data = { products, bookings, availableTimes };
      localStorage.setItem(STORAGE_KEYS.DATA_PREFIX + activeAdmin.user, JSON.stringify(data));
    }
  };

  // Persiste dados do cliente sempre que mudar
  useEffect(() => {
    if (userRole === 'customer' && activeAdmin) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_DATA, JSON.stringify({
        userName,
        petName,
        shopId: activeAdmin.user
      }));
    }
  }, [userName, petName, activeAdmin, userRole]);

  useEffect(() => {
    if (activeAdmin) persistShopData();
  }, [products, bookings, availableTimes]);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_DATA);
    setUserRole('customer');
    setActiveAdmin(null);
    setUserName('');
    setPetName('Seu Pet');
    setProducts([]);
    setBookings([]);
    setCurrentScreen('login');
  };

  const formatTime = (value: string) => {
    const d = value.replace(/\D/g, '');
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}:${d.slice(2, 4)}`;
  };

  const SplashScreen = () => (
    <div className="h-screen flex flex-col items-center justify-center p-8 bg-[#0F172A] animate-pulse">
      <div className="w-48 h-48 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-8 border-4 border-[#22C55E]/20">
        <PawPrint size={80} className="text-[#22C55E]" />
      </div>
      <h1 className="text-4xl font-black text-white text-center">Kinho <span className="text-[#22C55E]">Pet Shop</span></h1>
      <p className="text-slate-400 mt-2 font-light italic">Carregando sua sessão...</p>
    </div>
  );

  const LoginScreen = () => {
    const [view, setView] = useState<'main' | 'customer' | 'admin_login' | 'admin_reg'>('main');
    const [error, setError] = useState('');
    const [cUser, setCUser] = useState({ name: '', pet: '', shopId: '' });
    const [aLog, setALog] = useState({ user: '', pass: '' });
    const [aReg, setAReg] = useState({ name: '', shop: '', user: '', pass: '' });

    const handleCustomerJoin = () => {
      setError('');
      if (!cUser.shopId) return setError('Qual o ID da loja?');
      const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
      const targetShop = admins.find((a: any) => a.user.toLowerCase() === cUser.shopId.toLowerCase());
      
      if (targetShop) {
        setUserName(cUser.name || 'Cliente');
        setPetName(cUser.pet || 'Pet');
        loadShopData(targetShop, 'customer');
        setCurrentScreen('home');
      } else {
        setError('Loja não encontrada. Peça o ID correto ao dono!');
      }
    };

    const handleAdminRegister = (e: React.FormEvent) => {
      e.preventDefault();
      const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
      if (admins.find((a: any) => a.user === aReg.user)) return setError('Este ID já está em uso.');
      
      admins.push(aReg);
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
      
      // Auto-Login após registro
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(aReg));
      loadShopData(aReg, 'owner');
      setCurrentScreen('home');
    };

    const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
      const found = admins.find((a: any) => a.user === aLog.user && a.pass === aLog.pass);
      if (found) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(found));
        loadShopData(found, 'owner');
        setCurrentScreen('home');
      } else {
        setError('Usuário ou senha incorretos.');
      }
    };

    return (
      <div className="h-screen flex flex-col p-8 justify-center items-center bg-[#0F172A] overflow-y-auto">
        <div className="text-center mb-10">
          <PawPrint size={64} className="text-[#22C55E] mx-auto mb-4" />
          <h1 className="text-3xl font-black uppercase text-white">Kinho <span className="text-[#22C55E]">Pet Shop</span></h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Versão Profissional</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          {view === 'main' && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <button onClick={() => setView('customer')} className="w-full bg-white text-slate-900 py-5 rounded-[24px] font-black flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
                <UserPlus size={22} className="text-[#22C55E]" /> SOU CLIENTE
              </button>
              
              <div className="h-px bg-slate-800 my-6 flex items-center justify-center">
                <span className="bg-[#0F172A] px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Acesso do Dono</span>
              </div>

              <button onClick={() => setView('admin_login')} className="w-full bg-slate-800 py-5 rounded-[24px] font-bold text-slate-300 flex items-center justify-center gap-3 border border-slate-700 active:scale-95 transition-all">
                <Lock size={18} /> ENTRAR NO PAINEL
              </button>
              
              <button onClick={() => setView('admin_reg')} className="w-full bg-[#22C55E] py-5 rounded-[24px] font-black text-white flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
                <PlusCircle size={22} /> CADASTRAR MEU PET SHOP
              </button>
            </div>
          )}

          {view === 'customer' && (
            <div className="space-y-3 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-center text-slate-400 mb-2">Acessar Loja</h2>
              <input placeholder="ID da Loja (ex: kinho_pet)" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-blue-500" value={cUser.shopId} onChange={e => setCUser({...cUser, shopId: e.target.value.toLowerCase().trim()})} />
              <input placeholder="Seu Nome" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-[#22C55E]" value={cUser.name} onChange={e => setCUser({...cUser, name: e.target.value})} />
              <input placeholder="Nome do Pet" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-[#22C55E]" value={cUser.pet} onChange={e => setCUser({...cUser, pet: e.target.value})} />
              {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
              <button onClick={handleCustomerJoin} className="w-full bg-[#22C55E] py-4 rounded-2xl font-black text-white shadow-xl">ENTRAR NA LOJA</button>
              <button onClick={() => setView('main')} className="w-full text-slate-500 text-sm font-bold mt-2">Voltar</button>
            </div>
          )}

          {view === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-3 animate-in slide-in-from-left-4 duration-300">
              <h2 className="text-xl font-bold text-center text-slate-400 mb-2">Login Administrativo</h2>
              <input required placeholder="ID da Loja" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none" value={aLog.user} onChange={e => setALog({...aLog, user: e.target.value.toLowerCase().trim()})} />
              <input required type="password" placeholder="Sua Senha" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none" value={aLog.pass} onChange={e => setALog({...aLog, pass: e.target.value})} />
              {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
              <button type="submit" className="w-full bg-blue-600 py-4 rounded-2xl font-black text-white">ACESSAR PAINEL</button>
              <button type="button" onClick={() => setView('main')} className="w-full text-slate-500 text-sm font-bold mt-2">Voltar</button>
            </form>
          )}

          {view === 'admin_reg' && (
            <form onSubmit={handleAdminRegister} className="space-y-3 animate-in fade-in duration-500 pb-10">
              <h2 className="text-xl font-bold text-center text-slate-400 mb-2">Registrar Pet Shop</h2>
              <input required placeholder="Seu Nome" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none" value={aReg.name} onChange={e => setAReg({...aReg, name: e.target.value})} />
              <input required placeholder="Nome do Pet Shop" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none" value={aReg.shop} onChange={e => setAReg({...aReg, shop: e.target.value})} />
              <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 p-4 rounded-2xl space-y-2">
                <p className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest">ID Único da Loja</p>
                <input required placeholder="Ex: kinho_pet" className="w-full bg-transparent text-white font-bold outline-none" value={aReg.user} onChange={e => setAReg({...aReg, user: e.target.value.toLowerCase().replace(/\s/g, '_')})} />
              </div>
              <input required type="password" placeholder="Senha Administrativa" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none" value={aReg.pass} onChange={e => setAReg({...aReg, pass: e.target.value})} />
              {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
              <button type="submit" className="w-full bg-[#22C55E] py-5 rounded-2xl font-black text-white shadow-xl mt-4">CRIAR MEU NEGÓCIO</button>
              <button type="button" onClick={() => setView('main')} className="w-full text-slate-500 text-sm font-bold mt-2">Voltar</button>
            </form>
          )}
        </div>
      </div>
    );
  };

  const HomeScreen = () => (
    <div className="p-6 space-y-8 pb-32 h-full overflow-y-auto">
      <header className="flex justify-between items-center animate-in fade-in duration-700">
        <div>
          <p className="text-[#22C55E] text-[10px] font-black uppercase tracking-[0.3em]">{activeAdmin?.shop || 'Visitando Loja'}</p>
          <h1 className="text-2xl font-black text-white">Olá, {userName}!</h1>
        </div>
        <button className="bg-slate-800 p-3 rounded-2xl relative border border-slate-700/50 shadow-lg text-slate-400">
          <Bell size={20} />
          {userRole === 'owner' && bookings.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}
        </button>
      </header>

      {/* ID DA LOJA - VISÍVEL PARA O DONO COMPARTILHAR */}
      {userRole === 'owner' && (
        <div className="bg-slate-800/60 p-5 rounded-3xl border border-slate-700 flex justify-between items-center">
          <div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Seu ID para Clientes</p>
            <p className="text-[#22C55E] font-black text-lg font-mono">{activeAdmin.user}</p>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(activeAdmin.user); alert('ID Copiado! Mande para seus clientes.'); }} className="bg-[#22C55E] p-3 rounded-2xl text-white shadow-lg active:scale-90 transition-all">
            <Copy size={20} />
          </button>
        </div>
      )}

      <div onClick={() => setCurrentScreen('booking')} className="bg-gradient-to-br from-[#22C55E] to-[#16a34a] p-7 rounded-[40px] shadow-2xl shadow-emerald-500/30 cursor-pointer active:scale-95 transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Calendar size={120}/></div>
        <div className="relative z-10 space-y-3">
          <h2 className="text-2xl font-black text-white">Agenda</h2>
          <p className="text-white/80 text-sm max-w-[200px]">
            {userRole === 'owner' ? `Existem ${bookings.length} agendamentos hoje.` : `Reserve agora o horário do ${petName}.`}
          </p>
          <button className="bg-white text-emerald-700 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
             {userRole === 'owner' ? 'GERENCIAR' : 'RESERVAR'}
          </button>
        </div>
      </div>

      <section className="animate-in slide-in-from-bottom-6 duration-700">
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white"><ShoppingBag size={20} className="text-[#22C55E]" /> Shopping</h3>
          {userRole === 'owner' && (
            <button onClick={() => { setSelectedProduct(null); setCurrentScreen('product_edit'); }} className="bg-[#22C55E] p-2.5 rounded-xl shadow-lg text-white"><Plus size={20} /></button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {products.length === 0 ? (
            <div className="col-span-2 py-16 text-center bg-slate-800/10 rounded-[40px] border border-dashed border-slate-800 opacity-40">
              <ShoppingBag size={48} className="mx-auto mb-4 text-slate-600" /><p className="font-bold text-slate-500">Loja vazia</p>
            </div>
          ) : (
            products.map(p => (
              <div key={p.id} onClick={() => { setSelectedProduct(p); setCurrentScreen('product_detail'); }} className="bg-slate-800/40 p-3 rounded-[32px] border border-slate-700/50 group active:scale-95 transition-all">
                <div className="aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-slate-900">
                  <img src={p.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                </div>
                <h4 className="font-bold text-sm truncate px-1 text-white">{p.name}</h4>
                <p className="text-[#22C55E] font-black text-xs px-1">R$ {p.price}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );

  const ProfileScreen = () => (
    <div className="p-8 space-y-10 animate-in fade-in duration-500 h-full overflow-y-auto pb-32">
      <h1 className="text-2xl font-black text-white">Perfil</h1>
      <div className="text-center relative">
        <div className="relative inline-block">
          <div className="w-44 h-44 rounded-[72px] overflow-hidden border-4 border-[#22C55E] p-2 bg-slate-800 shadow-2xl">
            <img src={userRole === 'owner' ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400" : "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400"} className="w-full h-full object-cover rounded-[56px]" />
          </div>
        </div>
        <h2 className="text-3xl font-black mt-8 text-white">{userRole === 'owner' ? activeAdmin?.name : userName}</h2>
        <p className="text-[#22C55E] font-bold text-[10px] uppercase tracking-[0.4em] mt-3">
          {userRole === 'owner' ? activeAdmin?.shop : `Tutor do(a) ${petName}`}
        </p>
      </div>

      <div className="space-y-4">
         {userRole === 'customer' && (
           <div className="bg-slate-800/40 p-6 rounded-[32px] border border-slate-700/50">
             <h3 className="font-black mb-4 flex items-center gap-3 text-slate-300 uppercase text-xs tracking-widest"><Heart size={18} className="text-pink-500"/> Registro Pet</h3>
             <div className="space-y-3">
                <div className="bg-slate-900 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Nome do Pet</p>
                  <input value={petName} onChange={e => setPetName(e.target.value)} className="w-full bg-transparent font-black text-white outline-none" />
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Tutor</p>
                   <input value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-transparent font-black text-white outline-none" />
                </div>
             </div>
           </div>
         )}

         {/* INFOS DA LOJA PARA O CLIENTE */}
         {userRole === 'customer' && activeAdmin && (
           <div className="bg-blue-500/10 p-6 rounded-[32px] border border-blue-500/20 text-center">
             <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Loja que você visita</p>
             <p className="text-white font-black">{activeAdmin.shop}</p>
             <p className="text-blue-500/50 text-[10px] font-mono mt-1">ID: {activeAdmin.user}</p>
           </div>
         )}
         
         <div className="grid grid-cols-1 gap-4 pt-6">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-500 font-black py-7 rounded-[32px] border border-red-500/20 active:scale-95 transition-all">
                <LogOut size={24} /> SAIR / TROCAR LOJA
            </button>
         </div>
      </div>
    </div>
  );

  // --- COMPONENTES AUXILIARES (Booking, Detail, etc) ---
  // Mantidos do código anterior mas com correções de navegação

  const BookingScreen = () => {
    const [activeTab, setActiveTab] = useState<'list' | 'create'>(userRole === 'owner' ? 'list' : 'create');
    const [selTime, setSelTime] = useState('');
    const [pNameInput, setPNameInput] = useState(petName);
    const [isDone, setIsDone] = useState(false);

    const handleConfirm = () => {
      if (!selTime || !pNameInput) return;
      const newBooking: Booking = { id: Date.now().toString(), petName: pNameInput, service: 'Banho & Tosa', date: 'Hoje', time: selTime, status: 'Confirmado' };
      setBookings(prev => [newBooking, ...prev]);
      setIsDone(true);
      setTimeout(() => { setIsDone(false); setActiveTab('list'); setSelTime(''); if(userRole === 'customer') setPetName(pNameInput); }, 1500);
    };

    if (isDone) return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-in zoom-in duration-500">
        <CheckCircle2 size={100} className="text-[#22C55E] mb-6 shadow-2xl" />
        <h2 className="text-3xl font-black text-white">Confirmado!</h2>
        <p className="text-slate-400 mt-2 text-center font-medium">Horário reservado com sucesso.</p>
      </div>
    );

    return (
      <div className="p-6 space-y-6 pb-32 h-full overflow-y-auto">
        <header className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('home')} className="bg-slate-800 p-2.5 rounded-2xl text-slate-300 shadow-lg"><ChevronLeft/></button>
          <h1 className="text-2xl font-black text-white">Serviços</h1>
        </header>

        <div className="flex bg-slate-900/50 p-1.5 rounded-[28px] border border-slate-800">
          <button onClick={() => setActiveTab('list')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all ${activeTab === 'list' ? 'bg-[#22C55E] text-white' : 'text-slate-500'}`}>VER LISTA</button>
          <button onClick={() => setActiveTab('create')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all ${activeTab === 'create' ? 'bg-[#22C55E] text-white' : 'text-slate-500'}`}>NOVO HORÁRIO</button>
        </div>

        {activeTab === 'list' ? (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="py-24 text-center opacity-20"><Calendar size={64} className="mx-auto mb-4 text-white" /><p className="font-bold text-white">Agenda livre</p></div>
            ) : (
              bookings.map(b => (
                <div key={b.id} className="bg-slate-800/40 p-5 rounded-[32px] border border-slate-700/30 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-black text-white text-lg">{b.petName}</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-black px-2 py-0.5 rounded-full">{b.time}</span>
                      <span className="text-slate-500 text-[10px] uppercase font-bold">{b.service}</span>
                    </div>
                  </div>
                  {userRole === 'owner' && (
                    <button onClick={() => setBookings(prev => prev.filter(x => x.id !== b.id))} className="p-3 bg-red-500/10 text-red-500 rounded-2xl"><Trash2 size={18}/></button>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-black text-slate-500 ml-2 tracking-widest">Nome do Pet</p>
              <input value={pNameInput} onChange={e => setPNameInput(e.target.value)} className="w-full bg-slate-900 p-6 rounded-[24px] font-black text-lg text-white outline-none border border-slate-800 focus:border-[#22C55E]" />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-black text-slate-500 ml-2 tracking-widest">Escolha o Horário</p>
              <div className="grid grid-cols-3 gap-3">
                {availableTimes.map(t => (
                  <button key={t} onClick={() => setSelTime(t)} className={`w-full py-5 rounded-2xl font-black text-sm transition-all ${selTime === t ? 'bg-[#22C55E] text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>{t}</button>
                ))}
              </div>
            </div>
            <button disabled={!selTime || !pNameInput} onClick={handleConfirm} className="w-full bg-[#22C55E] py-6 rounded-[32px] font-black text-white shadow-2xl disabled:opacity-20 text-lg">CONFIRMAR AGORA</button>
          </div>
        )}
      </div>
    );
  };

  const ProductDetail = () => {
    if (!selectedProduct) return null;
    return (
      <div className="animate-in fade-in duration-500 h-full overflow-y-auto bg-[#0F172A] pb-32">
        <div className="relative h-80">
          <img src={selectedProduct.image || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
          <button onClick={() => setCurrentScreen('home')} className="absolute top-6 left-6 bg-slate-900/50 p-3 rounded-2xl text-white backdrop-blur-md border border-white/10 shadow-xl"><ChevronLeft/></button>
        </div>
        <div className="p-8 space-y-6 -mt-10 bg-[#0F172A] rounded-t-[48px] relative z-10 shadow-2xl min-h-[60vh]">
          <div className="flex justify-between items-start">
             <h1 className="text-3xl font-black text-white leading-tight">{selectedProduct.name}</h1>
             <p className="text-[#22C55E] text-3xl font-black">R$ {selectedProduct.price}</p>
          </div>
          <p className="text-slate-400 leading-relaxed font-medium">{selectedProduct.description || 'Produto profissional selecionado para seu pet.'}</p>
          {userRole === 'owner' && (
            <button onClick={() => setCurrentScreen('product_edit')} className="w-full bg-slate-800 p-5 rounded-[32px] font-black border border-slate-700 text-slate-300">EDITAR PRODUTO</button>
          )}
          <button className="w-full bg-[#22C55E] py-6 rounded-[32px] font-black text-white shadow-2xl text-lg flex items-center justify-center gap-3"><ShoppingCart size={24}/> ADICIONAR</button>
        </div>
      </div>
    );
  };

  const ProductEditScreen = () => {
    const [formData, setFormData] = useState<Product>(selectedProduct || { id: '', name: '', price: '', image: '', description: '' });
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newProduct = { ...formData, id: formData.id || Date.now().toString() };
      setProducts(prev => formData.id ? prev.map(p => p.id === formData.id ? newProduct : p) : [...prev, newProduct]);
      setCurrentScreen('home');
    };
    return (
      <div className="p-6 space-y-8 h-full animate-in slide-in-from-bottom-6 duration-500 overflow-y-auto pb-32">
        <header className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('home')} className="bg-slate-800 p-2.5 rounded-2xl text-slate-300"><ChevronLeft/></button>
          <h1 className="text-2xl font-black text-white">Editar Shopping</h1>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-black text-slate-500 ml-2">Título</p>
            <input required placeholder="Nome do produto" className="w-full bg-slate-900 p-5 rounded-[24px] text-white border border-slate-800" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-black text-slate-500 ml-2">Preço (R$)</p>
            <input required placeholder="0,00" className="w-full bg-slate-900 p-5 rounded-[24px] text-white border border-slate-800" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-black text-slate-500 ml-2">Imagem (URL)</p>
            <input placeholder="https://imagem.jpg" className="w-full bg-slate-900 p-5 rounded-[24px] text-white border border-slate-800" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-[#22C55E] py-6 rounded-[32px] font-black text-white shadow-2xl text-lg mt-4">SALVAR PRODUTO</button>
          {formData.id && <button type="button" onClick={() => { setProducts(prev => prev.filter(p => p.id !== formData.id)); setCurrentScreen('home'); }} className="w-full bg-red-500/10 text-red-500 py-6 rounded-[32px] font-black mt-2">EXCLUIR DO SHOPPING</button>}
        </form>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-white overflow-hidden max-w-md mx-auto relative shadow-2xl border-x border-slate-800/50">
      <div className="flex-1 overflow-y-auto custom-scrollbar h-full relative z-0">
        {currentScreen === 'splash' && <SplashScreen />}
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'booking' && <BookingScreen />}
        {currentScreen === 'product_edit' && (userRole === 'owner' ? <ProductEditScreen /> : <HomeScreen />)}
        {currentScreen === 'product_detail' && <ProductDetail />}
        {currentScreen === 'profile' && <ProfileScreen />}
      </div>

      {['home', 'booking', 'product_detail', 'profile', 'product_edit'].includes(currentScreen) && (
        <nav className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-3xl border-t border-slate-800/40 p-6 px-10 flex justify-between items-center z-[90] rounded-t-[48px] shadow-[0_-15px_60px_rgba(0,0,0,0.6)]">
          <button onClick={() => setCurrentScreen('home')} className={`flex flex-col items-center gap-2 transition-all ${currentScreen === 'home' ? 'text-[#22C55E] -translate-y-2' : 'text-slate-600'}`}>
            <Home size={28}/>
            <span className={`text-[8px] font-black uppercase tracking-widest ${currentScreen === 'home' ? 'opacity-100' : 'opacity-0'}`}>Início</span>
          </button>
          <button onClick={() => setCurrentScreen('booking')} className={`flex flex-col items-center gap-2 transition-all ${currentScreen === 'booking' ? 'text-[#22C55E] -translate-y-2' : 'text-slate-600'}`}>
            <Calendar size={28}/>
            <span className={`text-[8px] font-black uppercase tracking-widest ${currentScreen === 'booking' ? 'opacity-100' : 'opacity-0'}`}>Agenda</span>
          </button>
          <button onClick={() => setCurrentScreen('profile')} className={`flex flex-col items-center gap-2 transition-all ${currentScreen === 'profile' ? 'text-[#22C55E] -translate-y-2' : 'text-slate-600'}`}>
            <User size={28}/>
            <span className={`text-[8px] font-black uppercase tracking-widest ${currentScreen === 'profile' ? 'opacity-100' : 'opacity-0'}`}>Perfil</span>
          </button>
        </nav>
      )}
    </div>
  );
}
