
import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Plus, X, Droplets, Scissors, Sparkles, Check } from 'lucide-react';
import { Booking } from '../../types';

interface Props {
  onBack: () => void;
  onConfirm: (booking: Booking) => void;
  onDelete: (id: string) => void;
  bookings: Booking[];
  defaultPetName: string;
  availableTimes: string[];
  isAdmin: boolean;
  onAddTime: (time: string) => void;
  onDeleteTime: (time: string) => void;
}

const BookingScreen: React.FC<Props> = ({ onBack, onConfirm, onDelete, bookings, defaultPetName, availableTimes, isAdmin, onAddTime, onDeleteTime }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>(bookings.length > 0 ? 'list' : 'create');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState('Banho & Tosa');
  const [petName, setPetName] = useState(defaultPetName);
  const [isDone, setIsDone] = useState(false);
  const [newTime, setNewTime] = useState('');

  const handleBooking = () => {
    if (!selectedTime) return;
    onConfirm({ id: Math.random().toString(36).substr(2,9), petName, service: selectedService, date: 'Hoje', time: selectedTime, status: 'Confirmado' });
    setIsDone(true);
    setTimeout(() => { setIsDone(false); setActiveTab('list'); }, 2000);
  };

  if (isDone) return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in">
      <CheckCircle2 size={80} className="text-[#22C55E] mb-4" />
      <h2 className="text-3xl font-bold">Agendado!</h2>
      <p className="text-slate-400">Tudo pronto para o {petName}.</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6 pb-20">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="bg-slate-800 p-2 rounded-xl"><ChevronLeft/></button>
        <h1 className="text-xl font-bold">Agenda de Serviços</h1>
      </header>

      <div className="flex bg-slate-800 p-1 rounded-2xl">
        <button onClick={() => setActiveTab('list')} className={`flex-1 py-3 rounded-xl text-xs font-bold ${activeTab === 'list' ? 'bg-[#22C55E]' : 'text-slate-500'}`}>MEUS AGENDAMENTOS</button>
        <button onClick={() => setActiveTab('create')} className={`flex-1 py-3 rounded-xl text-xs font-bold ${activeTab === 'create' ? 'bg-[#22C55E]' : 'text-slate-500'}`}>NOVO HORÁRIO</button>
      </div>

      {activeTab === 'list' ? (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <p className="font-bold">{b.service}</p>
                <p className="text-xs text-slate-500">{b.petName} • {b.time}</p>
              </div>
              <button onClick={() => onDelete(b.id)} className="text-red-500"><X size={18}/></button>
            </div>
          ))}
          <button onClick={() => setActiveTab('create')} className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 font-bold">+ Novo</button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {['Banho', 'Tosa', 'Combo'].map(s => (
              <button key={s} onClick={() => setSelectedService(s)} className={`py-3 rounded-xl text-xs font-bold border-2 ${selectedService === s ? 'border-[#22C55E] bg-[#22C55E]/10' : 'border-transparent bg-slate-800'}`}>{s}</button>
            ))}
          </div>
          <input value={petName} onChange={e => setPetName(e.target.value)} className="w-full bg-slate-800 p-4 rounded-xl" placeholder="Nome do Pet" />
          
          <div className="space-y-3">
             <p className="text-xs font-bold text-slate-500 uppercase">Horários</p>
             <div className="grid grid-cols-3 gap-2">
               {availableTimes.map(t => (
                 <div key={t} className="relative group">
                   <button onClick={() => setSelectedTime(t)} className={`w-full py-3 rounded-xl font-bold text-sm ${selectedTime === t ? 'bg-[#22C55E]' : 'bg-slate-800 text-slate-400'}`}>{t}</button>
                   {isAdmin && <button onClick={() => onDeleteTime(t)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"><X size={8}/></button>}
                 </div>
               ))}
               {isAdmin && (
                 <div className="flex gap-1">
                   <input value={newTime} onChange={e => setNewTime(e.target.value)} placeholder="00:00" className="w-16 bg-slate-900 text-xs rounded-lg px-1" />
                   <button onClick={() => { onAddTime(newTime); setNewTime(''); }} className="bg-[#22C55E] p-1 rounded-lg"><Plus size={14}/></button>
                 </div>
               )}
             </div>
          </div>
          <button disabled={!selectedTime} onClick={handleBooking} className="w-full bg-[#22C55E] py-5 rounded-2xl font-bold shadow-lg disabled:opacity-50">Confirmar Reserva</button>
        </div>
      )}
    </div>
  );
};
export default BookingScreen;
