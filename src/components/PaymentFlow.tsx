import React, { useState } from 'react';
import { 
  QrCode, 
  CreditCard, 
  Copy, 
  Check, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  Lock, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Upload,
  FileCheck,
  MessageCircle,
  CheckCircle2,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { CartItem } from '../types';
import { STORE_INFO } from '../data/extras';
import { generatePaymentConfirmationWhatsAppUrl } from '../utils/whatsapp';

export interface PaymentFlowProps {
  totalAmount: number;
  items?: CartItem[];
  onPaymentSuccess?: (method: string, details?: any) => void;
  onBackToCart?: () => void;
  isCompact?: boolean;
}

export const PaymentFlow: React.FC<PaymentFlowProps> = ({
  totalAmount,
  items = [],
  onPaymentSuccess,
  onBackToCart,
  isCompact = false
}) => {
  const [activeMethod, setActiveMethod] = useState<'yape' | 'plin' | 'tarjeta' | 'transferencia'>('yape');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Customer Contact for Delivery/Confirmation
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Juliaca');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Voucher details for Yape / Plin / Transferencia
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherFile, setVoucherFile] = useState<string | null>(null);
  const [isUploadingVoucher, setIsUploadingVoucher] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardDoc, setCardDoc] = useState('');
  const [installments, setInstallments] = useState('1');
  const [isProcessingCard, setIsProcessingCard] = useState(false);
  const [cardPaidSuccess, setCardPaidSuccess] = useState(false);
  const [authCode, setAuthCode] = useState('');

  // Final Order Complete state
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');

  const handleCopy = (text: string, fieldId: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const formatCardNumber = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 16);
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(' ') : raw;
  };

  const formatExpiry = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      return `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    return raw;
  };

  // Detect card brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (/^4/.test(clean)) return { name: 'VISA', color: 'from-blue-900 to-indigo-950' };
    if (/^5[1-5]/.test(clean)) return { name: 'Mastercard', color: 'from-stone-900 to-amber-950' };
    if (/^3[47]/.test(clean)) return { name: 'AMEX', color: 'from-cyan-950 to-blue-900' };
    return { name: 'Crédito / Débito', color: 'from-stone-900 via-stone-800 to-stone-900' };
  };

  const handleVoucherUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingVoucher(true);
      setTimeout(() => {
        setVoucherFile(file.name);
        setIsUploadingVoucher(false);
      }, 700);
    }
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 15 || !cardHolder || cardExpiry.length < 5 || cardCvv.length < 3) {
      return;
    }
    setIsProcessingCard(true);
    setTimeout(() => {
      const generatedAuth = `AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
      setAuthCode(generatedAuth);
      setIsProcessingCard(false);
      setCardPaidSuccess(true);
      
      const newOrderId = `ECV-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedOrderId(newOrderId);

      if (onPaymentSuccess) {
        onPaymentSuccess('tarjeta', {
          last4: cardNumber.slice(-4),
          installments,
          cardHolder,
          authCode: generatedAuth,
          orderId: newOrderId
        });
      }
    }, 1600);
  };

  const handleFinalizeTransfer = (methodName: string) => {
    const newOrderId = `ECV-${Math.floor(100000 + Math.random() * 900000)}`;
    setCompletedOrderId(newOrderId);
    setIsOrderComplete(true);

    if (onPaymentSuccess) {
      onPaymentSuccess(methodName, {
        voucherCode,
        voucherFile,
        customerName,
        customerPhone,
        deliveryCity,
        orderId: newOrderId
      });
    }

    // Generate WhatsApp URL
    const waUrl = generatePaymentConfirmationWhatsAppUrl({
      orderId: newOrderId,
      items,
      total: totalAmount,
      paymentMethod: methodName,
      voucherNumber: voucherCode,
      customerName: customerName || 'Cliente Esther Cruz Velásquez',
      customerPhone: customerPhone || STORE_INFO.phone,
      deliveryCity: deliveryCity || 'Juliaca, Puno, Perú',
      address: deliveryAddress
    });

    // Open WhatsApp
    window.location.href = waUrl;
  };

  const bankAccounts = [
    {
      bank: 'BCP (Banco de Crédito del Perú)',
      accountType: 'Cuenta Corriente Soles',
      accountNumber: '215-98342156-0-84',
      cci: '002-215009834215608422',
      color: 'border-blue-200 bg-blue-50/50 text-blue-900',
      badge: 'BCP'
    },
    {
      bank: 'BBVA Perú',
      accountType: 'Cuenta de Ahorros Soles',
      accountNumber: '0011-0248-0200845612',
      cci: '011-24800020084561294',
      color: 'border-sky-200 bg-sky-50/50 text-sky-900',
      badge: 'BBVA'
    },
    {
      bank: 'Interbank',
      accountType: 'Cuenta Corriente Soles',
      accountNumber: '300-3001248596',
      cci: '003-30000300124859618',
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
      badge: 'Interbank'
    }
  ];

  // If order is completed (e.g. Card payment finished or voucher submitted)
  if (isOrderComplete || cardPaidSuccess) {
    const currentOrderId = completedOrderId || `ECV-${Math.floor(100000 + Math.random() * 900000)}`;
    const confirmWaUrl = generatePaymentConfirmationWhatsAppUrl({
      orderId: currentOrderId,
      items,
      total: totalAmount,
      paymentMethod: activeMethod,
      voucherNumber: voucherCode || authCode,
      customerName: customerName || 'Cliente Esther Cruz Velásquez',
      customerPhone: customerPhone || STORE_INFO.phone,
      deliveryCity: deliveryCity || 'Juliaca, Puno, Perú',
      address: deliveryAddress
    });

    return (
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-stone-200 shadow-xl text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
            ¡Pago y Registro Exitoso!
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 mt-2">
            Gracias por tu compra en Esther Cruz Velásquez
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Hemos recibido los detalles de tu orden. Tu fragancia exclusiva está siendo preparada con nuestro empaque de autor.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-xs text-left space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <span className="text-stone-500 font-medium">N° de Orden:</span>
            <span className="font-mono font-bold text-stone-900 text-sm">#{currentOrderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Método utilizado:</span>
            <span className="font-semibold text-stone-900 uppercase">{activeMethod}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Total pagado:</span>
            <span className="font-bold text-[#8C6D23] text-sm tabular-nums">S/ {totalAmount.toFixed(2)}</span>
          </div>

          {authCode && (
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Cód. Autorización Tarjeta:</span>
              <span className="font-mono font-bold text-emerald-700">{authCode}</span>
            </div>
          )}

          {voucherCode && (
            <div className="flex justify-between items-center">
              <span className="text-stone-500">N° Comprobante / Ref:</span>
              <span className="font-mono font-semibold text-stone-800">{voucherCode}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-stone-200">
            <span className="text-stone-500">Despacho desde:</span>
            <span className="font-semibold text-stone-900">Juliaca, Puno (Alcance Nacional)</span>
          </div>
        </div>

        {/* WhatsApp Notification Action */}
        <div className="space-y-2.5 pt-2">
          <a
            href={confirmWaUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Notificar Pago a Esther Cruz Velásquez por WhatsApp</span>
          </a>

          {onBackToCart && (
            <button
              type="button"
              onClick={onBackToCart}
              className="w-full py-2.5 text-xs text-stone-600 hover:text-stone-900 font-medium transition-colors"
            >
              Volver a la tienda
            </button>
          )}
        </div>
      </div>
    );
  }

  const cardBrand = getCardBrand(cardNumber);

  return (
    <div className="space-y-4 text-left">
      
      {/* Total amount header bar */}
      <div className="p-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl flex items-center justify-between border border-stone-800 shadow-md">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-amber-200/90 block font-semibold">
            Total a Pagar
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-[#D4AF37] tabular-nums font-serif-luxury tracking-tight">
            S/ {totalAmount.toFixed(2)}
          </span>
        </div>
        <div className="text-right text-[11px] text-stone-300">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
            <Lock className="w-3.5 h-3.5" />
            <span>Pago Cifrado SSL</span>
          </span>
          <p className="text-[10px] text-stone-400 mt-1">Sin recargo ni comisiones</p>
        </div>
      </div>

      {/* Payment Method Selector Tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
          Selecciona tu método de pago preferido:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Yape */}
          <button
            type="button"
            onClick={() => setActiveMethod('yape')}
            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              activeMethod === 'yape'
                ? 'border-purple-600 bg-purple-50/90 ring-2 ring-purple-600/30 shadow-sm font-bold'
                : 'border-stone-200 bg-white hover:border-purple-300 text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
              <span className="text-[9px] uppercase font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full">
                Popular
              </span>
            </div>
            <div className="mt-2">
              <span className="font-bold text-xs text-stone-900 block">Yape</span>
              <span className="text-[10px] text-stone-500 font-normal">QR / Celular</span>
            </div>
          </button>

          {/* Plin */}
          <button
            type="button"
            onClick={() => setActiveMethod('plin')}
            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              activeMethod === 'plin'
                ? 'border-sky-500 bg-sky-50/90 ring-2 ring-sky-500/30 shadow-sm font-bold'
                : 'border-stone-200 bg-white hover:border-sky-300 text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span className="text-[9px] uppercase font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded-full">
                0% Comisión
              </span>
            </div>
            <div className="mt-2">
              <span className="font-bold text-xs text-stone-900 block">Plin</span>
              <span className="text-[10px] text-stone-500 font-normal">Interbancario</span>
            </div>
          </button>

          {/* Tarjeta */}
          <button
            type="button"
            onClick={() => setActiveMethod('tarjeta')}
            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              activeMethod === 'tarjeta'
                ? 'border-[#D4AF37] bg-amber-50/90 ring-2 ring-[#D4AF37]/30 shadow-sm font-bold'
                : 'border-stone-200 bg-white hover:border-[#D4AF37] text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <CreditCard className="w-4 h-4 text-[#8C6D23]" />
              <span className="text-[9px] uppercase font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full">
                Tarjetas
              </span>
            </div>
            <div className="mt-2">
              <span className="font-bold text-xs text-stone-900 block">Tarjeta</span>
              <span className="text-[10px] text-stone-500 font-normal">Débito / Crédito</span>
            </div>
          </button>

          {/* Transferencia */}
          <button
            type="button"
            onClick={() => setActiveMethod('transferencia')}
            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              activeMethod === 'transferencia'
                ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600/30 shadow-sm font-bold'
                : 'border-stone-200 bg-white hover:border-emerald-300 text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span className="text-[9px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                Bancos
              </span>
            </div>
            <div className="mt-2">
              <span className="font-bold text-xs text-stone-900 block">Transferencia</span>
              <span className="text-[10px] text-stone-500 font-normal">BCP / BBVA</span>
            </div>
          </button>
        </div>
      </div>

      {/* METHOD 1: YAPE */}
      {activeMethod === 'yape' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-purple-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                Y
              </div>
              <div>
                <h4 className="font-serif-luxury text-base font-bold text-stone-900">
                  Pagar con Yape
                </h4>
                <p className="text-[11px] text-stone-500">
                  Escanea el código QR oficial o transfiere al número de contacto
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              S/ {totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Visual QR Code Container */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="relative p-3.5 bg-white rounded-2xl border-2 border-purple-300 shadow-md">
                <svg className="w-36 h-36 sm:w-40 sm:h-40" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="160" height="160" fill="white" rx="8" />
                  
                  {/* Outer corner anchors */}
                  <rect x="12" y="12" width="40" height="40" rx="6" fill="#6B21A8" />
                  <rect x="20" y="20" width="24" height="24" rx="3" fill="white" />
                  <rect x="26" y="26" width="12" height="12" rx="2" fill="#6B21A8" />

                  <rect x="108" y="12" width="40" height="40" rx="6" fill="#6B21A8" />
                  <rect x="116" y="20" width="24" height="24" rx="3" fill="white" />
                  <rect x="122" y="26" width="12" height="12" rx="2" fill="#6B21A8" />

                  <rect x="12" y="108" width="40" height="40" rx="6" fill="#6B21A8" />
                  <rect x="20" y="116" width="24" height="24" rx="3" fill="white" />
                  <rect x="26" y="122" width="12" height="12" rx="2" fill="#6B21A8" />

                  {/* QR Pattern Data Blocks */}
                  <rect x="60" y="16" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="76" y="16" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="60" y="32" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="88" y="32" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="76" y="44" width="10" height="10" rx="1.5" fill="#6B21A8" />

                  <rect x="16" y="60" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="32" y="60" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="44" y="74" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="16" y="88" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="32" y="88" width="10" height="10" rx="1.5" fill="#6B21A8" />

                  {/* Center Yape Badge */}
                  <rect x="62" y="62" width="36" height="36" rx="8" fill="#6B21A8" />
                  <text x="80" y="84" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Y</text>

                  {/* Right Blocks */}
                  <rect x="108" y="60" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="124" y="60" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="138" y="74" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="108" y="88" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="124" y="88" width="10" height="10" rx="1.5" fill="#6B21A8" />

                  {/* Bottom Blocks */}
                  <rect x="60" y="108" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="76" y="108" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="88" y="120" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="60" y="136" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="76" y="136" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="108" y="136" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="124" y="120" width="10" height="10" rx="1.5" fill="#6B21A8" />
                  <rect x="138" y="136" width="10" height="10" rx="1.5" fill="#6B21A8" />
                </svg>
                <div className="text-center mt-1 text-[10px] font-bold text-purple-800">
                  Escanea con tu App Yape
                </div>
              </div>
            </div>

            {/* Account Details & One-Click Copy */}
            <div className="sm:col-span-7 space-y-3">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                <span className="text-[10px] font-semibold uppercase text-purple-700 block">
                  Número Oficial para Yapear
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg sm:text-xl font-bold font-mono text-purple-950">
                    999 199 969
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('999199969', 'yape-num')}
                    className="px-3 py-1.5 bg-white hover:bg-purple-100 border border-purple-300 text-purple-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedField === 'yape-num' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Número</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Titular de la cuenta:</span>
                  <span className="font-semibold text-stone-900">Esther Cruz Velásquez</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Monto exacto a transferir:</span>
                  <span className="font-bold text-purple-900 tabular-nums">S/ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-[11px] text-stone-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                <p>
                  <strong>Instrucciones:</strong> 1. Abre Yape y transfiere <strong>S/ {totalAmount.toFixed(2)}</strong> al <strong>999 199 969</strong>. 2. Ingresa el código o adjunta el comprobante abajo para confirmar.
                </p>
              </div>
            </div>
          </div>

          {/* Voucher input & Confirmation */}
          <div className="border-t border-purple-100 pt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  N° de Operación / Referencia Yape
                </label>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Ej. 8493012"
                  className="w-full text-xs font-mono p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Adjuntar Captura de Pago (Opcional)
                </label>
                <label className="flex items-center justify-center gap-2 p-2 bg-stone-50 border border-dashed border-stone-300 hover:border-purple-400 rounded-xl cursor-pointer text-xs text-stone-600 hover:bg-stone-100 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-purple-700" />
                  <span className="truncate">{voucherFile ? `✓ ${voucherFile}` : 'Seleccionar comprobante'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleVoucherUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFinalizeTransfer('yape')}
              className="w-full py-3.5 px-4 bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
            >
              <Check className="w-4 h-4 text-purple-200" />
              <span>Confirmar Pago con Yape (S/ {totalAmount.toFixed(2)})</span>
            </button>
          </div>
        </div>
      )}

      {/* METHOD 2: PLIN */}
      {activeMethod === 'plin' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-sky-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                P
              </div>
              <div>
                <h4 className="font-serif-luxury text-base font-bold text-stone-900">
                  Pagar con Plin
                </h4>
                <p className="text-[11px] text-stone-500">
                  Válido desde Interbank, BBVA, Scotiabank y BanBif
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              S/ {totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Visual QR Code Container */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="relative p-3.5 bg-white rounded-2xl border-2 border-sky-300 shadow-md">
                <svg className="w-36 h-36 sm:w-40 sm:h-40" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="160" height="160" fill="white" rx="8" />
                  
                  <rect x="12" y="12" width="40" height="40" rx="6" fill="#0284C7" />
                  <rect x="20" y="20" width="24" height="24" rx="3" fill="white" />
                  <rect x="26" y="26" width="12" height="12" rx="2" fill="#0284C7" />

                  <rect x="108" y="12" width="40" height="40" rx="6" fill="#0284C7" />
                  <rect x="116" y="20" width="24" height="24" rx="3" fill="white" />
                  <rect x="122" y="26" width="12" height="12" rx="2" fill="#0284C7" />

                  <rect x="12" y="108" width="40" height="40" rx="6" fill="#0284C7" />
                  <rect x="20" y="116" width="24" height="24" rx="3" fill="white" />
                  <rect x="26" y="122" width="12" height="12" rx="2" fill="#0284C7" />

                  <rect x="60" y="16" width="10" height="10" rx="1.5" fill="#0284C7" />
                  <rect x="76" y="16" width="10" height="10" rx="1.5" fill="#0284C7" />
                  <rect x="60" y="32" width="10" height="10" rx="1.5" fill="#0284C7" />
                  <rect x="88" y="32" width="10" height="10" rx="1.5" fill="#0284C7" />

                  <rect x="16" y="60" width="10" height="10" rx="1.5" fill="#0284C7" />
                  <rect x="32" y="60" width="10" height="10" rx="1.5" fill="#0284C7" />
                  <rect x="44" y="74" width="10" height="10" rx="1.5" fill="#0284C7" />

                  {/* Center Plin Badge */}
                  <rect x="62" y="62" width="36" height="36" rx="8" fill="#0284C7" />
                  <text x="80" y="85" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">P</text>

                  <rect x="108" y="60" width="10" height="10" rx="1.5" fill="#0284C7" />
                  <rect x="124" y="60" width="10" height="10" rx="1.5" fill="#0284C7" />
                  <rect x="138" y="74" width="10" height="10" rx="1.5" fill="#0284C7" />

                  <rect x="60" y="108" width="10" height="10" rx="1.5" fill="#0284C7" />
                  <rect x="76" y="108" width="10" height="10" rx="1.5" fill="#0284C7" />
                  <rect x="88" y="120" width="10" height="10" rx="1.5" fill="#0284C7" />
                  <rect x="108" y="136" width="10" height="10" rx="1.5" fill="#0284C7" />
                </svg>
                <div className="text-center mt-1 text-[10px] font-bold text-sky-800">
                  Escanea con tu App Plin
                </div>
              </div>
            </div>

            {/* Plin details */}
            <div className="sm:col-span-7 space-y-3">
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200">
                <span className="text-[10px] font-semibold uppercase text-sky-700 block">
                  Número de Celular Plin
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg sm:text-xl font-bold font-mono text-sky-950">
                    999 199 969
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('999199969', 'plin-num')}
                    className="px-3 py-1.5 bg-white hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedField === 'plin-num' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Número</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Titular de la cuenta:</span>
                  <span className="font-semibold text-stone-900">Esther Cruz Velásquez</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Bancos admitidos:</span>
                  <span className="font-medium text-stone-800">Interbank, BBVA, Scotiabank, BanBif</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total a transferir:</span>
                  <span className="font-bold text-sky-900 tabular-nums">S/ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-[11px] text-stone-600 bg-sky-50/60 p-2.5 rounded-xl border border-sky-200">
                <p>
                  Transfiere vía Plin a <strong>Esther Cruz Velásquez</strong> y confirma el N° de operación para procesar el empaque aromático de inmediato.
                </p>
              </div>
            </div>
          </div>

          {/* Voucher input & Confirmation */}
          <div className="border-t border-sky-100 pt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  N° de Operación Plin
                </label>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Ej. 1928475"
                  className="w-full text-xs font-mono p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Adjuntar Comprobante (Opcional)
                </label>
                <label className="flex items-center justify-center gap-2 p-2 bg-stone-50 border border-dashed border-stone-300 hover:border-sky-400 rounded-xl cursor-pointer text-xs text-stone-600 hover:bg-stone-100 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-sky-600" />
                  <span className="truncate">{voucherFile ? `✓ ${voucherFile}` : 'Seleccionar comprobante'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleVoucherUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFinalizeTransfer('plin')}
              className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
            >
              <Check className="w-4 h-4 text-sky-200" />
              <span>Confirmar Pago con Plin (S/ {totalAmount.toFixed(2)})</span>
            </button>
          </div>
        </div>
      )}

      {/* METHOD 3: TARJETA DE CRÉDITO O DÉBITO */}
      {activeMethod === 'tarjeta' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#D4AF37]/60 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-[#8C6D23]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-base font-bold text-stone-900">
                  Pasarela de Tarjeta Débito / Crédito
                </h4>
                <p className="text-[11px] text-stone-500">
                  Aceptamos Visa, Mastercard, American Express y Diners Club
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Cifrado SSL 256-Bit</span>
            </div>
          </div>

          <form onSubmit={handleCardSubmit} className="space-y-3.5">
            {/* Live Interactive Card Preview */}
            <div className={`p-4 sm:p-5 rounded-3xl bg-gradient-to-r ${cardBrand.color} text-white shadow-xl space-y-3 border border-stone-700 transition-all`}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-serif-luxury text-sm font-bold tracking-wider text-[#D4AF37]">
                  Esther Cruz Velásquez · Alta Perfumería
                </span>
                <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-mono tracking-wider font-bold">
                  {cardBrand.name}
                </span>
              </div>

              <div className="font-mono text-lg sm:text-xl tracking-widest py-1.5 text-stone-100">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              <div className="flex justify-between items-end text-[11px]">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-semibold">Titular</span>
                  <span className="font-semibold tracking-wide uppercase">
                    {cardHolder || 'NOMBRE Y APELLIDO'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-semibold">Expira</span>
                  <span className="font-mono font-bold">{cardExpiry || 'MM/AA'}</span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Número de Tarjeta (16 dígitos) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4557 1234 5678 9012"
                  maxLength={19}
                  className="w-full text-xs font-mono p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
                <CreditCard className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Nombre y Apellidos del Titular *
              </label>
              <input
                type="text"
                required
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                placeholder="COMO APARECE IMPRESO EN LA TARJETA"
                className="w-full text-xs uppercase p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Vencimiento (MM/AA) *
                </label>
                <input
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/AA"
                  maxLength={5}
                  className="w-full text-xs font-mono p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  CVV / CVC (3-4 dígitos) *
                </label>
                <input
                  type="password"
                  required
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  maxLength={4}
                  className="w-full text-xs font-mono p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  DNI o Carné del Titular *
                </label>
                <input
                  type="text"
                  required
                  value={cardDoc}
                  onChange={(e) => setCardDoc(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="8 dígitos"
                  maxLength={9}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Cuotas
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="1">1 cuota (Sin intereses) - S/ {totalAmount.toFixed(2)}</option>
                  <option value="2">2 cuotas - S/ {(totalAmount / 2).toFixed(2)}/mes</option>
                  <option value="3">3 cuotas - S/ {(totalAmount / 3).toFixed(2)}/mes</option>
                  <option value="6">6 cuotas - S/ {(totalAmount / 6).toFixed(2)}/mes</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessingCard}
                className="w-full py-3.5 px-4 bg-[#1A1A1A] hover:bg-stone-800 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {isProcessingCard ? 'Procesando Pago Seguro con el Banco...' : `Pagar S/ ${totalAmount.toFixed(2)} con Tarjeta`}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* METHOD 4: TRANSFERENCIA BANCARIA */}
      {activeMethod === 'transferencia' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-emerald-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-luxury text-base font-bold text-stone-900">
                  Transferencia Bancaria Directa
                </h4>
                <p className="text-[11px] text-stone-500">
                  Titular: <strong>Esther Cruz Velásquez</strong>
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              S/ {totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3">
            {bankAccounts.map((b, idx) => (
              <div key={idx} className={`p-3.5 rounded-2xl border ${b.color} text-xs space-y-2`}>
                <div className="flex items-center justify-between font-bold">
                  <span>{b.bank}</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded shadow-2xs">
                    {b.accountType}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between bg-white/80 p-2 rounded-xl">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 block">Número de Cuenta:</span>
                      <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">{b.accountNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(b.accountNumber.replace(/-/g, ''), `acc-${idx}`)}
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === `acc-${idx}` ? (
                        <span className="text-emerald-700 flex items-center gap-0.5"><Check className="w-3 h-3" /> Copiado</span>
                      ) : (
                        <span className="flex items-center gap-0.5"><Copy className="w-3 h-3" /> Copiar</span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white/80 p-2 rounded-xl">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 block">Código Interbancario (CCI):</span>
                      <span className="font-mono text-[11px] text-stone-800">{b.cci}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(b.cci.replace(/-/g, ''), `cci-${idx}`)}
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === `cci-${idx}` ? (
                        <span className="text-emerald-700 flex items-center gap-0.5"><Check className="w-3 h-3" /> Copiado</span>
                      ) : (
                        <span className="flex items-center gap-0.5"><Copy className="w-3 h-3" /> Copiar CCI</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Voucher input & Confirmation */}
          <div className="border-t border-emerald-100 pt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  N° de Constancia Bancaria
                </label>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Ej. BCP-593021"
                  className="w-full text-xs font-mono p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Adjuntar Comprobante
                </label>
                <label className="flex items-center justify-center gap-2 p-2 bg-stone-50 border border-dashed border-stone-300 hover:border-emerald-400 rounded-xl cursor-pointer text-xs text-stone-600 hover:bg-stone-100 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">{voucherFile ? `✓ ${voucherFile}` : 'Seleccionar comprobante'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleVoucherUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFinalizeTransfer('transferencia')}
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Confirmar Transferencia Bancaria (S/ {totalAmount.toFixed(2)})</span>
            </button>
          </div>
        </div>
      )}

      {/* Customer Quick Info (Optional if customer wants to add their name & address before completing) */}
      <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200 text-xs space-y-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
          Datos de Contacto para Envío y Comprobante (Opcional)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Tu Nombre y Apellidos"
            className="text-xs p-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
          />
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="WhatsApp de contacto"
            className="text-xs p-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={deliveryCity}
            onChange={(e) => setDeliveryCity(e.target.value)}
            placeholder="Ciudad (ej. Juliaca, Puno, Lima)"
            className="text-xs p-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
          />
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Dirección exacta o agencia de envío"
            className="text-xs p-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

    </div>
  );
};
