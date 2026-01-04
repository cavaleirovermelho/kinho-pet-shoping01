
import React, { useState, useEffect } from 'react';
import { 
  PawPrint, UserPlus, Lock, Home, Calendar, ShoppingBag, 
  User, Bell, Plus, Edit, Trash2, MapPin, X, ChevronLeft, 
  CheckCircle2, ShoppingCart, Star, LogOut, Camera, ArrowRight
} from 'lucide-react';

// --- TIPOS ---
type Screen = 'splash' | 'login' | 'home' | 'booking' | 'product_detail' | 'profile';
type UserRole = 'owner' | 'customer';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

interface Booking {
  id: string;
  petName: string;
  service: string;
  date: string;
  time: string;
}

// --- DADOS INICIAIS ---
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Ração Premium Gold', price: '159,90', image: 'https://images.unsplash.com/photo-1589924691106-073b69759fbb?auto=format&fit=crop&q=80&w=400', description: 'Ração de alta qualidade para cães adultos.' },
  { id: '2', name: 'Brinquedo Interativo', price: '45,00', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400', description: 'Diversão garantida para seu pet.' },
  { id: '3', name: 'Cama Ortopédica', price: '289,00', image: 'https://images.unsplash.com/photo-1591946614421-1d978fc02716?auto=format&fit=crop&q=80&w=400', description: 'Conforto absoluto para o sono do seu pet.' },
];

