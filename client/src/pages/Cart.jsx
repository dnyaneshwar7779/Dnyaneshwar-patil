import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateCartQty,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useCart();
  const navigate = useNavigate();

  const handleQtyChange = (id, currentQty, amount, stock) => {
    const newQty = currentQty + amount;
    if (newQty >= 1 && newQty <= stock) {
      updateCartQty(id, newQty);
    }
  };

  const freeShippingLimit = 1000;
  const remainingForFreeShipping = freeShippingLimit - itemsPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-10 flex items-center gap-3">
        <ShoppingBag size={28} className="text-amber-600" />
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-350">
            <ShoppingBag size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-700">Your cart is empty</h3>
            <p className="text-sm text-slate-400 mt-1">Add shirts and pants to your cart to see them here.</p>
          </div>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-full shadow-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Alert banner */}
            {remainingForFreeShipping > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-semibold text-amber-800">
                🚀 Add <strong className="text-amber-950">₹{remainingForFreeShipping}</strong> more to your cart to get <strong className="text-amber-950">FREE shipping</strong>!
              </div>
            ) : (
              <div className="bg-emerald-550/10 border border-emerald-500/20 text-emerald-800 rounded-2xl p-4 text-xs font-bold">
                🎉 Congratulations! Your order qualifies for <strong className="text-emerald-950">FREE shipping</strong>.
              </div>
            )}

            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm divide-y divide-slate-100">
              {cartItems.map((item) => {
                const activePrice = item.discountPrice > 0 ? item.discountPrice : item.price;
                const hasDiscount = item.discountPrice > 0;
                
                return (
                  <div key={item._id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6">
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 sm:w-24 sm:h-32 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                    />

                    {/* Description Details */}
                    <div className="flex-1 min-w-0 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <Link to={`/product/${item._id}`}>
                          <h3 className="font-bold text-slate-800 hover:text-amber-600 transition-colors text-base truncate">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Qty Available: {item.stockQuantity}</p>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-slate-200 rounded-full p-0.5 bg-slate-50">
                          <button
                            onClick={() => handleQtyChange(item._id, item.qty, -1, item.stockQuantity)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-650 hover:bg-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-850">{item.qty}</span>
                          <button
                            onClick={() => handleQtyChange(item._id, item.qty, 1, item.stockQuantity)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-650 hover:bg-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 p-1"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price block */}
                    <div className="text-right sm:self-center flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-1">
                      <span className="text-lg font-black text-slate-900">₹{activePrice * item.qty}</span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">₹{item.price * item.qty}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout Invoice Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span className="font-semibold text-slate-900">₹{taxPrice}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-slate-100">
                  <span>Shipping:</span>
                  <span className="font-semibold text-slate-900">
                    {shippingPrice === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2">
                  <span>Total Amount:</span>
                  <span className="text-lg font-black">₹{totalPrice}</span>
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-full shadow-lg shadow-amber-600/15 flex items-center justify-center gap-2 transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>
                <Link
                  to="/shop"
                  className="w-full py-3.5 block text-center border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-full font-bold text-sm transition-all"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
