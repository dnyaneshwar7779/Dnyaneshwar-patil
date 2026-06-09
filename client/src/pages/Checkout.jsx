import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MapPin, Phone, ShieldCheck, CheckCircle2, ChevronLeft, CreditCard } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const {
    cartItems,
    shippingAddress,
    saveShippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();
  
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [phone, setPhone] = useState(shippingAddress.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!address || !city || !postalCode || !phone) {
      setError('Please fill in all shipping details');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    
    try {
      const addressPayload = {
        address,
        city,
        postalCode,
        country: 'India',
        phone,
      };

      // Save to localStorage/context for future checkouts
      saveShippingAddress(addressPayload);

      const orderItems = cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.discountPrice > 0 ? item.discountPrice : item.price,
        product: item._id,
      }));

      const orderPayload = {
        orderItems,
        shippingAddress: addressPayload,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const createdOrder = await api.orders.create(orderPayload);
      
      // Clear client state
      clearCart();
      
      // Toggle success viewport
      setOrderSuccess(createdOrder);
    } catch (err) {
      setError(err.message || 'Failed to place order. Check stock availability.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        
        <div className="space-y-2">
          <span className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Checkout Complete</span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">Order Confirmed!</h1>
          <p className="text-sm text-slate-500">
            Thank you for shopping at NanuGujar. Your order has been placed successfully.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            Order Reference ID: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-xs">{orderSuccess._id}</code>
          </p>
          <p className="text-sm text-slate-650">Total Amount Charged: <strong>₹{orderSuccess.totalPrice}</strong></p>
          <p className="text-sm text-slate-650">Payment Selection: <strong>{orderSuccess.paymentMethod}</strong></p>
          <p className="text-sm text-slate-650">Delivery Address: <strong>{orderSuccess.shippingAddress.address}, {orderSuccess.shippingAddress.city}</strong></p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-sm shadow-md"
          >
            View Order History
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-full font-bold text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Return button */}
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-8"
      >
        <ChevronLeft size={16} />
        Back to Cart
      </button>

      <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-10">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-150 text-red-700 p-4 rounded-2xl mb-8 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Side Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping form */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={20} className="text-amber-600" />
              Shipping Address
            </h2>

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Apartment/Flat, Block, Street Name"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Ahmedabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Postal Code (PIN)</label>
                  <input
                    type="text"
                    required
                    placeholder="380001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    />
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Country</label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-550"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method selector */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard size={20} className="text-amber-600" />
              Payment Selection
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-5 rounded-2xl border-2 text-left space-y-2 flex flex-col justify-between transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 hover:border-slate-400 text-slate-700 bg-white'
                }`}
              >
                <span className="font-bold text-sm">Cash on Delivery</span>
                <span className={`text-[10px] ${paymentMethod === 'COD' ? 'text-slate-300' : 'text-slate-400'}`}>
                  Pay with cash upon arrival
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-5 rounded-2xl border-2 text-left space-y-2 flex flex-col justify-between transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 hover:border-slate-400 text-slate-700 bg-white'
                }`}
              >
                <span className="font-bold text-sm">Instant UPI</span>
                <span className={`text-[10px] ${paymentMethod === 'UPI' ? 'text-slate-300' : 'text-slate-400'}`}>
                  GPay, PhonePe, Paytm (Mock)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Razorpay')}
                className={`p-5 rounded-2xl border-2 text-left space-y-2 flex flex-col justify-between transition-all ${
                  paymentMethod === 'Razorpay'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 hover:border-slate-400 text-slate-700 bg-white'
                }`}
              >
                <span className="font-bold text-sm">Cards & Netbanking</span>
                <span className={`text-[10px] ${paymentMethod === 'Razorpay' ? 'text-slate-300' : 'text-slate-400'}`}>
                  Razorpay Integration Ready
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Items Checklist</h2>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item._id} className="py-3.5 first:pt-0 last:pb-0 flex gap-3">
                  <img src={item.image} alt="" className="w-10 h-14 object-cover rounded-lg border border-slate-100 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                    <p className="text-[10px] text-slate-400">Qty: {item.qty} × ₹{item.discountPrice > 0 ? item.discountPrice : item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-slate-100" />

            {/* Calculations */}
            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900">₹{itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span className="font-bold text-slate-900">₹{taxPrice}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-slate-100">
                <span>Shipping Fee:</span>
                <span className="font-bold text-slate-900">
                  {shippingPrice === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2">
                <span>Total Charge:</span>
                <span className="text-base font-black">₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-full shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Authorize & Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
