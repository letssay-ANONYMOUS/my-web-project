import React, { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { auth, db, appId, isFirebaseEnabled } from './config/firebase';
import { CartProvider } from './context/CartContext';
import { APP_DATA, SEED_MENU } from './data/constants';
import { MenuService } from './services/menuService';
import { OrderService } from './services/orderService';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/layout/Navbar';
import { ItemModal } from './components/cart/ItemModal';
import { CartDrawer } from './components/layout/CartDrawer';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LocationsPage } from './pages/LocationsPage';
import { CateringPage } from './pages/CateringPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(isFirebaseEnabled ? null : { uid: 'local-user' });
  const [menuItems, setMenuItems] = useState(SEED_MENU);
  const [isLoaded, setIsLoaded] = useState(false);

  const menuService = useMemo(() => new MenuService(db, appId, SEED_MENU), []);
  const orderService = useMemo(() => new OrderService(db, appId), []);

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) return undefined;

    const initAuth = async () => {
      if (globalThis.__initial_auth_token) {
        await signInWithCustomToken(auth, globalThis.__initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };

    initAuth().catch(console.error);
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isFirebaseEnabled || !db) return;
    if (!user) return;

    menuService
      .getOrSeedMenu()
      .then(setMenuItems)
      .catch(() => setMenuItems(SEED_MENU));
  }, [user, menuService]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigate={setCurrentPage} menuItems={menuItems} appData={APP_DATA} />;
      case 'menu':
        return <MenuPage navigate={setCurrentPage} />;
      case 'checkout':
        return (
          <CheckoutPage
            navigate={setCurrentPage}
            user={user}
            orderService={orderService}
            isFirebaseEnabled={isFirebaseEnabled}
          />
        );
      case 'locations':
        return <LocationsPage />;
      case 'catering':
      case 'contact':
        return <CateringPage navigate={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage navigate={setCurrentPage} menuItems={menuItems} appData={APP_DATA} />;
    }
  };

  return (
    <CartProvider>
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
      <div className={`bg-grain transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`min-h-screen transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar navigate={setCurrentPage} />
        <ItemModal />
        <CartDrawer navigate={setCurrentPage} />
        <main>{renderPage()}</main>
        <Footer navigate={setCurrentPage} />
      </div>
    </CartProvider>
  );
}
