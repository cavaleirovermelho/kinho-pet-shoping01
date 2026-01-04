
import React from 'react';
import { ChevronLeft, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';

interface Props { onBack: () => void; product: Product | null; isAdmin: boolean; onUpdate: (p: Product) => void; }

const ProductDetailScreen: React.FC<Props> = ({ onBack, product }) => {
  if (!product) return null;
  return (
    <div className="pb-32">
      <div className="relative h-80">
        <img src={product.image} className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-6 left-6 bg-slate-900/50 p-2 rounded-xl"><ChevronLeft/></button>
      </div>
      <div className="p-6 space-y-4 -mt-6 bg-[#0F172A] rounded-t-[40px] relative">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold flex-1">{product.name}</h1>
          <p className="text-[#22C55E] text-2xl font-black">R$ {product.price}</p>
        </div>
        <div className="flex text-yellow-500 gap-1"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
        <p className="text-slate-400 leading-relaxed">{product.description || 'Produto de alta qualidade selecionado pelo Kinho Pet Shopping.'}</p>
      </div>
      <div className="fixed bottom-24 left-0 right-0 p-6 pointer-events-none">
        <button className="w-full max-w-md mx-auto pointer-events-auto bg-[#22C55E] py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl">
          <ShoppingCart size={20} /> Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};
export default ProductDetailScreen;
