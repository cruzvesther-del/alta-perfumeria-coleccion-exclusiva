import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  MessageCircle, 
  Check, 
  ArrowUpDown,
  FilterX,
  Database,
  UploadCloud,
  RefreshCw
} from 'lucide-react';

import { PRODUCTS_DATABASE, CATEGORIES_LIST } from './data/products';
import { Product, CartItem, OlfactoryFamilyType } from './types';
import { STORE_INFO } from './data/extras';
import { 
  fetchProductsFromSupabase, 
  saveCatalogToSupabase, 
  SupabaseProductRow,
  PRODUCTS_TABLE 
} from './lib/products-supabase';
import { SupabaseCatalogModal } from './components/SupabaseCatalogModal';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OlfactoryFamilies } from './components/OlfactoryFamilies';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FavoritesModal } from './components/FavoritesModal';
import { DiscoverySection } from './components/DiscoverySection';
import { BrandStory } from './components/BrandStory';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BlogSection } from './components/BlogSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { CitasSection } from './components/CitasSection';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';
import { generateInquiryWhatsAppUrl } from './utils/whatsapp';

export default function App() {
  // LocalStorage state for Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ecv_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage state for Favorites
  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ecv_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Filtering State
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedOlfactoryFamily, setSelectedOlfactoryFamily] = useState<OlfactoryFamilyType | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'destacados' | 'precio-asc' | 'precio-desc' | 'rating'>('destacados');

  // Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'privacidad' | 'terminos' | 'envios' | null>(null);

  // Coupons
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Supabase 'productos' state
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATABASE);
  const [rawSupabaseRows, setRawSupabaseRows] = useState<SupabaseProductRow[]>([]);
  const [productsSource, setProductsSource] = useState<'supabase' | 'cache' | 'default'>('default');
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isQuickSyncing, setIsQuickSyncing] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch products from Supabase 'productos' table on mount
  const loadProductsFromSupabase = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetchProductsFromSupabase();
      if (res.products && res.products.length > 0) {
        setProducts(res.products);
      }
      setProductsSource(res.source);
      if (res.rawRows) {
        setRawSupabaseRows(res.rawRows);
      }
    } catch (err) {
      console.error('Error fetching products from Supabase:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProductsFromSupabase();
  }, []);

  // Quick sync all products to Supabase 'productos'
  const handleQuickSaveToSupabase = async () => {
    setIsQuickSyncing(true);
    try {
      const res = await saveCatalogToSupabase(products);
      if (res.success) {
        showToast(`✨ Se guardaron ${res.insertedCount} fragancias en la tabla 'productos' de Supabase`);
        await loadProductsFromSupabase();
      } else {
        showToast(`📦 Catálogo sincronizado en caché (${res.error || 'Verifica tabla productos'})`);
        setIsSupabaseModalOpen(true);
      }
    } catch (e: any) {
      showToast(`Error al conectar con Supabase: ${e?.message || ''}`);
    } finally {
      setIsQuickSyncing(false);
    }
  };

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem('ecv_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cart]);

  // Persist Favorites
  useEffect(() => {
    try {
      localStorage.setItem('ecv_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving favorites to localStorage', e);
    }
  }, [favorites]);

  // Toggle Favorite
  const handleToggleFavorite = (product: Product) => {
    const isFav = favorites.some((f) => f.id === product.id);
    if (isFav) {
      setFavorites(favorites.filter((f) => f.id !== product.id));
      showToast(`"${product.name}" eliminado de favoritos`);
    } else {
      setFavorites([...favorites, product]);
      showToast(`✨ "${product.name}" guardado en tus favoritos`);
    }
  };

  // Add To Cart from Detail Modal
  const handleAddToCart = (
    product: Product,
    sizeIndex: number,
    quantity: number,
    giftWrap: boolean,
    giftMessage?: string
  ) => {
    const chosenSize = product.sizes[sizeIndex] || product.sizes[0];
    const cartItemId = `${product.id}-${chosenSize.size}-${giftWrap ? 'gift' : 'regular'}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((it) => it.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prevCart];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          giftMessage: giftMessage || next[existingIndex].giftMessage
        };
        return next;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            product,
            selectedSize: chosenSize.size,
            price: chosenSize.price,
            quantity,
            giftWrap,
            giftMessage
          }
        ];
      }
    });

    showToast(`🛒 "${product.name}" (${chosenSize.size}) añadido al carrito`);
  };

  // Quick Add To Cart from Card
  const handleQuickAddToCart = (product: Product) => {
    const defaultSize = product.sizes[product.defaultSizeIndex] || product.sizes[0];
    handleAddToCart(product, product.defaultSizeIndex, 1, false);
    setIsCartOpen(true);
  };

  // Buy Now (Add to cart & open checkout)
  const handleBuyNow = (
    product: Product,
    sizeIndex: number,
    quantity: number,
    giftWrap: boolean,
    giftMessage?: string
  ) => {
    handleAddToCart(product, sizeIndex, quantity, giftWrap, giftMessage);
    setIsProductDetailOpen(false);
    setIsCheckoutOpen(true);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove Item
  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((it) => it.id !== id));
  };

  // Apply Coupon
  const handleApplyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'ESTHER10') {
      const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
      setCouponCode('ESTHER10');
      setAppliedDiscount(subtotal * 0.1);
      showToast('🎉 ¡Cupón ESTHER10 aplicado! 10% de descuento.');
      return true;
    } else if (cleanCode === 'LUJO20' || cleanCode === 'BIENVENIDA20') {
      setCouponCode(cleanCode);
      setAppliedDiscount(20);
      showToast('🎉 ¡Cupón aplicado! S/ 20.00 de descuento.');
      return true;
    }
    return false;
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (activeCategory !== 'todos' && prod.category !== activeCategory) {
        return false;
      }
      // Olfactory family filter
      if (selectedOlfactoryFamily && prod.olfactoryFamily !== selectedOlfactoryFamily) {
        return false;
      }
      // Search query filter (matches name, tagline, description, or notes)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesCategory = prod.categoryLabel.toLowerCase().includes(query);
        const matchesFamily = prod.olfactoryFamilyLabel.toLowerCase().includes(query);
        const matchesNotes = [
          ...prod.pyramid.top,
          ...prod.pyramid.heart,
          ...prod.pyramid.base
        ].some((n) => n.toLowerCase().includes(query));

        if (!matchesName && !matchesCategory && !matchesFamily && !matchesNotes) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.sizes[a.defaultSizeIndex]?.price || 0;
      const priceB = b.sizes[b.defaultSizeIndex]?.price || 0;
      if (sortBy === 'precio-asc') return priceA - priceB;
      if (sortBy === 'precio-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Destacados default
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, activeCategory, selectedOlfactoryFamily, searchQuery, sortBy]);

  const discoveryProduct = products.find((p) => p.id === 'discovery-box-luxe') || products[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-medium border border-stone-700 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        cartCount={cart.reduce((sum, it) => sum + it.quantity, 0)}
        favoritesCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('catalogo');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Olfactory Families Interactive Filter Cards */}
        <OlfactoryFamilies
          selectedFamily={selectedOlfactoryFamily}
          onSelectFamily={(fam) => setSelectedOlfactoryFamily(fam)}
        />

        {/* Catalog Section */}
        <section id="catalogo" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#8C6D23]">
                Catálogo Exclusivo
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-medium text-stone-900 mt-1">
                Nuestras Creaciones Olfativas
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Fragancias concentradas, elixires y productos de autor con notas de Grasse, Damasco y Oriente.
              </p>
            </div>

            {/* Sort & Quick Filter Stats */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Supabase Status / Action Badge */}
              <button
                type="button"
                onClick={() => setIsSupabaseModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer group"
                title="Ver estado de conexión con la tabla 'productos' de Supabase"
              >
                <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Supabase:</span>
                <span className="font-mono text-[11px] text-amber-200">public.productos</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </button>

              <button
                type="button"
                onClick={handleQuickSaveToSupabase}
                disabled={isQuickSyncing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#8C6D23] hover:bg-[#725719] text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                title="Guardar todas las fragancias en la tabla 'productos' de Supabase"
              >
                {isQuickSyncing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5 text-amber-200" />
                )}
                <span>{isQuickSyncing ? 'Sincronizando...' : 'Guardar en Supabase'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-stone-600 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-medium">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="destacados">Destacados</option>
                  <option value="precio-asc">Precio: Menor a Mayor</option>
                  <option value="precio-desc">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor Valorados</option>
                </select>
              </div>
            </div>
          </div>

          {/* Supabase Live Status Notification */}
          <div className="mb-6 p-3 bg-white border border-stone-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2 text-stone-700">
              <span className={`w-2 h-2 rounded-full ${
                productsSource === 'supabase' ? 'bg-emerald-500' : 'bg-blue-500'
              } animate-ping`} />
              <span className="font-semibold text-stone-900">
                {productsSource === 'supabase'
                  ? 'Catálogo sincronizado en tiempo real desde Supabase'
                  : 'Catálogo activo con persistencia y sincronización lista para Supabase'}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-500">
                Tabla <strong className="font-mono text-stone-800 font-semibold">'productos'</strong> (nombre, precio, descripcion, imagen, stock)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-stone-500 font-medium">
                {products.length} fragancias cargadas
              </span>
              <button
                type="button"
                onClick={() => setIsSupabaseModalOpen(true)}
                className="text-[#8C6D23] hover:underline font-bold text-xs"
              >
                Configurar / Ver SQL →
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {CATEGORIES_LIST.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                  }}
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Filter Indicators */}
          {(selectedOlfactoryFamily || searchQuery || activeCategory !== 'todos') && (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400">Filtros aplicados:</span>
              
              {activeCategory !== 'todos' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-stone-800 font-medium">
                  <span>Categoría: {CATEGORIES_LIST.find((c) => c.id === activeCategory)?.label}</span>
                  <button onClick={() => setActiveCategory('todos')} className="hover:text-black">×</button>
                </span>
              )}

              {selectedOlfactoryFamily && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8C5C8] text-[#1A1A1A] font-medium">
                  <span>Familia: {selectedOlfactoryFamily}</span>
                  <button onClick={() => setSelectedOlfactoryFamily(null)} className="hover:text-black">×</button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-medium">
                  <span>Búsqueda: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-black">×</button>
                </span>
              )}

              <button
                onClick={() => {
                  setActiveCategory('todos');
                  setSelectedOlfactoryFamily(null);
                  setSearchQuery('');
                }}
                className="text-stone-500 hover:text-stone-900 underline text-xs ml-2"
              >
                Limpiar todos
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <FilterX className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-stone-800">
                No encontramos perfumes con esos criterios
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Prueba a restablecer los filtros o busca notas específicas como Oud, Bergamota, Rosa o Vainilla.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('todos');
                  setSelectedOlfactoryFamily(null);
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-full hover:bg-stone-800 transition-colors"
              >
                Restablecer Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isFavorite={favorites.some((f) => f.id === prod.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectProduct={(p) => {
                    setSelectedProduct(p);
                    setIsProductDetailOpen(true);
                  }}
                  onQuickAddToCart={handleQuickAddToCart}
                />
              ))}
            </div>
          )}

        </section>

        {/* Discovery Sets & Decants Spotlight */}
        <DiscoverySection
          discoveryProduct={discoveryProduct}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setIsProductDetailOpen(true);
          }}
          onQuickAddToCart={handleQuickAddToCart}
        />

        {/* Brand Story & Philosophy */}
        <BrandStory />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Citas & Asesoría Olfativa (Conectado a Supabase: tabla citas) */}
        <CitasSection />

        {/* Blog / Olfactory Guides */}
        <BlogSection />

        {/* FAQ Accordion */}
        <FaqSection />

        {/* Contact & Boutique Info */}
        <ContactSection />
      </main>

      {/* Floating WhatsApp Quick Action Button */}
      <aside aria-label="Botón de WhatsApp" className="fixed bottom-6 right-6 z-40">
        <a
          href={generateInquiryWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
          title="Asesoría directa por WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            WhatsApp Pedidos
          </span>
        </a>
      </aside>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('catalogo');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenLegal={(type) => setLegalModalType(type)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        isFavorite={selectedProduct ? favorites.some((f) => f.id === selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        couponCode={couponCode}
        appliedDiscount={appliedDiscount}
        onApplyCoupon={handleApplyCoupon}
      />

      {/* Checkout 3-Step Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discount={appliedDiscount}
        onOrderCompleted={() => {
          setCart([]);
          setAppliedDiscount(0);
          setCouponCode('');
        }}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleToggleFavorite}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setIsProductDetailOpen(true);
        }}
        onQuickAddToCart={handleQuickAddToCart}
      />

      {/* Legal Policies Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Supabase Catalog Management Modal */}
      <SupabaseCatalogModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        products={products}
        rawRows={rawSupabaseRows}
        source={productsSource}
        onRefresh={loadProductsFromSupabase}
        onCatalogUpdated={loadProductsFromSupabase}
        isLoading={isLoadingProducts}
      />

    </div>
  );
}
