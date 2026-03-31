import React, { useContext, useEffect, useState } from 'react';
import { Leaf, Menu, ShoppingBag, X } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

const NAV_LINKS = [
  { label: 'Menu', page: 'menu' },
  { label: 'Locations', page: 'locations' },
  { label: 'Catering', page: 'catering' },
  { label: 'Journal', page: 'about' }
];

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
    <nav
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'pt-4 md:pt-6' : 'pt-0'}`}
      style={{ willChange: 'padding, transform' }}
    >
      <div className="mx-auto w-full px-4 md:px-6">
        <div
          className={`mx-auto relative flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'max-w-[1000px] h-16 frosted-pill px-8' : 'max-w-[1400px] h-20 md:h-24 px-6 md:px-12'}`}
          style={{ willChange: 'max-width, height, padding, transform' }}
        >
          <button className="relative z-10 flex shrink-0 items-center gap-3" onClick={() => navigate('home')}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-500 ${isScrolled ? 'bg-[#3A4D39]' : 'bg-white'}`}>
              <Leaf className={`h-4 w-4 ${isScrolled ? 'text-white' : 'text-[#3A4D39]'}`} />
            </span>
            <span className={`font-serif text-xl transition-colors duration-500 ${isScrolled ? 'text-[#1C1C1C]' : 'text-white mix-blend-difference'}`}>Tierra</span>
          </button>

          <div className="pointer-events-none absolute inset-0 hidden lg:flex items-center justify-center">
            <div className="pointer-events-auto flex items-center gap-8 xl:gap-10">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 ${isScrolled ? 'text-[#1C1C1C]' : 'text-white mix-blend-difference'}`}
                  onClick={() => navigate(link.page)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-3">
            <button onClick={() => setIsCartOpen(true)} className={`transition-colors duration-300 ${isScrolled ? 'text-[#1C1C1C]' : 'text-white mix-blend-difference'}`}>
              <ShoppingBag />
              {cart.length > 0 && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-[#C5A065]" />}
            </button>
            <button className={`lg:hidden transition-colors duration-300 ${isScrolled ? 'text-[#1C1C1C]' : 'text-white mix-blend-difference'}`} onClick={() => setIsMobileMenuOpen((p) => !p)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full px-4 md:px-6">
        <div className={`mx-auto overflow-hidden rounded-2xl bg-white/95 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${isScrolled ? 'max-w-[1000px]' : 'max-w-[1400px]'} ${isMobileMenuOpen ? 'mt-4 max-h-96 py-6' : 'mt-0 max-h-0 py-0'}`}>
          <div className="flex flex-col items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                className="font-serif text-3xl"
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
    </nav>
  );
}
