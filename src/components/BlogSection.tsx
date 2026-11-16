import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, X } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/extras';
import { Article } from '../types';

export const BlogSection: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#8C6D23]">
            Saber Olfativo
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-medium text-stone-900 mt-1 mb-3">
            El Cuaderno de la Perfumería
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Guías, secretos de aplicación y rituales para dominar el arte de las fragancias de autor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:border-[#D4AF37] hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group text-left"
            >
              <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#8C6D23] font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                  {article.category}
                </span>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8C6D23]" />
                      {article.readTime}
                    </span>
                    <span>·</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="font-serif-luxury text-lg font-bold text-stone-900 group-hover:text-[#8C6D23] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8C6D23] group-hover:underline flex items-center gap-1">
                    <span>Leer artículo completo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Full Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setActiveArticle(null)} 
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 z-10 p-6 sm:p-8 text-left">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase tracking-widest font-semibold text-[#8C6D23] block mb-1">
              {activeArticle.category} · {activeArticle.readTime}
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900 mb-4">
              {activeArticle.title}
            </h3>

            <div className="aspect-16/9 rounded-xl overflow-hidden mb-6 bg-stone-100">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
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
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-stone-200 flex justify-between items-center">
              <span className="text-xs text-stone-400">
                Por Esther Cruz Velásquez · {activeArticle.date}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
              >
                Cerrar Lectura
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
