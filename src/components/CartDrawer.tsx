import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Gift, 
  Tag, 
  Check, 
  MessageCircle, 
  Truck, 
  CreditCard, 
  QrCode, 
  ChevronLeft,
  Sparkles,
  Lock,
  Building2
} from 'lucide-react';
import { CartItem } from '../types';
import { STORE_INFO } from '../data/extras';
import { generateCartWhatsAppUrl } from '../utils/whatsapp';
import { PaymentFlow } from './PaymentFlow';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  couponCode: string;
  appliedDiscount: number;
  onApplyCoupon: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  couponCode,
  appliedDiscount,
  onApplyCoupon
}) => {
  const [viewMode, setViewMode] = useState<'items' | 'payment'>('items');
  const [couponInput, setCouponInput] = useState(couponCode || '');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= STORE_INFO.freeShippingThreshold;
  const shippingCost = items.length === 0 ? 0 : (isFreeShipping ? 0 : 15);
  const total = Math.max(0, subtotal - appliedDiscount + shippingCost);
  const progressToFreeShipping = Math.min(100, (subtotal / STORE_INFO.freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = onApplyCoupon(couponInput.trim());
    if (ok) {
      setCouponSuccess(true);
      setCouponError('');
    } else {
      setCouponError('Cupón inválido. Prueba con ESTHER10 o LUJO20');
      setCouponSuccess(false);
    }
  };

  const whatsappCartUrl = generateCartWhatsAppUrl(items, total, 'Juliaca');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl flex flex-col z-10 text-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            {viewMode === 'payment' ? (
              <button
                type="button"
                onClick={() => setViewMode('items')}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-600 mr-1"
                title="Volver a los productos"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <ShoppingBag className="w-5 h-5 text-[#8C6D23]" />
            )}
            
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
              {viewMode === 'payment' ? 'Flujo de Pago Seguro' : 'Tu Carrito de Fragancias'}
            </h3>
            
            <span className="text-xs bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-medium">
              {items.reduce((acc, it) => acc + it.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs (when cart has items) */}
        {items.length > 0 && (
          <div className="grid grid-cols-2 p-1.5 bg-stone-100 border-b border-stone-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('items')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'items'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>1. Productos ({items.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('payment')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'payment'
                  ? 'bg-[#1A1A1A] text-white shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>2. Pagar (Yape/Plin/Tarjeta)</span>
            </button>
          </div>
        )}

        {/* Free shipping progress bar (only in items view) */}
        {viewMode === 'items' && (
          <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-stone-600 flex items-center gap-1.5 font-medium">
                <Truck className="w-3.5 h-3.5 text-[#8C6D23]" />
                {isFreeShipping 
                  ? '¡Felicidades! Tienes Envío Gratis a todo el Perú' 
                  : `Agrega S/ ${(STORE_INFO.freeShippingThreshold - subtotal).toFixed(2)} más para Envío Gratis`}
              </span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#D4AF37] h-full transition-all duration-500 rounded-full" 
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* VIEW 1: ITEMS LIST */}
        {viewMode === 'items' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-lg font-medium text-stone-800">
                    Tu carrito está vacío
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    Descubre nuestras fragancias de autor y elixires exclusivos seleccionados por Esther Cruz Velásquez.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-full hover:bg-stone-800 transition-colors"
                >
                  <span>Explorar Perfumes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 items-center justify-between"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 bg-white"
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

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-stone-900 truncate font-serif-luxury">
                        {item.product.name}
                      </h4>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {item.selectedSize} · {item.product.concentration}
                    </div>

                    {item.giftWrap && (
                      <div className="text-[10px] text-[#8C6D23] font-medium flex items-center gap-1 mt-0.5">
                        <Gift className="w-3 h-3" />
                        <span>Con empaque de regalo</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-stone-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-r"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900 tabular-nums">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* VIEW 2: INTEGRATED PAYMENT FLOW */}
        {viewMode === 'payment' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {/* Items Mini Summary Card */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D23]">
                  Resumen de Compra ({items.length} fragancia{items.length > 1 ? 's' : ''})
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('items')}
                  className="text-[11px] text-[#8C6D23] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" /> Editar bolsa
                </button>
              </div>

              {/* Items preview list */}
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between text-[11px] text-stone-700">
                    <span className="truncate max-w-[210px] font-medium">
                      {it.quantity}x {it.product.name} ({it.selectedSize})
                    </span>
                    <span className="font-semibold tabular-nums text-stone-900">
                      S/ {(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                <span className="font-bold text-stone-900">Total a pagar:</span>
                <span className="font-bold text-base text-[#8C6D23] tabular-nums">
                  S/ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Embedded Payment Flow Component with Yape, Plin, Tarjeta, Transferencia */}
            <PaymentFlow 
              totalAmount={total} 
              items={items}
              onBackToCart={() => setViewMode('items')}
              onPaymentSuccess={(method, details) => {
                // If payment processed successfully
              }}
            />

            {/* Direct WhatsApp Confirmation Button */}
            <div className="pt-1">
              <a
                href={whatsappCartUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>¿Dudas? Consultar con Esther Cruz por WhatsApp (+51 999 199 969)</span>
              </a>
            </div>

            <div className="text-center pt-1 pb-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="text-xs text-[#8C6D23] hover:underline font-semibold cursor-pointer"
              >
                ¿Deseas registrar dirección completa y facturación? Ir al Checkout →
              </button>
            </div>
          </div>
        )}

        {/* Footer Area for Items View */}
        {items.length > 0 && viewMode === 'items' && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAF8F5] space-y-3.5">
            
            {/* Promo coupon input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Código de cupón (ej. ESTHER10)"
                    className="w-full text-xs uppercase px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  Aplicar
                </button>
              </div>

              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
              )}
              {couponSuccess && appliedDiscount > 0 && (
                <p className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1">
                  <Check className="w-3 h-3" />
                  <span>¡Descuento de S/ {appliedDiscount.toFixed(2)} aplicado!</span>
                </p>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal productos:</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  S/ {subtotal.toFixed(2)}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Descuento aplicado:</span>
                  <span className="font-semibold tabular-nums">
                    - S/ {appliedDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Costo de envío:</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">
                      ¡Gratis!
                    </span>
                  ) : (
                    `S/ ${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total a pagar:</span>
                <span className="text-lg font-bold text-[#8C6D23] tabular-nums">
                  S/ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Prominent COMPRAR Call-to-Action */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setViewMode('payment')}
                className="w-full py-4 px-4 bg-gradient-to-r from-[#D4AF37] via-[#c69d2a] to-[#8C6D23] hover:from-[#c69d2a] hover:to-[#725719] text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-between transition-all shadow-lg hover:shadow-xl active:scale-[0.99] group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shadow-xs">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-wider text-amber-100 font-semibold leading-tight">
                      Ir a Pagar
                    </span>
                    <span className="block text-sm sm:text-base font-bold leading-tight">
                      Comprar con Yape, Plin o Tarjeta
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-black/20 px-2.5 py-1 rounded-full">
                    S/ {total.toFixed(2)}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#2E2E2E] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>Finalizar con Dirección de Envío (Checkout Completo)</span>
              </button>

              <a
                href={whatsappCartUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-4 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pedir este Carrito por WhatsApp</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
