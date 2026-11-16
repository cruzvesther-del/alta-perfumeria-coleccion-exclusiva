import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { REVIEWS_DATABASE } from '../data/extras';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#8C6D23]">
            Experiencias Memorables
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-medium text-stone-900 mt-1 mb-3">
            La Voz de Nuestros Clientes
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Testimonios reales de coleccionistas y amantes del buen aroma en todo el Perú que confían en nuestra alta perfumería.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATABASE.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200/80 flex flex-col justify-between hover:border-[#D4AF37] hover:shadow-md transition-all duration-300 text-left"
            >
              <div>
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-stone-300" />
                </div>

                <h3 className="font-serif-luxury text-base font-semibold text-stone-900 mb-2">
                  "{rev.title}"
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-200/70">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
                  <span>{rev.author}</span>
                  {rev.verified && (
                    <span title="Compra verificada" className="inline-flex">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {rev.location} · {rev.date}
                </div>
                <div className="text-[10px] text-[#8C6D23] font-medium mt-1 truncate">
                  Fragancia: {rev.productName}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
