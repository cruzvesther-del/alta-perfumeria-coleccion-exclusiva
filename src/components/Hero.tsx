import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Sparkles, Gift } from 'lucide-react';
import { generateInquiryWhatsAppUrl } from '../utils/whatsapp';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section id="inicio" className="relative overflow-hidden bg-[#FAF8F5] pt-6 sm:pt-10 pb-12 sm:pb-16 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Statement & CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#8C6D23]">
              <span className="w-6 h-px bg-[#D4AF37]"></span>
              <span>Boutique de Alta Perfumería</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-normal text-[#1A1A1A] leading-[1.12] tracking-tight">
              El arte de dejar una <span className="italic text-[#8C6D23]">huella inolvidable</span>
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Descubre fragancias exclusivas y elixires seleccionados por <strong className="text-stone-900 font-medium">Esther Cruz Velásquez</strong> para despertar tus sentidos, elevar tu elegancia personal y convertir cada nota olfativa en un sello de identidad único.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-full hover:bg-[#2A2A2A] transition-all shadow-md hover:shadow-lg group"
              >
                <span>Explorar Colección</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#citas"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#D4AF37] text-stone-900 text-sm font-medium rounded-full hover:bg-amber-50/50 transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#8C6D23]" />
                <span>Reservar Cita Olfativa</span>
              </a>

              <a
                href={generateInquiryWhatsAppUrl('Deseo asesoría para elegir mi perfume ideal')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-stone-300 text-stone-800 text-sm font-medium rounded-full hover:border-[#D4AF37] hover:text-[#8C6D23] transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Quick reassurance */}
            <div className="pt-2 text-xs text-stone-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Atención personalizada desde Juliaca para todo el territorio nacional</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200/80 bg-stone-100 group">
                <img
                  src="/images/hero_luxury_perfume_1792432937692.jpg"
                  alt="Colección de alta perfumería exclusiva Esther Cruz Velásquez"
                  className="w-full h-auto aspect-16/9 lg:aspect-4/3 object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src.includes('/src/assets/images/')) {
                      target.src = target.src.replace('/src/assets/images/', '/images/');
                    } else {
                      target.src = '/images/hero_luxury_perfume.jpg';
                    }
                  }}
                />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Subtle glass floating badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl border border-white/60 shadow-lg text-left max-w-xs">
                <p className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                  Colección de Autor 2026
                </p>
                <p className="text-sm font-serif-luxury text-stone-900 font-semibold">
                  Maceración de alta pureza · Elixires de Lujo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Trust Grid */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-stone-200/70 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 text-[#8C6D23] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-stone-900">Envíos a Todo el Perú</h4>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Juliaca express y courier nacional seguro.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 text-[#8C6D23] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-stone-900">100% Auténticos</h4>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Extractos puros y esencias importadas.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 text-[#8C6D23] shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-stone-900">Muestra de Cortesía</h4>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Un decant sorpresa en cada pedido.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-stone-100 text-[#8C6D23] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-stone-900">Cajas para Regalo</h4>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Empaque ceremonial y tarjeta caligrafiada.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
