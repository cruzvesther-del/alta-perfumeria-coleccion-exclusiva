import React from 'react';
import { Award, Compass, HeartHandshake, MapPin } from 'lucide-react';
import { STORE_INFO } from '../data/extras';

export const BrandStory: React.FC = () => {
  return (
    <section id="sobre-nosotros" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Photo with Warm Accent Framing */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-white">
              <img
                src="/images/perfume_dama_floral_1792432937694.jpg"
                alt="Boutique de Alta Perfumería Esther Cruz Velásquez"
                className="w-full aspect-4/3 sm:aspect-square object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src.includes('/src/assets/images/')) {
                    target.src = target.src.replace('/src/assets/images/', '/images/');
                  } else {
                    target.src = '/images/perfume_dama_floral.jpg';
                  }
                }}
              />
              <div className="p-6 bg-white text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#8C6D23] font-semibold block mb-1">
                  Fundadora & Directora Olfativa
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
                  Esther Cruz Velásquez
                </h3>
                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>Juliaca, Puno — Perú</span>
                </p>
              </div>
            </div>

            {/* Floating Quote Stamp */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#1A1A1A] text-[#FAF8F5] p-5 rounded-2xl shadow-xl max-w-xs border border-stone-800 text-left">
              <p className="font-serif-luxury text-sm italic leading-snug">
                "Un perfume no es simplemente un accesorio; es la memoria invisible que dejas en el corazón de quien te rodea."
              </p>
              <span className="text-[10px] tracking-wider uppercase text-[#D4AF37] block mt-2 font-medium">
                — Esther Cruz Velásquez
              </span>
            </div>
          </div>

          {/* Right Column: Brand Philosophy & Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#8C6D23]">
              <span className="w-6 h-px bg-[#D4AF37]"></span>
              <span>Nuestra Filosofía</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-medium text-stone-900 leading-tight">
              La pasión por lo sublime, <br className="hidden sm:inline" />
              desde <span className="italic text-[#8C6D23]">el corazón del altiplano</span>
            </h2>

            <blockquote className="text-stone-700 text-base sm:text-lg leading-relaxed italic border-l-2 border-[#D4AF37] pl-4">
              "Esther Cruz Velásquez es una boutique exclusiva de perfumería de autor, fragancias de lujo, elixires concentrados y esencias importadas creadas para despertar sensaciones inolvidables. Cada aroma es seleccionado cuidadosamente para resaltar la elegancia personal, capturar la esencia de momentos especiales y convertir cada nota olfativa en un sello de identidad único e irresistible."
            </blockquote>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              <p>
                Nacida en la vibrante e histórica ciudad de Juliaca, en la región Puno, nuestra casa perfumista desafía las convenciones comerciales. Nos alejamos de las fragancias masivas y sintéticas para ofrecer auténticas obras de arte creadas por narices maestras de Francia, España y los legendarios destiladores de aceites de Oriente Medio.
              </p>
              <p>
                Creemos que el clima andino y las personalidades que valoran la autenticidad merecen perfumes con alma: elixires de larga duración, acordes nobles de maderas preciosas, rosas aterciopeladas y oud ancestral que resisten el paso de las horas con distinción impecable.
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <Compass className="w-5 h-5 text-[#8C6D23] mb-2" />
                <h4 className="font-semibold text-xs text-stone-900">Curaduría Experta</h4>
                <p className="text-[11px] text-stone-500 mt-1">
                  Evaluamos cada lote antes de incorporarlo a nuestra selección.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <Award className="w-5 h-5 text-[#8C6D23] mb-2" />
                <h4 className="font-semibold text-xs text-stone-900">Concentración Extrema</h4>
                <p className="text-[11px] text-stone-500 mt-1">
                  EDP, Extraits y Attars al óleo que garantizan fijación real.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <HeartHandshake className="w-5 h-5 text-[#8C6D23] mb-2" />
                <h4 className="font-semibold text-xs text-stone-900">Trato Personal</h4>
                <p className="text-[11px] text-stone-500 mt-1">
                  Asesoría cercana y directa por WhatsApp desde el primer contacto.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
