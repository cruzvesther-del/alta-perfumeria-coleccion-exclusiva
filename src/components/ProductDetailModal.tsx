import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, MessageCircle, Gift, Sparkles, Check, Clock, Wind, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { generateProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product, sizeIndex: number, quantity: number, giftWrap: boolean, giftMessage?: string) => void;
  onBuyNow: (product: Product, sizeIndex: number, quantity: number, giftWrap: boolean, giftMessage?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onBuyNow
}) => {
  if (!isOpen || !product) return null;

  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(product.defaultSizeIndex);
  const [quantity, setQuantity] = useState<number>(1);
  const [giftWrap, setGiftWrap] = useState<boolean>(false);
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [deliveryCity, setDeliveryCity] = useState<string>('Juliaca');
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const currentSize = product.sizes[selectedSizeIndex] || product.sizes[0];
  const totalPrice = currentSize.price * quantity;

  const handleAddToCart = () => {
    onAddToCart(product, selectedSizeIndex, quantity, giftWrap, giftMessage);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSizeIndex, quantity, giftWrap, giftMessage);
    onClose();
  };

  const whatsappUrl = generateProductWhatsAppUrl({
    productName: product.name,
    sizeName: currentSize.size,
    price: currentSize.price,
    giftWrap,
    giftMessage,
    deliveryCity
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 z-10 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left Column: Visual Showcase */}
          <div className="md:col-span-5 bg-[#FAF8F5] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-md bg-white border border-stone-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-4/3 object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src.includes('/src/assets/images/')) {
                      target.src = target.src.replace('/src/assets/images/', '/images/');
                    } else if (!target.src.includes('/images/perfume_dama_floral_1792432937694.jpg')) {
                      target.src = '/images/perfume_dama_floral_1792432937694.jpg';
                    }
                  }}
                />
                <button
                  onClick={() => onToggleFavorite(product)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-xs transition-colors ${
                    isFavorite
                      ? 'bg-rose-50 text-rose-600 shadow-sm'
                      : 'bg-white/80 text-stone-600 hover:bg-white'
                  }`}
                  aria-label="Guardar en favoritos"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Poetic quote box */}
              <div className="mt-5 p-4 rounded-xl bg-white border border-stone-200/80 text-xs text-stone-600 italic">
                <p className="font-serif-luxury text-stone-900 text-sm not-italic mb-1">
                  Nota del Autor:
                </p>
                "{product.poeticNotes}"
              </div>
            </div>

            {/* Performance metrics: Longevity & Sillage */}
            <div className="mt-6 pt-4 border-t border-stone-200 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-500 font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>Longevidad</span>
                </div>
                <div className="font-semibold text-stone-800 text-[11px]">
                  {product.longevity}
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-500 font-medium mb-1">
                  <Wind className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>Estela & Proyección</span>
                </div>
                <div className="font-semibold text-stone-800 text-[11px]">
                  {product.sillage}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contiguous Purchase Module & Pyramid */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#8C6D23] mb-1">
                <span>{product.categoryLabel}</span>
                <span>·</span>
                <span>{product.concentration}</span>
                <span>·</span>
                <span>{product.olfactoryFamilyLabel}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
                {product.name}
              </h2>

              <p className="text-stone-500 text-xs sm:text-sm italic mt-0.5">
                {product.tagline}
              </p>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-800 tabular-nums">
                  {product.rating.toFixed(1)} / 5.0
                </span>
                <span className="text-xs text-stone-400">
                  ({product.reviewCount} valoraciones de clientes)
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>

            {/* EXPLICIT OLFACTORY PYRAMID */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>Pirámide Olfativa Detallada</span>
                </h3>
                <span className="text-[10px] text-stone-400 font-medium">Evolución en piel</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Notas de Salida */}
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/70">
                  <span className="font-semibold text-stone-900 block text-[11px] uppercase tracking-wider text-[#8C6D23]">
                    1. Notas de Salida (Primeros 15-30 min):
                  </span>
                  <p className="text-stone-600 mt-0.5">
                    {product.pyramid.top.join(' · ')}
                  </p>
                </div>

                {/* Notas de Corazón */}
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/70">
                  <span className="font-semibold text-stone-900 block text-[11px] uppercase tracking-wider text-[#8C6D23]">
                    2. Notas de Corazón (El alma, 4-6 hrs):
                  </span>
                  <p className="text-stone-600 mt-0.5">
                    {product.pyramid.heart.join(' · ')}
                  </p>
                </div>

                {/* Notas de Fondo */}
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/70">
                  <span className="font-semibold text-stone-900 block text-[11px] uppercase tracking-wider text-[#8C6D23]">
                    3. Notas de Fondo (Fijación, hasta 24 hrs):
                  </span>
                  <p className="text-stone-600 mt-0.5">
                    {product.pyramid.base.join(' · ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Volume / Size Options */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                Selecciona la Presentación / Volumen:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`py-2 px-3 rounded-xl text-left border transition-all ${
                      selectedSizeIndex === idx
                        ? 'border-[#D4AF37] bg-white ring-2 ring-[#D4AF37]/30 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                    }`}
                  >
                    <div className="text-xs font-semibold text-stone-900">
                      {s.size}
                    </div>
                    <div className="text-xs font-bold text-[#8C6D23] tabular-nums mt-0.5">
                      S/ {s.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Price Summary */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 font-medium">Cantidad:</span>
                <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-sm font-bold text-stone-600 hover:bg-stone-200 rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-stone-800 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-sm font-bold text-stone-600 hover:bg-stone-200 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-stone-400 block">Subtotal</span>
                <span className="text-2xl font-bold text-stone-900 tabular-nums">
                  S/ {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Gift Wrap & Personalization */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="rounded text-[#D4AF37] focus:ring-[#D4AF37] w-4 h-4"
                />
                <Gift className="w-4 h-4 text-[#8C6D23]" />
                <span>Incluir Envoltura de Regalo de Lujo + Tarjeta Caligrafiada (Sin costo)</span>
              </label>

              {giftWrap && (
                <div className="space-y-2 pt-1">
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Escribe la dedicatoria especial que grabaremos en la tarjeta..."
                    rows={2}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-500">Ciudad de entrega:</span>
                    <input
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      placeholder="Juliaca / Otra ciudad"
                      className="text-xs px-2 py-1 bg-white border border-stone-300 rounded focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 bg-[#1A1A1A] hover:bg-[#2E2E2E] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>{addedNotice ? '¡Añadido al Carrito!' : 'Agregar al Carrito'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 bg-[#8C6D23] hover:bg-[#725719] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Comprar Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Direct WhatsApp Order Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir por WhatsApp (+51 999 199 969)</span>
              </a>
            </div>

            {/* Added notice banner */}
            {addedNotice && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Producto añadido exitosamente! Puedes revisar tu carrito o seguir explorando.</span>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
