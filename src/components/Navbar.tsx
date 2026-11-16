import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Phone, Sparkles, MapPin } from 'lucide-react';
import { STORE_INFO } from '../data/extras';

interface NavbarProps {
  cartCount: number;
  favoritesCount: number;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenFavorites,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  activeCategory
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', target: 'inicio', category: 'todos' },
    { label: 'Perfumes Dama', target: 'catalogo', category: 'dama' },
    { label: 'Perfumes Caballero', target: 'catalogo', category: 'caballero' },
    { label: 'Unisex & Árabes', target: 'catalogo', category: 'unisex_arabe' },
    { label: 'Sets & Regalos', target: 'catalogo', category: 'discovery_decants' },
    { label: 'Reservar Cita', target: 'citas', category: null },
    { label: 'Sobre Esther', target: 'sobre-nosotros', category: null },
    { label: 'Contacto', target: 'contacto', category: null },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    if (link.category) {
      onSelectCategory(link.category);
    }
    const el = document.getElementById(link.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-[#1A1A1A] text-[#FAF8F5] text-xs py-2 px-4 transition-all border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#D4AF37]">✨</span>
            <span className="font-light tracking-wide">
              Envíos a Juliaca y todo el Perú <span className="opacity-40">|</span> 🎁 Muestras de autor gratis en cada compra <span className="opacity-40">|</span> 💳 Pagos 100% seguros con Yape, Plin y Tarjetas
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#E8C5C8]">
            <a 
              href={`https://wa.me/${STORE_INFO.phoneClean}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span>Pedidos WhatsApp: {STORE_INFO.phone}</span>
            </a>
            <span className="text-stone-600">·</span>
            <div className="flex items-center gap-1 text-stone-300">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span>Juliaca, Puno</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Sticky */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3' 
            : 'bg-[#FAF8F5] border-b border-stone-200/50 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            {/* Mobile Hamburger & Logo Lockup */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-800 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <a 
                href="#inicio" 
                className="group flex flex-col text-left focus:outline-none"
              >
                <span className="text-xl sm:text-2xl font-serif-luxury font-medium tracking-tight text-[#1A1A1A] group-hover:text-[#8C6D23] transition-colors leading-none">
                  Esther Cruz Velásquez
                </span>
                <span className="text-[10px] tracking-[0.24em] uppercase text-stone-500 font-sans mt-1">
                  Alta Perfumería · Colección Exclusiva
                </span>
              </a>
            </div>

            {/* Center: Smart Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="¿Qué nota o perfume buscas hoy? (ej. Oud, Rosa, Vainilla)"
                  className="w-full bg-white border border-stone-200 text-stone-900 text-xs sm:text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-stone-400 shadow-xs"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs px-1"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist / Favorites */}
              <button
                onClick={onOpenFavorites}
                className="relative p-2 text-stone-700 hover:text-[#1A1A1A] rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Ver favoritos"
                title="Favoritos"
              >
                <Heart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#E8C5C8] text-[#1A1A1A] font-semibold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag / Cart */}
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 bg-[#1A1A1A] text-white px-3.5 py-2 rounded-full hover:bg-[#2E2E2E] transition-all shadow-xs"
                aria-label="Ver carrito de compras"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-medium hidden sm:inline">Carrito</span>
                <span className="bg-[#D4AF37] text-[#1A1A1A] font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Expanded Mobile Search Input */}
          {isSearchExpanded && (
            <div className="md:hidden mt-3 pt-3 border-t border-stone-200">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="¿Qué nota o perfume buscas hoy?"
                  className="w-full bg-white border border-stone-300 text-stone-900 text-sm rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-[#D4AF37]"
                  autoFocus
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Desktop Navigation Category Strip */}
          <nav className="hidden lg:flex items-center justify-center gap-7 pt-3.5 mt-2 border-t border-stone-200/60 text-xs font-medium tracking-wide">
            {navLinks.map((link, idx) => {
              const isActive = link.category === activeCategory;
              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(link)}
                  className={`py-1 relative transition-colors ${
                    isActive 
                      ? 'text-[#1A1A1A] font-semibold' 
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF8F5] shadow-xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h3 className="font-serif-luxury text-lg font-medium text-stone-900">
                    Esther Cruz Velásquez
                  </h3>
                  <p className="text-[10px] tracking-widest uppercase text-stone-500">
                    Alta Perfumería
                  </p>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-stone-500 hover:bg-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1">
                {navLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNavClick(link)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-3 text-xs text-stone-600">
              <a
                href={`https://wa.me/${STORE_INFO.phoneClean}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#1A1A1A] text-white py-2.5 rounded-lg font-medium hover:bg-stone-800 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>WhatsApp: {STORE_INFO.phone}</span>
              </a>
              <div className="text-center text-stone-500 text-[11px]">
                Ubicación: {STORE_INFO.city}, {STORE_INFO.country}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
