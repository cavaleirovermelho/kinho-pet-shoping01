
import React, { useState, useEffect } from 'react';
import { 
  PawPrint, UserPlus, Lock, Home, Calendar, ShoppingBag, 
  User, Bell, Plus, Edit, Trash2, MapPin, X, ChevronLeft, 
  CheckCircle2, ShoppingCart, Star, LogOut, Camera, Clock, Save,
  Check, Store, UserCheck, Scissors, ArrowRight, Search, Heart,
  PlusCircle, LayoutDashboard, Share2, Copy, AlertCircle
} from 'lucide-react';
import { Booking, Product, UserRole, Screen } from './types';

// Chaves de armazenamento persistente - Versão 5 para garantir limpeza de dados antigos
const STORAGE_KEYS = {
  ADMINS: 'kinho_pet_admins_v5',
  CURRENT_SESSION: 'kinho_pet_session_v5',
  CUSTOMER_DATA: 'kinho_customer_profile_v5',
  DATA_PREFIX: 'kinho_data_v5_'
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

  // --- CARREGAMENTO INICIAL ---
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
          const admins = getRegisteredAdmins();
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
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Função auxiliar para pegar administradores
  const getRegisteredAdmins = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
  };

  // Carrega os dados da loja (Produtos, Agenda, etc)
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
      // Se a loja for nova, inicializa com dados de exemplo
      const initialProducts: Product[] = [
        { id: '1', name: 'Banho Relaxante', price: '45,00', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400', description: 'Banho completo com produtos hipoalergênicos.' },
        { id: '2', name: 'Tosa Higiênica', price: '35,00', image: 'https://images.unsplash.com/photo-1591768793355-74d7c869c1b7?q=80&w=400', description: 'Cuidado essencial para a higiene do seu pet.' },
        { id: '3', name: 'Ração Premium 1kg', price: '89,90', image: 'https://images.unsplash.com/photo-1589924691106-07c26394368c?q=80&w=400', description: 'O melhor para a saúde do seu amiguinho.' }
      ];
      setProducts(initialProducts);
      setBookings([]);
      setAvailableTimes(["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]);
    }
  };

  // Salva alterações nos dados da loja
  const persistShopData = () => {
    if (activeAdmin) {
      const data = { products, bookings, availableTimes };
      localStorage.setItem(STORAGE_KEYS.DATA_PREFIX + activeAdmin.user, JSON.stringify(data));
    }
  };

  // Salva dados do perfil do cliente (Auto-save)
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

  // --- TELAS ---

  const SplashScreen = () => (
    <div className="h-screen flex flex-col items-center justify-center p-8 bg-[#0F172A]">
      <div className="w-48 h-48 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-8 border-4 border-[#22C55E]/20 animate-bounce">
        <PawPrint size={80} className="text-[#22C55E]" />
      </div>
      <h1 className="text-4xl font-black text-white text-center">Kinho <span className="text-[#22C55E]">Pet Shop</span></h1>
      <div className="mt-8 flex gap-1">
        <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-bounce [animation-delay:0.4s]"></div>
      </div>
    </div>
  );

  const LoginScreen = () => {
    const [view, setView] = useState<'main' | 'customer' | 'admin_login' | 'admin_reg'>('main');
    const [error, setError] = useState('');
    const [cUser, setCUser] = useState({ name: '', pet: '', shopId: '' });
    const [aLog, setALog] = useState({ user: '', pass: '' });
    const [aReg, setAReg] = useState({ name: '', shop: '', user: '', pass: '' });
    
    const registeredShops = getRegisteredAdmins();

    const handleCustomerJoin = () => {
      setError('');
      const cleanId = cUser.shopId.toLowerCase().trim();
      if (!cleanId) return setError('Qual o ID da loja?');
      
      const admins = getRegisteredAdmins();
      const targetShop = admins.find((a: any) => a.user.toLowerCase() === cleanId);
      
      if (targetShop) {
        setUserName(cUser.name || 'Visitante');
        setPetName(cUser.pet || 'Pet');
        loadShopData(targetShop, 'customer');
        setCurrentScreen('home');
      } else {
        setError('Loja não encontrada! Verifique o ID com o dono.');
      }
    };

    const handleAdminRegister = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      const admins = getRegisteredAdmins();
      const cleanId = aReg.user.toLowerCase().trim();
      
      if (admins.find((a: any) => a.user === cleanId)) return setError('Este ID já existe. Escolha outro.');
      
      const newAdmin = { ...aReg, user: cleanId };
      admins.push(newAdmin);
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
      
      // Auto-Login e Inicialização
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(newAdmin));
      loadShopData(newAdmin, 'owner');
      setCurrentScreen('home');
    };

    const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      const admins = getRegisteredAdmins();
      const found = admins.find((a: any) => a.user === aLog.user.toLowerCase().trim() && a.pass === aLog.pass);
      
      if (found) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(found));
        loadShopData(found, 'owner');
        setCurrentScreen('home');
      } else {
        setError('Login ou senha incorretos.');
      }
    };

    return (
      <div className="h-screen flex flex-col p-8 justify-center items-center bg-[#0F172A] overflow-y-auto">
        <div className="text-center mb-10">
          <PawPrint size={64} className="text-[#22C55E] mx-auto mb-4" />
          <h1 className="text-3xl font-black uppercase text-white tracking-tighter">Kinho <span className="text-[#22C55E]">Pet Shop</span></h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Plataforma Pet Profissional</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          {view === 'main' && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <button onClick={() => setView('customer')} className="w-full bg-white text-slate-900 py-5 rounded-[24px] font-black flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
                <UserPlus size={22} className="text-[#22C55E]" /> SOU CLIENTE
              </button>
              
              <div className="h-px bg-slate-800 my-6 flex items-center justify-center">
                <span className="bg-[#0F172A] px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Negócios</span>
              </div>

              <button onClick={() => setView('admin_login')} className="w-full bg-slate-800 py-5 rounded-[24px] font-bold text-slate-300 flex items-center justify-center gap-3 border border-slate-700 active:scale-95 transition-all">
                <Lock size={18} /> ENTRAR NO PAINEL
              </button>
              
              <button onClick={() => setView('admin_reg')} className="w-full bg-[#22C55E] py-5 rounded-[24px] font-black text-white flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                <PlusCircle size={22} /> CADASTRAR MEU PET SHOP
              </button>
            </div>
          )}

          {view === 'customer' && (
            <div className="space-y-3 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-center text-slate-400 mb-2">Acessar Pet Shop</h2>
              
              {/* HELPER DE ID PARA TESTES LOCAIS */}
              {registeredShops.length > 0 && (
                <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 mb-4">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Lojas Disponíveis (Local)</p>
                  <div className="flex flex-wrap gap-2">
                    {registeredShops.map((s: any) => (
                      <button key={s.user} onClick={() => setCUser({...cUser, shopId: s.user})} className="bg-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black text-blue-300 border border-blue-500/30">
                        {s.user}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <input placeholder="ID da Loja (ex: pet_do_kinho)" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-blue-500" value={cUser.shopId} onChange={e => setCUser({...cUser, shopId: e.target.value})} />
                <input placeholder="Seu Nome" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-[#22C55E]" value={cUser.name} onChange={e => setCUser({...cUser, name: e.target.value})} />
                <input placeholder="Nome do Pet" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-[#22C55E]" value={cUser.pet} onChange={e => setCUser({...cUser, pet: e.target.value})} />
              </div>
              
              {error && <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-xl"><AlertCircle size={14}/> {error}</div>}
              
              <button onClick={handleCustomerJoin} className="w-full bg-[#22C55E] py-5 rounded-2xl font-black text-white shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">ENTRAR NA LOJA</button>
              <button onClick={() => setView('main')} className="w-full text-slate-500 text-sm font-bold mt-2">Voltar</button>
            </div>
          )}

          {view === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-3 animate-in slide-in-from-left-4 duration-300">
              <h2 className="text-xl font-bold text-center text-slate-400 mb-2">Acesso do Proprietário</h2>
              <input required placeholder="Seu ID de Usuário" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-blue-500" value={aLog.user} onChange={e => setALog({...aLog, user: e.target.value})} />
              <input required type="password" placeholder="Sua Senha" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-blue-500" value={aLog.pass} onChange={e => setALog({...aLog, pass: e.target.value})} />
              {error && <div className="text-red-500 text-xs font-bold text-center">{error}</div>}
              <button type="submit" className="w-full bg-blue-600 py-5 rounded-2xl font-black text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all">ENTRAR NO PAINEL</button>
              <button type="button" onClick={() => setView('admin_reg')} className="w-full text-blue-400 text-xs font-bold text-center mt-2">Ainda não tem cadastro? Clique aqui</button>
              <button type="button" onClick={() => setView('main')} className="w-full text-slate-500 text-sm font-bold">Voltar</button>
            </form>
          )}

          {view === 'admin_reg' && (
            <form onSubmit={handleAdminRegister} className="space-y-3 animate-in fade-in duration-500 pb-10">
              <h2 className="text-xl font-bold text-center text-slate-400 mb-2">Abrir Novo Pet Shop</h2>
              <div className="space-y-4">
                <input required placeholder="Seu Nome Completo" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none" value={aReg.name} onChange={e => setAReg({...aReg, name: e.target.value})} />
                <input required placeholder="Nome do Negócio" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none" value={aReg.shop} onChange={e => setAReg({...aReg, shop: e.target.value})} />
                <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 p-5 rounded-3xl space-y-2">
                  <p className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest">Crie seu ID de Acesso</p>
                  <input required placeholder="Ex: pet_do_centro" className="w-full bg-transparent text-white font-black text-lg outline-none" value={aReg.user} onChange={e => setAReg({...aReg, user: e.target.value.toLowerCase().replace(/\s/g, '_')})} />
                  <p className="text-[9px] text-slate-500 leading-tight">Este ID é o que seus clientes usarão para encontrar sua loja.</p>
                </div>
                <input required type="password" placeholder="Crie uma Senha" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none" value={aReg.pass} onChange={e => setAReg({...aReg, pass: e.target.value})} />
              </div>
              {error && <div className="text-red-500 text-xs font-bold text-center">{error}</div>}
              <button type="submit" className="w-full bg-[#22C55E] py-5 rounded-2xl font-black text-white shadow-xl shadow-emerald-500/30 mt-4 active:scale-95 transition-all">CONCLUIR CADASTRO</button>
              <button type="button" onClick={() => setView('main')} className="w-full text-slate-500 text-sm font-bold mt-2">Cancelar</button>
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
          <p className="text-[#22C55E] text-[10px] font-black uppercase tracking-[0.3em]">{activeAdmin?.shop || 'Loja Parceira'}</p>
          <h1 className="text-2xl font-black text-white">Olá, {userName}!</h1>
        </div>
        <button className="bg-slate-800 p-3 rounded-2xl relative border border-slate-700/50 text-slate-400">
          <Bell size={20} />
          {bookings.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-slate-800"></span>}
        </button>
      </header>

      {userRole === 'owner' && (
        <div className="bg-slate-800/60 p-5 rounded-[32px] border border-slate-700 flex justify-between items-center animate-in slide-in-from-top-4">
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">ID para seus Clientes</p>
            <p className="text-[#22C55E] font-black text-xl font-mono">{activeAdmin.user}</p>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(activeAdmin.user); alert('ID Copiado! Envie pelo WhatsApp para seus clientes.'); }} className="bg-[#22C55E] p-3.5 rounded-2xl text-white shadow-lg active:scale-90 transition-all">
            <Copy size={22} />
          </button>
        </div>
      )}

      <div onClick={() => setCurrentScreen('booking')} className="bg-gradient-to-br from-[#22C55E] to-[#16a34a] p-8 rounded-[40px] shadow-2xl shadow-emerald-500/20 cursor-pointer active:scale-95 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform"><Calendar size={120}/></div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-black text-white">Serviços</h2>
          <p className="text-white/80 text-sm max-w-[220px] font-medium leading-relaxed">
            {userRole === 'owner' ? `Você tem ${bookings.length} agendamentos para gerenciar hoje.` : `O ${petName} merece um banho especial hoje. Reserve agora!`}
          </p>
          <button className="bg-white text-emerald-700 px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl">
             {userRole === 'owner' ? 'ABRIR AGENDA' : 'MARCAR HORÁRIO'}
          </button>
        </div>
      </div>

      <section className="animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-2xl font-black flex items-center gap-3 text-white">
            <ShoppingBag size={24} className="text-[#22C55E]" /> Shopping
          </h3>
          {userRole === 'owner' && (
            <button onClick={() => { setSelectedProduct(null); setCurrentScreen('product_edit'); }} className="bg-[#22C55E] p-3 rounded-2xl shadow-lg active:scale-90 transition-all text-white"><Plus size={22} /></button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-5">
          {products.length === 0 ? (
            <div className="col-span-2 py-20 text-center bg-slate-800/20 rounded-[40px] border-2 border-dashed border-slate-800">
              <ShoppingBag size={56} className="mx-auto mb-4 text-slate-700" />
              <p className="font-bold text-slate-600">Nenhum produto em estoque</p>
            </div>
          ) : (
            products.map(p => (
              <div key={p.id} onClick={() => { setSelectedProduct(p); setCurrentScreen('product_detail'); }} className="bg-slate-800/40 p-3.5 rounded-[36px] border border-slate-700/50 group active:scale-95 transition-all">
                <div className="aspect-square w-full rounded-[24px] overflow-hidden mb-4 bg-slate-900">
                  <img src={p.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                </div>
                <h4 className="font-bold text-sm truncate px-1 text-white">{p.name}</h4>
                <p className="text-[#22C55E] font-black text-sm px-1 mt-1">R$ {p.price}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );

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
      setTimeout(() => { 
        setIsDone(false); 
        setActiveTab('list'); 
        setSelTime(''); 
        if(userRole === 'customer') setPetName(pNameInput); 
      }, 1500);
    };

    if (isDone) return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-in zoom-in duration-500">
        <div className="bg-[#22C55E]/20 p-10 rounded-full mb-8">
           <CheckCircle2 size={120} className="text-[#22C55E] drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
        </div>
        <h2 className="text-4xl font-black text-white">Tudo Pronto!</h2>
        <p className="text-slate-400 mt-3 text-center text-lg">Agendamento concluído com sucesso.</p>
      </div>
    );

    return (
      <div className="p-6 space-y-6 pb-32 h-full overflow-y-auto">
        <header className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('home')} className="bg-slate-800 p-3 rounded-2xl text-slate-300 shadow-xl"><ChevronLeft/></button>
          <h1 className="text-2xl font-black text-white">Agenda</h1>
        </header>

        <div className="flex bg-slate-900/50 p-2 rounded-[32px] border border-slate-800">
          <button onClick={() => setActiveTab('list')} className={`flex-1 py-5 rounded-[24px] font-black text-[11px] tracking-widest transition-all ${activeTab === 'list' ? 'bg-[#22C55E] text-white shadow-lg' : 'text-slate-500'}`}>LISTA</button>
          <button onClick={() => setActiveTab('create')} className={`flex-1 py-5 rounded-[24px] font-black text-[11px] tracking-widest transition-all ${activeTab === 'create' ? 'bg-[#22C55E] text-white shadow-lg' : 'text-slate-500'}`}>AGENDAR</button>
        </div>

        {activeTab === 'list' ? (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="py-24 text-center opacity-30 animate-pulse"><Calendar size={80} className="mx-auto mb-4 text-white" /><p className="font-bold text-white text-lg">Agenda vazia</p></div>
            ) : (
              bookings.map(b => (
                <div key={b.id} className="bg-slate-800/40 p-6 rounded-[36px] border border-slate-700/30 flex justify-between items-center animate-in slide-in-from-bottom-4">
                  <div className="space-y-1">
                    <p className="font-black text-white text-xl">{b.petName}</p>
                    <div className="flex items-center gap-3">
                      <span className="bg-[#22C55E]/20 text-[#22C55E] text-[11px] font-black px-3 py-1 rounded-full">{b.time}</span>
                      <span className="text-slate-500 text-[11px] uppercase font-black tracking-wider">{b.service}</span>
                    </div>
                  </div>
                  {userRole === 'owner' && (
                    <button onClick={() => setBookings(prev => prev.filter(x => x.id !== b.id))} className="p-4 bg-red-500/10 text-red-500 rounded-3xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-500">
            <div className="space-y-3">
              <p className="text-[11px] uppercase font-black text-slate-500 ml-2 tracking-[0.2em]">Quem vai ser cuidado?</p>
              <input value={pNameInput} onChange={e => setPNameInput(e.target.value)} className="w-full bg-slate-900 p-6 rounded-[28px] font-black text-xl text-white outline-none border border-slate-800 focus:border-[#22C55E] transition-all" placeholder="Nome do seu Pet" />
            </div>
            
            <div className="space-y-5">
              <p className="text-[11px] uppercase font-black text-slate-500 ml-2 tracking-[0.2em]">Horários disponíveis hoje</p>
              <div className="grid grid-cols-3 gap-3">
                {availableTimes.map(t => (
                  <button key={t} onClick={() => setSelTime(t)} className={`w-full py-6 rounded-[24px] font-black text-base transition-all ${selTime === t ? 'bg-[#22C55E] text-white shadow-xl shadow-emerald-500/20 scale-105' : 'bg-slate-800 text-slate-500'}`}>{t}</button>
                ))}
              </div>
            </div>
            
            <button disabled={!selTime || !pNameInput} onClick={handleConfirm} className="w-full bg-[#22C55E] py-7 rounded-[32px] font-black text-white shadow-2xl shadow-emerald-500/40 disabled:opacity-20 active:scale-95 transition-all text-xl tracking-tight">
              CONFIRMAR RESERVA
            </button>
          </div>
        )}
      </div>
    );
  };

  const ProfileScreen = () => (
    <div className="p-8 space-y-10 animate-in fade-in duration-500 h-full overflow-y-auto pb-32">
      <h1 className="text-3xl font-black text-white">Perfil</h1>
      <div className="text-center relative">
        <div className="relative inline-block group">
          <div className="w-48 h-48 rounded-[72px] overflow-hidden border-4 border-[#22C55E] p-2 bg-slate-800 shadow-2xl transition-transform group-hover:scale-105 duration-500">
            <img src={userRole === 'owner' ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400" : "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400"} className="w-full h-full object-cover rounded-[56px]" />
          </div>
          <button className="absolute bottom-1 right-1 bg-[#22C55E] p-4 rounded-[24px] border-4 border-[#0F172A] text-white shadow-xl active:scale-90 transition-all"><Camera size={24}/></button>
        </div>
        <h2 className="text-4xl font-black mt-10 text-white tracking-tighter">{userRole === 'owner' ? activeAdmin?.name : userName}</h2>
        <p className="text-[#22C55E] font-bold text-[11px] uppercase tracking-[0.4em] mt-3">
          {userRole === 'owner' ? activeAdmin?.shop : `Tutor(a) do ${petName}`}
        </p>
      </div>

      <div className="space-y-5">
         {userRole === 'customer' && (
           <div className="bg-slate-800/40 p-8 rounded-[40px] border border-slate-700/50 shadow-inner space-y-6">
             <h3 className="font-black flex items-center gap-4 text-slate-300 uppercase text-[11px] tracking-widest"><Heart size={20} className="text-pink-500"/> Registro Pet</h3>
             <div className="space-y-4">
                <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Nome do Pet</p>
                  <input value={petName} onChange={e => setPetName(e.target.value)} className="w-full bg-transparent font-black text-white text-xl outline-none" />
                </div>
                <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Seu Nome</p>
                   <input value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-transparent font-black text-white text-xl outline-none" />
                </div>
             </div>
           </div>
         )}

         {userRole === 'customer' && activeAdmin && (
           <div className="bg-blue-500/5 p-8 rounded-[40px] border border-blue-500/20 text-center space-y-2">
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Loja Frequentada</p>
             <p className="text-white font-black text-xl">{activeAdmin.shop}</p>
             <div className="flex items-center justify-center gap-2 mt-2">
                <span className="bg-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-[10px] font-mono font-black">ID: {activeAdmin.user}</span>
             </div>
           </div>
         )}
         
         <div className="pt-6">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-4 bg-red-500/5 text-red-500 font-black py-8 rounded-[40px] border border-red-500/20 active:scale-95 transition-all shadow-xl">
                <LogOut size={28} /> DESCONECTAR / SAIR
            </button>
         </div>
      </div>
    </div>
  );

  const ProductDetail = () => {
    if (!selectedProduct) return null;
    return (
      <div className="animate-in fade-in duration-500 h-full overflow-y-auto bg-[#0F172A] pb-32">
        <div className="relative h-[400px]">
          <img src={selectedProduct.image || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-60"></div>
          <button onClick={() => setCurrentScreen('home')} className="absolute top-8 left-8 bg-slate-900/60 p-4 rounded-3xl text-white backdrop-blur-md border border-white/10 shadow-2xl active:scale-90 transition-all"><ChevronLeft size={28}/></button>
        </div>
        <div className="p-10 space-y-8 -mt-16 bg-[#0F172A] rounded-t-[56px] relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] min-h-[60vh]">
          <div className="flex justify-between items-start gap-4">
             <h1 className="text-4xl font-black text-white leading-tight tracking-tighter">{selectedProduct.name}</h1>
             <p className="text-[#22C55E] text-3xl font-black bg-emerald-500/5 px-5 py-2 rounded-2xl border border-emerald-500/10">R$ {selectedProduct.price}</p>
          </div>
          <div className="flex text-yellow-500 gap-1.5"><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/></div>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">{selectedProduct.description || 'Este produto foi selecionado por especialistas para garantir o conforto e a felicidade do seu melhor amigo.'}</p>
          
          <div className="flex flex-col gap-4 pt-4">
            {userRole === 'owner' && (
              <button onClick={() => setCurrentScreen('product_edit')} className="w-full bg-slate-800 p-6 rounded-[32px] font-black border border-slate-700 text-slate-300 flex items-center justify-center gap-3 active:scale-95 transition-all"><Edit size={22}/> EDITAR ITEM</button>
            )}
            <button className="w-full bg-[#22C55E] py-7 rounded-[36px] font-black text-white shadow-2xl shadow-emerald-500/30 text-xl flex items-center justify-center gap-4 active:scale-95 transition-all"><ShoppingCart size={28}/> ADICIONAR AO CARRINHO</button>
          </div>
        </div>
      </div>
    );
  };

  const ProductEditScreen = () => {
    const [formData, setFormData] = useState<Product>(selectedProduct || { id: '', name: '', price: '', image: '', description: '' });
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newProduct = { ...formData, id: formData.id || Date.now().toString() };
      setProducts(prev => formData.id ? prev.map(p => p.id === formData.id ? newProduct : p) : [newProduct, ...prev]);
      setCurrentScreen('home');
    };
    return (
      <div className="p-6 space-y-8 h-full animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto pb-32">
        <header className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('home')} className="bg-slate-800 p-3 rounded-2xl text-slate-300 shadow-xl"><ChevronLeft/></button>
          <h1 className="text-2xl font-black text-white">Gerenciar Produto</h1>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <p className="text-[11px] uppercase font-black text-slate-500 ml-2 tracking-widest">Nome do Item</p>
            <input required placeholder="Ex: Ração Golden 10kg" className="w-full bg-slate-900 p-6 rounded-[28px] text-white border border-slate-800 focus:border-[#22C55E] transition-all outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase font-black text-slate-500 ml-2 tracking-widest">Preço de Venda</p>
            <input required placeholder="Ex: 120,00" className="w-full bg-slate-900 p-6 rounded-[28px] text-white border border-slate-800 focus:border-[#22C55E] transition-all outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase font-black text-slate-500 ml-2 tracking-widest">Imagem (URL)</p>
            <input placeholder="Link da foto do produto" className="w-full bg-slate-900 p-6 rounded-[28px] text-white border border-slate-800 focus:border-[#22C55E] transition-all outline-none" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase font-black text-slate-500 ml-2 tracking-widest">Descrição</p>
            <textarea placeholder="Detalhes do produto..." className="w-full bg-slate-900 p-6 rounded-[28px] text-white border border-slate-800 focus:border-[#22C55E] transition-all outline-none h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          
          <div className="pt-6 flex flex-col gap-4">
            <button type="submit" className="w-full bg-[#22C55E] py-7 rounded-[36px] font-black text-white shadow-2xl text-xl">SALVAR ALTERAÇÕES</button>
            {formData.id && (
              <button type="button" onClick={() => { setProducts(prev => prev.filter(p => p.id !== formData.id)); setCurrentScreen('home'); }} className="w-full bg-red-500/10 text-red-500 py-7 rounded-[36px] font-black border border-red-500/20 active:scale-95 transition-all">REMOVER PRODUTO</button>
            )}
          </div>
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
        <nav className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800/50 p-6 px-10 flex justify-between items-center z-[90] rounded-t-[56px] shadow-[0_-20px_60px_rgba(0,0,0,0.7)]">
          <button onClick={() => setCurrentScreen('home')} className={`flex flex-col items-center gap-2 transition-all duration-300 ${currentScreen === 'home' ? 'text-[#22C55E] -translate-y-2' : 'text-slate-600'}`}>
            <Home size={32} strokeWidth={currentScreen === 'home' ? 3 : 2} />
            <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${currentScreen === 'home' ? 'opacity-100' : 'opacity-0'}`}>Início</span>
          </button>
          <button onClick={() => setCurrentScreen('booking')} className={`flex flex-col items-center gap-2 transition-all duration-300 ${currentScreen === 'booking' ? 'text-[#22C55E] -translate-y-2' : 'text-slate-600'}`}>
            <Calendar size={32} strokeWidth={currentScreen === 'booking' ? 3 : 2} />
            <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${currentScreen === 'booking' ? 'opacity-100' : 'opacity-0'}`}>Agenda</span>
          </button>
          <button onClick={() => setCurrentScreen('profile')} className={`flex flex-col items-center gap-2 transition-all duration-300 ${currentScreen === 'profile' ? 'text-[#22C55E] -translate-y-2' : 'text-slate-600'}`}>
            <User size={32} strokeWidth={currentScreen === 'profile' ? 3 : 2} />
            <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${currentScreen === 'profile' ? 'opacity-100' : 'opacity-0'}`}>Perfil</span>
          </button>
        </nav>
      )}
    </div>
  );
}
