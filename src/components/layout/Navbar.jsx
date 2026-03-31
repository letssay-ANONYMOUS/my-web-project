import React, { useContext, useEffect, useState } from 'react';
import { Leaf, Menu, ShoppingBag, X } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

const NAV_LINKS = [
  { label: 'Menu', page: 'menu' },
  { label: 'Locations', page: 'locations' },
  { label: 'Catering', page: 'catering' },
  { label: 'Journal', page: 'about' }
];

function NavShell({ navigate, cart, setIsCartOpen, floating }) {
  const textClass = floating ? 'text-[#1C1C1C]' : 'text-white';
  const iconShellClass = floating ? 'bg-[#3A4D39]' : 'bg-white/92';
  const iconClass = floating ? 'text-white' : 'text-[#3A4D39]';

  return (
    <div
      className={`mx-auto relative flex items-center justify-between ${
        floating
          ? 'frosted-pill h-16 max-w-[1000px] px-8 shadow-[0_18px_44px_rgba(28,28,28,0.10)]'
          : 'h-20 md:h-24 max-w-[1400px] px-6 md:px-12'
      }`}
    >
      <button className="relative z-10 flex shrink-0 items-center gap-3" onClick={() => navigate('home')}>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${iconShellClass}`}>
          <Leaf className={`h-4 w-4 ${iconClass}`} />
        </span>
        <span className={`font-serif text-xl ${textClass}`}>Tierra</span>
      </button>

      <div className="pointer-events-none absolute inset-0 hidden lg:flex items-center justify-center">
        <div className="pointer-events-auto flex items-center gap-8 xl:gap-10">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              className={`text-xs uppercase tracking-[0.2em] transition-opacity duration-300 ${textClass} ${floating ? 'opacity-90 hover:opacity-100' : 'opacity-100'}`}
              onClick={() => navigate(link.page)}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 ml-auto flex shrink-0 items-center gap-3">
        <button onClick={() => setIsCartOpen(true)} className={textClass}>
          <ShoppingBag />
          {cart.length > 0 && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-[#C5A065]" />}
        </button>
      </div>
    </div>
  );
}

export function Navbar({ navigate }) {
  const { cart, setIsCartOpen } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60]">
      <div
        className={`mx-auto w-full px-4 md:px-6 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isScrolled ? 'pointer-events-none opacity-0 -translate-y-3' : 'pointer-events-auto opacity-100 translate-y-0'
        }`}
      >
        <NavShell
          navigate={navigate}
          cart={cart}
          setIsCartOpen={setIsCartOpen}
          floating={false}
        />
      </div>

      <div
        className={`absolute top-0 left-0 right-0 mx-auto w-full px-4 pt-4 md:px-6 md:pt-6 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isScrolled ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-4'
        }`}
      >
        <NavShell
          navigate={navigate}
          cart={cart}
          setIsCartOpen={setIsCartOpen}
          floating
        />

        <div
          className={`mx-auto mt-4 max-w-[1000px] overflow-hidden rounded-2xl bg-white/95 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
            isScrolled && isMobileMenuOpen ? 'max-h-96 py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                className="font-serif text-3xl text-[#1C1C1C]"
                onClick={() => {
                  navigate(link.page);
                  setIsMobileMenuOpen(false);
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        className={`fixed right-8 top-6 z-[61] rounded-full lg:hidden ${
          isScrolled ? 'text-[#1C1C1C]' : 'text-white'
        }`}
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>
    </nav>
  );
}
