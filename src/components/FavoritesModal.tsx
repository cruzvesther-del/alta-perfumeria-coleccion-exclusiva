import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectProduct,
  onQuickAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10 text-left">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
              Tus Fragancias Favoritas
            </h3>
            <span className="text-xs bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-medium">
              {favorites.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {favorites.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-serif-luxury text-lg font-medium text-stone-800">
                Aún no tienes perfumes en favoritos
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Toca el icono del corazón en cualquiera de nuestros frascos para guardarlo en tu lista personal.
              </p>
            </div>
          ) : (
            favorites.map((product) => {
              const currentSize = product.sizes[product.defaultSizeIndex] || product.sizes[0];
              return (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 items-center justify-between"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 bg-white cursor-pointer"
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
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

                  <div className="flex-1 min-w-0 pr-2">
                    <h4 
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="text-xs font-semibold text-stone-900 truncate font-serif-luxury hover:text-[#8C6D23] cursor-pointer"
                    >
                      {product.name}
                    </h4>
                    <div className="text-[11px] text-stone-500">
                      {product.concentration} · {currentSize.size}
                    </div>
                    <div className="text-xs font-bold text-[#8C6D23] mt-1 tabular-nums">
                      S/ {currentSize.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onQuickAddToCart(product);
                      }}
                      className="p-2 bg-[#1A1A1A] hover:bg-stone-800 text-white rounded-lg transition-colors"
                      title="Agregar al carrito"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    </button>

                    <button
                      onClick={() => onRemoveFavorite(product)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Eliminar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {favorites.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-[#FAF8F5]">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
            >
              Cerrar y Seguir Comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