const INITIAL_TIMES = ["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [userName, setUserName] = useState('Visitante');
  const [petName, setPetName] = useState('Seu Pet');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>(INITIAL_TIMES);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Splash Screen Timeout
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('login'), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Funções de Navegação
  const navigateTo = (screen: Screen, product?: Product) => {
    if (product) setSelectedProduct(product);
    setCurrentScreen(screen);
  };

  // Componentes das Telas
  const SplashScreen = () => (
    <div className="h-screen flex flex-col items-center justify-center p-8 bg-[#0F172A] animate-pulse">
      <div className="w-48 h-48 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-8 border-4 border-[#22C55E]/20">
        <PawPrint size={80} className="text-[#22C55E]" />
      </div>
      <h1 className="text-4xl font-black text-white">Kinho <span className="text-[#22C55E]">Pet</span></h1>
      <p className="text-slate-400 mt-2 font-light italic">Carregando mimos...</p>
    </div>
  );

  const LoginScreen = () => {
    const [view, setView] = useState<'options' | 'customer' | 'admin'>('options');
    const [cName, setCName] = useState('');
    const [pName, setPName] = useState('');
    const [pass, setPass] = useState('');

    const handleLogin = (role: UserRole) => {
      setUserRole(role);
      if (role === 'customer') {
        setUserName(cName || 'Visitante');
        setPetName(pName || 'Seu Pet');
      } else {
        setUserName('Admin Kinho');
      }
      setCurrentScreen('home');
    };

    return (
      <div className="h-screen flex flex-col p-8 bg-[#0F172A] justify-center">
        <div className="text-center mb-12">
          <PawPrint size={48} className="text-[#22C55E] mx-auto mb-4" />
          <h2 className="text-3xl font-black">Bem-vindo!</h2>
        </div>
        
        {view === 'options' && (
          <div className="space-y-4">
            <button onClick={() => setView('customer')} className="w-full bg-[#22C55E] py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
              <UserPlus size={20} /> Entrar como Cliente
            </button>
            <button onClick={() => setView('admin')} className="w-full bg-slate-800 py-4 rounded-2xl font-bold text-slate-300 flex items-center justify-center gap-3">
              <Lock size={18} /> Área do Dono
            </button>
          </div>
        )}

        {view === 'customer' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <input placeholder="Seu Nome" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl" value={cName} onChange={e => setCName(e.target.value)} />
            <input placeholder="Nome do seu Pet" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl" value={pName} onChange={e => setPName(e.target.value)} />
            <button onClick={() => handleLogin('customer')} className="w-full bg-[#22C55E] py-4 rounded-xl font-bold">Acessar App</button>
            <button onClick={() => setView('options')} className="w-full text-slate-500">Voltar</button>
          </div>
        )}

        {view === 'admin' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <input type="password" placeholder="Senha do Dono" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl" value={pass} onChange={e => setPass(e.target.value)} />
            <button onClick={() => handleLogin('owner')} className="w-full bg-blue-600 py-4 rounded-xl font-bold">Entrar no Painel</button>
            <button onClick={() => setView('options')} className="w-full text-slate-500">Voltar</button>
          </div>
        )}
      </div>
    );
  };

  const HomeScreen = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Product>({ id: '', name: '', price: '', image: '', description: '' });

    const saveProduct = (e: React.FormEvent) => {
      e.preventDefault();
      const newP = { ...formData, id: formData.id || Math.random().toString(36).substr(2, 9) };
      setProducts(prev => {
        const index = prev.findIndex(p => p.id === newP.id);
        if (index > -1) return prev.map(p => p.id === newP.id ? newP : p);
        return [newP, ...prev];
      });
      setShowForm(false);
    };

    return (
      <div className="p-6 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <p className="text-[#22C55E] text-[10px] font-black uppercase tracking-widest">Kinho Pet Matriz</p>
            <h1 className="text-2xl font-black">Olá, {userName}!</h1>
          </div>
          <button className="bg-slate-800 p-3 rounded-2xl relative"><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span></button>
        </header>

        <section onClick={() => setCurrentScreen('booking')} className="bg-gradient-to-br from-[#22C55E] to-[#16a34a] p-6 rounded-[32px] shadow-xl shadow-emerald-500/20 cursor-pointer">
          <h2 className="text-2xl font-black mb-1">Agendar Banho</h2>
          <p className="text-white/80 text-sm mb-4">Seu pet cheiroso em um clique.</p>
          <button className="bg-white text-emerald-700 px-6 py-2 rounded-xl font-bold text-xs uppercase">Reservar Hoje</button>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Shopping Pet</h3>
            {userRole === 'owner' && (
              <button onClick={() => { setFormData({id:'',name:'',price:'',image:'',description:''}); setShowForm(true); }} className="bg-[#22C55E] p-2 rounded-full"><Plus size={16}/></button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} onClick={() => navigateTo('product_detail', p)} className="bg-slate-800/40 p-3 rounded-[24px] border border-slate-700/50 relative">
                {userRole === 'owner' && (
                  <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                    <button onClick={(e) => { e.stopPropagation(); setFormData(p); setShowForm(true); }} className="bg-blue-500 p-1.5 rounded-lg"><Edit size={10}/></button>
                    <button onClick={(e) => { e.stopPropagation(); setProducts(prev => prev.filter(x => x.id !== p.id)); }} className="bg-red-500 p-1.5 rounded-lg"><Trash2 size={10}/></button>
                  </div>
                )}
                <img src={p.image} className="w-full aspect-square object-cover rounded-2xl mb-3" />
                <h4 className="font-bold text-sm truncate">{p.name}</h4>
                <p className="text-[#22C55E] font-black">R$ {p.price}</p>
              </div>
            ))}
          </div>
        </section>

        {showForm && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
            <form onSubmit={saveProduct} className="bg-slate-800 w-full rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Produto</h3>
                <button type="button" onClick={() => setShowForm(false)}><X/></button>
              </div>
              <input required placeholder="Nome" className="w-full bg-slate-900 p-4 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Preço (00,00)" className="w-full bg-slate-900 p-4 rounded-xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input placeholder="URL da Imagem" className="w-full bg-slate-900 p-4 rounded-xl" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              <button type="submit" className="w-full bg-[#22C55E] py-4 rounded-xl font-bold">Salvar Alterações</button>
            </form>
          </div>
        )}
      </div>
    );
  };

  const BookingScreen = () => {
    const [step, setStep] = useState<'list' | 'create'>('list');
    const [selTime, setSelTime] = useState('');
    const [done, setDone] = useState(false);

    const handleConfirm = () => {
      setBookings([{id: Date.now().toString(), petName, service: 'Banho & Tosa', date: 'Hoje', time: selTime}, ...bookings]);
      setDone(true);
      setTimeout(() => { setDone(false); setStep('list'); }, 2000);
    };

    if (done) return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-in zoom-in duration-500">
        <CheckCircle2 size={80} className="text-[#22C55E] mb-4" />
        <h2 className="text-3xl font-black">Reservado!</h2>
        <p className="text-slate-400">Esperamos o {petName} às {selTime}.</p>
      </div>
    );

    return (
      <div className="p-6 space-y-6">
        <header className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('home')} className="bg-slate-800 p-2 rounded-xl"><ChevronLeft/></button>
          <h1 className="text-xl font-bold">Agendamentos</h1>
        </header>

        <div className="flex bg-slate-800 p-1 rounded-2xl">
          <button onClick={() => setStep('list')} className={`flex-1 py-3 rounded-xl font-bold text-[10px] ${step === 'list' ? 'bg-[#22C55E]' : 'text-slate-500'}`}>MINHA LISTA</button>
          <button onClick={() => setStep('create')} className={`flex-1 py-3 rounded-xl font-bold text-[10px] ${step === 'create' ? 'bg-[#22C55E]' : 'text-slate-500'}`}>NOVO HORÁRIO</button>
        </div>

        {step === 'list' ? (
          <div className="space-y-4">
            {bookings.length === 0 && <p className="text-center text-slate-500 py-20">Nenhum agendamento ativo.</p>}
            {bookings.map(b => (
              <div key={b.id} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/30 flex justify-between items-center">
                <div>
                  <p className="font-bold">{b.service}</p>
                  <p className="text-xs text-slate-500">{b.petName} • {b.time}</p>
                </div>
                <button onClick={() => setBookings(prev => prev.filter(x => x.id !== b.id))} className="text-red-500"><X size={18}/></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase">Escolha o Horário</p>
              <div className="grid grid-cols-3 gap-3">
                {availableTimes.map(t => (
                  <button key={t} onClick={() => setSelTime(t)} className={`py-4 rounded-xl font-bold ${selTime === t ? 'bg-[#22C55E]' : 'bg-slate-800 text-slate-400'}`}>{t}</button>
                ))}
              </div>
            </div>
            <button disabled={!selTime} onClick={handleConfirm} className="w-full bg-[#22C55E] py-5 rounded-2xl font-bold shadow-lg disabled:opacity-50">Confirmar Reserva</button>
          </div>
        )}
      </div>
    );
  };

  const ProductDetail = () => {
    if (!selectedProduct) return null;
    return (
      <div className="h-full">
        <div className="relative h-2/3">
          <img src={selectedProduct.image} className="w-full h-full object-cover" />
          <button onClick={() => setCurrentScreen('home')} className="absolute top-6 left-6 bg-black/40 p-3 rounded-2xl backdrop-blur-md"><ChevronLeft/></button>
        </div>
        <div className="p-8 -mt-10 bg-[#0F172A] rounded-t-[40px] space-y-4 min-h-full">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-black">{selectedProduct.name}</h1>
            <p className="text-[#22C55E] text-2xl font-black">R${selectedProduct.price}</p>
          </div>
          <div className="flex text-yellow-500 gap-1"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
          <p className="text-slate-400 leading-relaxed">{selectedProduct.description}</p>
          <button className="w-full bg-[#22C55E] py-5 rounded-2xl font-bold flex items-center justify-center gap-3 mt-8 shadow-xl shadow-emerald-500/20">
            <ShoppingCart size={20} /> Comprar Agora
          </button>
        </div>
      </div>
    );
  };

  const ProfileScreen = () => (
    <div className="p-8 space-y-10">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-[48px] overflow-hidden border-4 border-[#22C55E] p-1">
            <img src={userRole === 'owner' ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400" : "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400"} className="w-full h-full object-cover rounded-[40px]" />
          </div>
          <button className="absolute bottom-0 right-0 bg-[#22C55E] p-2 rounded-xl border-4 border-[#0F172A]"><Camera size={16}/></button>
        </div>
        <h2 className="text-3xl font-black mt-4">{userRole === 'owner' ? userName : petName}</h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{userRole === 'owner' ? 'Dono do Estabelecimento' : `Dono(a): ${userName}`}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-[#22C55E]"><ShoppingBag size={20}/></div>
            <div><p className="font-bold">Meus Pedidos</p><p className="text-[10px] text-slate-500">3 compras realizadas</p></div>
          </div>
          <ChevronLeft size={20} className="rotate-180 text-slate-600" />
        </div>
        <button onClick={() => setCurrentScreen('login')} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-500 font-bold py-5 rounded-3xl border border-red-500/20">
          <LogOut size={20} /> Encerrar Sessão
        </button>
      </div>
    </div>
  );

  // --- RENDERIZADOR ---
  return (
    <div className="flex flex-col h-full bg-[#0F172A] text-white overflow-hidden max-w-md mx-auto relative shadow-2xl">
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">
        {currentScreen === 'splash' && <SplashScreen />}
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'booking' && <BookingScreen />}
        {currentScreen === 'product_detail' && <ProductDetail />}
        {currentScreen === 'profile' && <ProfileScreen />}
      </div>

      {['home', 'booking', 'product_detail', 'profile'].includes(currentScreen) && (
        <nav className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-5 flex justify-around items-center z-50">
          <button onClick={() => setCurrentScreen('home')} className={`flex flex-col items-center gap-1 ${currentScreen === 'home' ? 'text-[#22C55E]' : 'text-slate-500'}`}><Home size={22}/><span className="text-[9px] font-bold">Início</span></button>
          <button onClick={() => setCurrentScreen('booking')} className={`flex flex-col items-center gap-1 ${currentScreen === 'booking' ? 'text-[#22C55E]' : 'text-slate-500'}`}><Calendar size={22}/><span className="text-[9px] font-bold">Agenda</span></button>
          <button onClick={() => setCurrentScreen('profile')} className={`flex flex-col items-center gap-1 ${currentScreen === 'profile' ? 'text-[#22C55E]' : 'text-slate-500'}`}><User size={22}/><span className="text-[9px] font-bold">Perfil</span></button>
        </nav>
      )}
    </div>
  );
}
