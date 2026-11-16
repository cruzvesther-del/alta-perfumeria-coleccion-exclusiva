import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_DATABASE } from '../data/extras';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white border-b border-stone-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#8C6D23]">
            Claridad & Confianza
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-medium text-stone-900 mt-1 mb-3">
            Preguntas Frecuentes
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Todo lo que necesitas saber sobre envíos, pagos y autenticidad de nuestras fragancias exclusivas.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATABASE.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-stone-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 text-left bg-stone-50/50 hover:bg-stone-50 flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="font-serif-luxury text-base sm:text-lg font-semibold text-stone-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#8C6D23]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 bg-stone-50/50 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-stone-100">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
