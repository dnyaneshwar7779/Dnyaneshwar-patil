import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-10 flex items-center gap-3">
        <Heart size={28} className="text-amber-600" />
        My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-350">
            <Heart size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-700">Your wishlist is empty</h3>
            <p className="text-sm text-slate-400 mt-1">Tap the heart on any product to save it here for later.</p>
          </div>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-full shadow-md transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => {
            const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
            const hasDiscount = product.discountPrice > 0;
            const offPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

            return (
              <div
                key={product._id}
                className="group relative bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 mb-4">
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md z-15">
                      {offPercent}% OFF
                    </span>
                  )}
                  
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 p-2 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm z-20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>

                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images ? product.images[0] : product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </div>

                {/* Details */}
                <div className="space-y-1.5 px-1 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                    <Link to={`/product/${product._id}`} className="block">
                      <h3 className="text-sm font-bold text-slate-800 hover:text-amber-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-baseline gap-2 pt-1.5">
                      <span className="text-base font-extrabold text-slate-900">₹{activePrice}</span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockQuantity === 0}
                    className="w-full py-2.5 mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag size={14} />
                    {product.stockQuantity === 0 ? 'Out of Stock' : 'Add To Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
