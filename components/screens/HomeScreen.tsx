
import React, { useState } from 'react';
import { Screen, Booking, Product, UserRole } from '../../types';
import { Calendar, ShoppingBag, Bell, Plus, Edit, Trash2, MapPin, X } from 'lucide-react';

interface Props {
  onNavigate: (screen: Screen, params?: any) => void;
  bookings: Booking[];
  products: Product[];
  userRole: UserRole;
  userName: string;
  petName: string;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const HomeScreen: React.FC<Props> = ({ onNavigate, products, userRole, userName, petName, onUpdateProduct, onDeleteProduct }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Product>({ id: '', name: '', price: '', image: '', description: '' });
  const isAdmin = userRole === 'owner';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProduct({ ...formData, id: formData.id || Math.random().toString(36).substr(2, 9) });
    setShowForm(false);
  };

  return (
    <div className="p-6 space-y-8 pb-12">
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1 text-[#22C55E] text-[10px] font-bold uppercase tracking-wider">
            <MapPin size={12} /> Kinho Pet Matriz
          </div>
          <h1 className="text-2xl font-black">Olá, {userName}! 🐾</h1>
        </div>
        <button className="bg-slate-800 p-2.5 rounded-xl text-slate-300 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </header>

      <section 
        onClick={() => onNavigate(Screen.BOOKING)}
        className="bg-gradient-to-br from-[#22C55E] to-[#16a34a] p-6 rounded-[32px] cursor-pointer shadow-xl shadow-[#22C55E]/20"
      >
        <h2 className="text-2xl font-black text-white mb-1">Agendar Banho</h2>
        <p className="text-white/80 text-sm mb-4">Cuidado VIP para o {petName}.</p>
        <button className="bg-white text-emerald-700 px-6 py-2 rounded-xl font-bold text-sm">Reservar agora</button>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Shopping Pet</h3>
          {isAdmin && (
            <button onClick={() => { setFormData({ id: '', name: '', price: '', image: '', description: '' }); setShowForm(true); }} className="bg-[#22C55E] p-2 rounded-full"><Plus size={16} /></button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} onClick={() => onNavigate(Screen.PRODUCT_DETAIL, { product: p })} className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50 relative">
              {isAdmin && (
                <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                  <button onClick={(e) => { e.stopPropagation(); setFormData(p); setShowForm(true); }} className="bg-blue-500 p-1.5 rounded-lg"><Edit size={12}/></button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteProduct(p.id); }} className="bg-red-500 p-1.5 rounded-lg"><Trash2 size={12}/></button>
                </div>
              )}
              <img src={p.image} className="w-full aspect-square object-cover rounded-xl mb-2" />
              <h4 className="font-bold text-sm truncate">{p.name}</h4>
              <p className="text-[#22C55E] font-black text-xs">R$ {p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center p-6">
          <div className="bg-slate-800 w-full rounded-3xl p-6 space-y-4">
            <div className="flex justify-between">
              <h3 className="font-bold">{formData.id ? 'Editar' : 'Novo'} Produto</h3>
              <button onClick={() => setShowForm(false)}><X/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl" />
              <input required placeholder="Preço (ex: 45,00)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl" />
              <input placeholder="URL da Imagem" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl" />
              <textarea placeholder="Descrição" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl h-24" />
              <button type="submit" className="w-full bg-[#22C55E] py-4 rounded-xl font-bold">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default HomeScreen;
