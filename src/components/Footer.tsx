import React, { useState } from 'react';
import { Phone, Mail, MapPin, Sparkles, Send, Check, Database, AlertCircle, Loader2 } from 'lucide-react';
import { STORE_INFO } from '../data/extras';
import { saveSuscriptorToSupabase, getLocalSuscriptores, SUPABASE_SUSCRIPTORES_TABLE } from '../lib/supabase';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenLegal: (type: 'privacidad' | 'terminos' | 'envios') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenLegal }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [subscribersCount, setSubscribersCount] = useState<number>(() => {
    try {
      return getLocalSuscriptores().length;
    } catch {
      return 0;
    }
  });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.trim()) return;

    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      const result = await saveSuscriptorToSupabase(newsletterEmail);
      setIsSubmitting(false);

      if (result.success) {
        setFeedbackMessage({
          type: 'success',
          text: result.message || '¡Te has suscrito con éxito! Correo guardado en la tabla "suscriptores" de Supabase.'
        });
        setNewsletterEmail('');
        setSubscribersCount((prev) => prev + 1);
        setTimeout(() => setFeedbackMessage(null), 7000);
      } else {
        setFeedbackMessage({
          type: 'error',
          text: result.message || 'Ocurrió un error al procesar tu suscripción.'
        });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setFeedbackMessage({
        type: 'error',
        text: 'Error de conexión. Tu suscripción se ha respaldado de forma segura.'
      });
    }
  };

  return (
    <footer className="bg-[#141414] text-[#FAF8F5] pt-16 pb-12 border-t border-stone-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dedicated Newsletter & Supabase Subscription Section */}
        <div className="mb-14 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-stone-900 via-[#1C1814] to-stone-900 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          {/* Subtle gold decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>El Círculo de la Perfumería · Membresía Gratuita</span>
            </div>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Suscríbete y despierta tus sentidos con fragancias de autor
            </h3>

            <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Recibe primicias de elixires importados, invitaciones a catas privadas en Juliaca y un <strong className="text-[#D4AF37]">10% de descuento</strong> con el cupón de bienvenida en tu primera compra.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto pt-2">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Ingresa tu correo electrónico..."
                    disabled={isSubmitting}
                    className="w-full bg-stone-950/80 border border-stone-700 text-xs sm:text-sm text-white rounded-2xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#bfa034] text-stone-950 font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <span>Suscribirme</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Feedback Alert */}
              {feedbackMessage && (
                <div
                  className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 text-left animate-fadeIn ${
                    feedbackMessage.type === 'success'
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
                  }`}
                >
                  {feedbackMessage.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{feedbackMessage.text}</span>
                </div>
              )}

              {/* Supabase auto-save badge */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] text-stone-400">
                <div className="flex items-center gap-1.5 text-stone-400">
                  <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Guardado automático en Supabase · Tabla <strong className="font-mono text-amber-200 font-semibold">'public.suscriptores'</strong></span>
                </div>
                {subscribersCount > 0 && (
                  <span className="text-stone-500 hidden sm:inline">
                    · {subscribersCount} cliente(s) registrados
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand & Manifesto */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-white block">
                Esther Cruz Velásquez
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] block mt-0.5">
                Alta Perfumería · Juliaca & Perú
              </span>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Boutique exclusiva de perfumería de autor, fragancias de lujo, elixires concentrados y esencias importadas creadas para despertar sensaciones inolvidables.
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{STORE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a 
                  href={`https://wa.me/${STORE_INFO.phoneClean}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {STORE_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a 
                  href={`mailto:${STORE_INFO.email}`} 
                  className="hover:text-white transition-colors"
                >
                  {STORE_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-luxury text-sm font-semibold text-white uppercase tracking-wider">
              Colecciones
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onSelectCategory('dama')}
                  className="hover:text-white transition-colors"
                >
                  Perfumes para Dama
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('caballero')}
                  className="hover:text-white transition-colors"
                >
                  Perfumes para Caballero
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('unisex_arabe')}
                  className="hover:text-white transition-colors"
                >
                  Unisex & Árabes (Attars)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('discovery_decants')}
                  className="hover:text-white transition-colors"
                >
                  Sets de Descubrimiento
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('hogar')}
                  className="hover:text-white transition-colors"
                >
                  Perfumería de Hogar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cuidado_corporal')}
                  className="hover:text-white transition-colors"
                >
                  Cremas & Body Mists
                </button>
              </li>
            </ul>
          </div>

          {/* Client Support & Policies */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-luxury text-sm font-semibold text-white uppercase tracking-wider">
              Atención & Legal
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#citas" className="text-[#D4AF37] hover:underline font-medium">
                  ✦ Reservar Cita Olfativa (Supabase)
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-white transition-colors">
                  Contacto & Asesoría
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('envios')}
                  className="hover:text-white transition-colors"
                >
                  Envíos y Devoluciones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacidad')}
                  className="hover:text-white transition-colors"
                >
                  Políticas de Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terminos')}
                  className="hover:text-white transition-colors"
                >
                  Términos del Servicio
                </button>
              </li>
            </ul>
          </div>

          {/* Private Club / Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif-luxury text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>El Círculo de la Perfumería</span>
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Suscríbete para recibir lanzamientos privados de nuevos elixires, invitaciones a catas olfativas y un cupón de bienvenida.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Tu correo electrónico..."
                  disabled={isSubmitting}
                  className="flex-1 bg-stone-900 border border-stone-700 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#D4AF37] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#bfa034] text-stone-900 font-semibold text-xs rounded-lg transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Unirme</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {feedbackMessage && (
                <p className={`text-[11px] flex items-center gap-1 ${
                  feedbackMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {feedbackMessage.type === 'success' ? (
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                  )}
                  <span>{feedbackMessage.text}</span>
                </p>
              )}

              <div className="text-[10px] text-stone-400 flex items-center gap-1 pt-1">
                <Database className="w-3 h-3 text-[#D4AF37]" />
                <span>Supabase: tabla <span className="text-amber-200 font-mono">public.suscriptores</span></span>
              </div>
            </form>

            <div className="pt-2 text-stone-400 text-xs">
              <span className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                Métodos de Pago Seguros
              </span>
              <div className="flex flex-wrap gap-2 text-[10px] text-stone-300">
                <span className="px-2 py-0.5 bg-stone-800 rounded">Yape</span>
                <span className="px-2 py-0.5 bg-stone-800 rounded">Plin</span>
                <span className="px-2 py-0.5 bg-stone-800 rounded">BCP</span>
                <span className="px-2 py-0.5 bg-stone-800 rounded">BBVA</span>
                <span className="px-2 py-0.5 bg-stone-800 rounded">Visa / Mastercard</span>
                <span className="px-2 py-0.5 bg-stone-800 rounded">Pago Contra Entrega</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © 2026 Esther Cruz Velásquez - Alta Perfumería. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Hecho con elegancia en Juliaca, Perú</span>
            <span>·</span>
            <span>Envíos a todo el territorio nacional</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
