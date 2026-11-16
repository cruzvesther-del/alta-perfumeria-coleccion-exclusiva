import React from 'react';
import { Heart, Star, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
  onQuickAddToCart
}) => {
  const currentSize = product.sizes[product.defaultSizeIndex] || product.sizes[0];
  const hasDiscount = currentSize.originalPrice && currentSize.originalPrice > currentSize.price;
  const discountPercent = hasDiscount 
    ? Math.round(((currentSize.originalPrice! - currentSize.price) / currentSize.originalPrice!) * 100)
    : 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:border-[#D4AF37]/60 hover:shadow-lg transition-all duration-300">
      
      {/* Image Container with Badges & Quick Action */}
      <div className="relative aspect-4/3 sm:aspect-square bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
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

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.bestSeller && (
            <span className="text-[10px] tracking-wider uppercase font-semibold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-full shadow-xs">
              Más Vendido
            </span>
          )}
          {product.isNew && (
            <span className="text-[10px] tracking-wider uppercase font-semibold bg-[#D4AF37] text-[#1A1A1A] px-2.5 py-1 rounded-full shadow-xs">
              Nuevo
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] tracking-wider uppercase font-semibold bg-[#E8C5C8] text-[#1A1A1A] px-2 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors backdrop-blur-xs ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white shadow-xs'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          title={isFavorite ? 'En tus favoritos' : 'Guardar en favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={() => onSelectProduct(product)}
            className="flex-1 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-900 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#8C6D23]" />
            <span>Ver Pirámide</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Concentration */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="uppercase tracking-wider font-medium text-[#8C6D23]">
              {product.categoryLabel}
            </span>
            <span>{product.concentration}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-serif-luxury text-base sm:text-lg font-semibold text-stone-900 hover:text-[#8C6D23] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-1 italic">
            "{product.tagline}"
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-200'}`} 
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-stone-800 tabular-nums">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-stone-400">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Price & Primary CTA */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-stone-400 uppercase tracking-wider">
              {currentSize.size}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">
                S/ {currentSize.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  S/ {currentSize.originalPrice!.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onQuickAddToCart(product)}
            className="bg-[#1A1A1A] hover:bg-[#2F2F2F] text-white p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 shadow-xs"
            title="Agregar al carrito"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">Añadir</span>
          </button>
        </div>

      </div>

    </div>
  );
};
