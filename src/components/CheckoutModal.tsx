import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Banknote, QrCode, ArrowLeft, ArrowRight, Truck, Gift, MessageCircle } from 'lucide-react';
import { CartItem } from '../types';
import { STORE_INFO } from '../data/extras';
import { PaymentFlow } from './PaymentFlow';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discount,
  onOrderCompleted
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Customer Data
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerDoc, setCustomerDoc] = useState('');

  // Step 2: Shipping Data
  const [department, setDepartment] = useState('Puno');
  const [province, setProvince] = useState('San Román');
  const [district, setDistrict] = useState('Juliaca');
  const [addressLine, setAddressLine] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | 'transferencia' | 'contraentrega' | 'tarjeta'>('yape');
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= STORE_INFO.freeShippingThreshold || district.toLowerCase().includes('juliaca');
  const shippingCost = isFreeShipping ? 0 : 15;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine || !district) return;
    setStep(3);
  };

  const handlePlaceOrder = () => {
    const generatedOrderNum = `ECV-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrderNum);
    setStep(4);
    onOrderCompleted();
  };

  const whatsappReceiptMessage = 
`¡Hola Esther Cruz Velásquez! ✨ He realizado un pedido en la tienda online:
Número de Orden: #${orderNumber}
Cliente: ${customerName}
Teléfono: ${customerPhone}
Ciudad de entrega: ${district}, ${province}, ${department}
Dirección: ${addressLine} (Ref: ${reference || 'Sin ref'})
Método de Pago seleccionado: ${paymentMethod.toUpperCase()}
Total a pagar: S/ ${total.toFixed(2)}

Detalle de productos:
${items.map(it => `- ${it.product.name} (${it.selectedSize}) x${it.quantity}`).join('\n')}

Por favor, confirmar recepción y datos para el envío. ¡Muchas gracias!`;

  const whatsappOrderUrl = `https://wa.me/${STORE_INFO.phoneClean}?text=${encodeURIComponent(whatsappReceiptMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={step === 4 ? onClose : undefined} 
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 z-10 text-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
              {step === 4 ? '¡Pedido Confirmado!' : 'Finalizar Pedido Seguro'}
            </h3>
            <p className="text-xs text-stone-500">
              Esther Cruz Velásquez — Alta Perfumería
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (1 to 3) */}
        {step < 4 && (
          <div className="bg-stone-50 px-6 py-3 border-b border-stone-200 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'font-semibold text-stone-900' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#1A1A1A] text-white' : 'bg-stone-200 text-stone-600'}`}>
                1
              </span>
              <span className="hidden sm:inline">Tus Datos</span>
            </div>
            <div className="w-8 sm:w-16 h-px bg-stone-300"></div>

            <div className={`flex items-center gap-2 ${step >= 2 ? 'font-semibold text-stone-900' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#1A1A1A] text-white' : 'bg-stone-200 text-stone-600'}`}>
                2
              </span>
              <span className="hidden sm:inline">Envío & Destino</span>
            </div>
            <div className="w-8 sm:w-16 h-px bg-stone-300"></div>

            <div className={`flex items-center gap-2 ${step >= 3 ? 'font-semibold text-stone-900' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#1A1A1A] text-white' : 'bg-stone-200 text-stone-600'}`}>
                3
              </span>
              <span className="hidden sm:inline">Método de Pago</span>
            </div>
          </div>
        )}

        {/* Content based on step */}
        <div className="p-6">
          
          {/* STEP 1: CUSTOMER DATA */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <h4 className="font-serif-luxury text-base font-semibold text-stone-900">
                1. Información de Contacto
              </h4>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombres y Apellidos Completos *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. María Elena Paredes"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Teléfono / WhatsApp de contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ej. +51 987 654 321"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-stone-400">Te contactaremos para confirmar el despacho.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    DNI o RUC (para comprobante)
                  </label>
                  <input
                    type="text"
                    value={customerDoc}
                    onChange={(e) => setCustomerDoc(e.target.value)}
                    placeholder="Ej. 70891234"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Correo Electrónico (para confirmación)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Ej. tu-correo@ejemplo.com"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <span>Continuar a Envío</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SHIPPING DATA */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-luxury text-base font-semibold text-stone-900">
                  2. Dirección de Entrega en Perú
                </h4>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ej. Puno, Arequipa, Lima"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Provincia *
                  </label>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Ej. San Román, Cusco"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Distrito / Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Ej. Juliaca, Cercado"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dirección exacta (Calle, Jr., Av., Número o Lote) *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Ej. Jr. Mariano Núñez 412, Dpto 301"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Referencia de entrega
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ej. Frente al Parque Bolognesi o agencia Shalom"
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Instrucciones o nota especial
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas para el repartidor o detalles de horario..."
                  rows={2}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <span className="text-xs text-stone-500">
                  {isFreeShipping ? '✨ Envío Gratis Calificado' : 'Envío estándar: S/ 15.00'}
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <span>Continuar a Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT METHOD WITH QR & ACCOUNTS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif-luxury text-base font-semibold text-stone-900">
                  3. Selección de Método de Pago Seguro
                </h4>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver
                </button>
              </div>

              {/* Rich Payment Flow with Yape, Plin, Tarjeta, Transferencia */}
              <PaymentFlow 
                totalAmount={total}
                items={items}
                onPaymentSuccess={(method) => {
                  setPaymentMethod(method as any);
                  handlePlaceOrder();
                }}
              />

              {/* Local option for cash on delivery */}
              <div className="pt-1">
                <label className={`block p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'contraentrega' 
                    ? 'border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]' 
                    : 'border-stone-200 bg-stone-50 hover:bg-white'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payment"
                      value="contraentrega"
                      checked={paymentMethod === 'contraentrega'}
                      onChange={() => setPaymentMethod('contraentrega')}
                      className="text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <Truck className="w-4 h-4 text-amber-700" />
                    <div>
                      <span className="text-xs font-bold text-stone-900">Pago Contra Entrega en Mano (Exclusivo Juliaca y Puno)</span>
                      <p className="text-[10px] text-stone-500">Pagas en efectivo o tarjeta con POS al recibir tu perfume</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Order summary box */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-xs space-y-1.5 mt-2">
                <div className="flex justify-between text-stone-600">
                  <span>Productos ({items.length}):</span>
                  <span className="font-semibold text-stone-900 tabular-nums">S/ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Descuento aplicado:</span>
                    <span className="font-semibold tabular-nums">- S/ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Envío a {district}:</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {shippingCost === 0 ? '¡Gratis!' : `S/ ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Final a Pagar:</span>
                  <span className="text-base text-[#8C6D23] font-bold tabular-nums">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 px-4 bg-[#1A1A1A] hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Confirmar Pedido con {paymentMethod.toUpperCase()} (S/ {total.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMED */}
          {step === 4 && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  ¡Orden Recibida con Éxito!
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 mt-1">
                  Gracias por tu compra, {customerName}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Tu número de orden es: <strong className="text-stone-900 font-mono text-sm">#{orderNumber}</strong>
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-stone-500">Destino:</span>
                  <span className="font-medium text-stone-800">{addressLine}, {district} ({department})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Método de pago:</span>
                  <span className="font-semibold text-stone-900 uppercase">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Monto total:</span>
                  <span className="font-bold text-[#8C6D23]">S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Muestra de regalo:</span>
                  <span className="font-medium">1x Vial de autor sorpresa (Cortesía)</span>
                </div>
              </div>

              {/* Payment specific reminder */}
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-left text-xs text-amber-950 max-w-md mx-auto space-y-1">
                <p className="font-bold text-[11px] uppercase tracking-wider text-amber-900">
                  {paymentMethod === 'yape' && 'Instrucciones para Yapear:'}
                  {paymentMethod === 'plin' && 'Instrucciones para Plin:'}
                  {paymentMethod === 'tarjeta' && 'Pago con Tarjeta:'}
                  {paymentMethod === 'transferencia' && 'Transferencia Bancaria:'}
                  {paymentMethod === 'contraentrega' && 'Pago Contra Entrega:'}
                </p>
                <p className="text-[11px] leading-relaxed">
                  {paymentMethod === 'yape' && 'Transfiere S/ ' + total.toFixed(2) + ' al número 999 199 969 a nombre de Esther Cruz Velásquez y envía la captura al botón de WhatsApp abajo.'}
                  {paymentMethod === 'plin' && 'Envía S/ ' + total.toFixed(2) + ' por Plin al 999 199 969 (Interbank / BBVA / Scotiabank) y adjunta el comprobante en WhatsApp.'}
                  {paymentMethod === 'tarjeta' && 'Tu pago ha sido registrado y pre-autorizado. Recibirás el comprobante electrónico a tu correo ' + (customerEmail || 'registrado') + '.'}
                  {paymentMethod === 'transferencia' && 'Transfiere a nuestras cuentas BCP, BBVA o Interbank a nombre de Esther Cruz Velásquez y adjunta el voucher.'}
                  {paymentMethod === 'contraentrega' && 'Prepara el monto exacto en efectivo o tu tarjeta para el POS móvil cuando nuestro courier llegue a tu dirección.'}
                </p>
              </div>

              <div className="space-y-2.5 max-w-md mx-auto pt-2">
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Constancia a WhatsApp (+51 999 199 969)</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-colors"
                >
                  Seguir Explorando la Tienda
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
