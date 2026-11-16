import React from 'react';
import { OLFACTORY_FAMILIES_LIST } from '../data/products';
import { OlfactoryFamilyType } from '../types';

interface OlfactoryFamiliesProps {
  selectedFamily: string | null;
  onSelectFamily: (family: OlfactoryFamilyType | null) => void;
}

export const OlfactoryFamilies: React.FC<OlfactoryFamiliesProps> = ({
  selectedFamily,
  onSelectFamily
}) => {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#8C6D23]">
            Arquitectura Sensorial
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-medium text-stone-900 mt-1 mb-3">
            Explora por Familia Olfativa
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Cada familia despierta un estado de ánimo distinto. Selecciona el acorde que armoniza con tu personalidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {OLFACTORY_FAMILIES_LIST.map((fam) => {
            const isSelected = selectedFamily === fam.id;
            return (
              <button
                key={fam.id}
                onClick={() => {
                  onSelectFamily(isSelected ? null : (fam.id as OlfactoryFamilyType));
                  const el = document.getElementById('catalogo');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-left p-5 rounded-2xl transition-all duration-300 border flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#FAF8F5] border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-md'
                    : 'bg-stone-50/70 hover:bg-[#FAF8F5] border-stone-200/80 hover:border-[#D4AF37]/50 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-3.5 bg-stone-100 border border-stone-200/80">
                    <img
                      src={fam.image}
                      alt={`Categoría Familia Olfativa ${fam.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
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
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg shadow-xs">
                      <span className="text-xl leading-none">{fam.icon}</span>
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 text-[10px] uppercase font-bold text-white bg-[#8C6D23] px-2 py-0.5 rounded-full shadow-xs">
                        Activo
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif-luxury text-lg font-semibold text-stone-900 group-hover:text-[#8C6D23] transition-colors">
                    {fam.name}
                  </h3>
                  <p className="text-xs font-medium text-stone-500 mt-1">
                    {fam.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-200/60">
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {fam.description}
                  </p>
                  <span className="inline-block mt-3 text-xs font-medium text-[#8C6D23] group-hover:underline">
                    {isSelected ? 'Limpiar filtro' : 'Ver fragancias →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
