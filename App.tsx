
import React, { useState, useEffect } from 'react';
import { Screen, Booking, Product, UserRole } from './types';
import SplashScreen from './components/screens/SplashScreen';
import LoginScreen from './components/screens/LoginScreen';
import HomeScreen from './components/screens/HomeScreen';
import BookingScreen from './components/screens/BookingScreen';
import ProductDetailScreen from './components/screens/ProductDetailScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import BottomNav from './components/BottomNav';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Ração Premium Gold', price: '159,90', image: 'https://images.unsplash.com/photo-1589924691106-073b69759fbb?auto=format&fit=crop&q=80&w=400', description: 'Ração de alta qualidade para cães adultos.' },
  { id: '2', name: 'Brinquedo Interativo', price: '45,00', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400', description: 'Diversão garantida para seu pet.' },
  { id: '3', name: 'Cama Ortopédica', price: '289,00', image: 'https://images.unsplash.com/photo-1591946614421-1d978fc02716?auto=format&fit=crop&q=80&w=400', description: 'Conforto absoluto para o sono.' },
];

const INITIAL_TIMES = ["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [userName, setUserName] = useState<string>('Visitante');
  const [petName, setPetName] = useState<string>('Seu Pet');
  const [history, setHistory] = useState<Screen[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>(INITIAL_TIMES);

  const navigateTo = (screen: Screen, params?: any) => {
    setHistory(prev => [...prev, currentScreen]);
    if (params?.product) setSelectedProduct(params.product);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(prevHistory => prevHistory.slice(0, -1));
      setCurrentScreen(prev);
    }
  };

  const handleLogin = (role: UserRole, user?: string, pet?: string) => {
    setUserRole(role);
    if (user) setUserName(user);
    if (pet) setPetName(pet);
    setCurrentScreen(Screen.HOME);
  };

  const handleLogout = () => {
    setCurrentScreen(Screen.LOGIN);
    setHistory([]);
    setUserName('Visitante');
    setPetName('Seu Pet');
    setUserRole('customer');
  };

  const addBooking = (newBooking: Booking) => setBookings(prev => [newBooking, ...prev]);
  const deleteBooking = (id: string) => setBookings(prev => prev.filter(b => b.id !== id));
  
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === updatedProduct.id);
      if (exists) return prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      return [updatedProduct, ...prev];
    });
    if (selectedProduct?.id === updatedProduct.id) setSelectedProduct(updatedProduct);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
      setCurrentScreen(Screen.HOME);
    }
  };

  const handleAddTime = (newTime: string) => {
    setAvailableTimes(prev => [...prev, newTime].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })));
  };

  const handleDeleteTime = (time: string) => setAvailableTimes(prev => prev.filter(t => t !== time));

  useEffect(() => {
    if (currentScreen === Screen.SPLASH) {
      const timer = setTimeout(() => setCurrentScreen(Screen.LOGIN), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.SPLASH: return <SplashScreen />;
      case Screen.LOGIN: return <LoginScreen onLogin={handleLogin} />;
      case Screen.HOME: return <HomeScreen onNavigate={navigateTo} bookings={bookings} products={products} userRole={userRole} userName={userName} petName={petName} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} />;
      case Screen.BOOKING: return <BookingScreen onBack={goBack} onConfirm={addBooking} onDelete={deleteBooking} bookings={bookings} defaultPetName={petName} availableTimes={availableTimes} isAdmin={userRole === 'owner'} onAddTime={handleAddTime} onDeleteTime={handleDeleteTime} />;
      case Screen.PRODUCT_DETAIL: return <ProductDetailScreen onBack={goBack} product={selectedProduct} isAdmin={userRole === 'owner'} onUpdate={handleUpdateProduct} />;
      case Screen.PET_PROFILE: return <ProfileScreen petName={petName} onLogout={handleLogout} userRole={userRole} userName={userName} />;
      default: return <HomeScreen onNavigate={navigateTo} bookings={bookings} products={products} userRole={userRole} userName={userName} petName={petName} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} />;
    }
  };

  const showBottomNav = [Screen.HOME, Screen.BOOKING, Screen.PRODUCT_DETAIL, Screen.PET_PROFILE].includes(currentScreen);

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-white max-w-md mx-auto shadow-2xl relative overflow-hidden font-sans">
      <main className={`flex-1 overflow-y-auto ${showBottomNav ? 'pb-24' : ''}`}>
        {renderScreen()}
      </main>
      {showBottomNav && <BottomNav currentScreen={currentScreen} onNavigate={(s) => setCurrentScreen(s)} />}
    </div>
  );
};

export default App;
