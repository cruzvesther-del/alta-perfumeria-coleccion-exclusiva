import React from 'react';
import { Sparkles, Check, ArrowRight, Gift } from 'lucide-react';
import { Product } from '../types';

interface DiscoverySectionProps {
  discoveryProduct: Product | undefined;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  discoveryProduct,
  onSelectProduct,
  onQuickAddToCart
}) => {
  return (
    <section className="py-14 sm:py-20 bg-stone-900 text-white relative overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8C5C8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Visual Showcase */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-stone-800 shadow-2xl group">
              <img
                src="/images/discovery_gift_set_1792432939216.jpg"
                alt="Coffret Élite Set de Descubrimiento de Perfumes de Nicho"
                className="w-full h-auto aspect-4/3 object-cover group-hover:scale-103 transition-transform duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src.includes('/src/assets/images/')) {
                    target.src = target.src.replace('/src/assets/images/', '/images/');
                  } else {
                    target.src = '/images/discovery_gift_set.jpg';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs">
                <span className="bg-[#D4AF37] text-stone-900 font-bold px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                  Edición Limitada
                </span>
                <span className="text-stone-300 font-medium">
                  5 Viales x 10ml con atomizador de oro
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experiencia de Cata en Casa</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-medium text-white leading-tight">
              Coffret Élite: El arte del <span className="italic text-[#D4AF37]">descubrimiento</span>
            </h2>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              Elegir una fragancia de autor es un viaje íntimo que debe vivirse en la propia piel. Nuestro Coffret de Descubrimiento reúne cinco decants de alta concentración para experimentar la evolución de cada acorde durante semanas antes de elegir tu botella definitiva.
            </p>

            {/* Value checklist */}
            <div className="space-y-3 pt-1 text-xs sm:text-sm text-stone-300">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>5 fragancias maestras (Florales, Amaderadas, Oud, Cítricas y Orientales).</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Viales de cristal recargables con pulverizador micrométrico dorado.</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Estuche forrado en terciopelo negro y listón de satén marfil para regalo.</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div>
                <span className="text-[11px] text-stone-400 block uppercase tracking-wider">
                  Precio Especial de Lanzamiento
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    S/ 240.00
                  </span>
                  <span className="text-sm text-stone-500 line-through tabular-nums">
                    S/ 280.00
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {discoveryProduct && (
                  <button
                    onClick={() => onQuickAddToCart(discoveryProduct)}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-[#D4AF37] hover:bg-[#bfa034] text-stone-900 text-xs sm:text-sm font-bold rounded-full transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Adquirir Coffret</span>
                  </button>
                )}

                {discoveryProduct && (
                  <button
                    onClick={() => onSelectProduct(discoveryProduct)}
                    className="px-5 py-3 border border-stone-700 hover:border-stone-500 text-stone-300 text-xs sm:text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Ver Notas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
