
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-8 text-center bg-[#0F172A]">
      <div className="w-full max-w-xs mb-12 transform scale-110 animate-pulse">
        <img 
          src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800" 
          alt="Golden Retriever" 
          className="rounded-3xl shadow-2xl border-4 border-[#22C55E]/20"
        />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tighter mb-2">
        Kinho <span className="text-[#22C55E]">Pet Shopping</span>
      </h1>
      <p className="text-slate-400 text-lg font-light italic">"O shopping do seu melhor amigo"</p>
    </div>
  );
};
export default SplashScreen;
