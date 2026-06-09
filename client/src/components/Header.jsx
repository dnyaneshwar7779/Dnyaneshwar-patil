import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart, User, Search, Menu, X, Trash2, ArrowRight } from 'lucide-react';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { cartItems, cartCount, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${keyword.trim()}`);
    } else {
      navigate('/shop');
    }
    setKeyword('');
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Navbar Container */}
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-extrabold tracking-wider text-slate-900 font-display">
                NANU<span className="text-amber-600">GUJAR</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors">Home</Link>
              <Link to="/shop" className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors">Shop All</Link>
              <Link to="/category/t-shirts" className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors">T-Shirts</Link>
              <Link to="/category/pants" className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors">Pants</Link>
              <Link to="/about" className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors">About Us</Link>
              <Link to="/contact" className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors">Contact</Link>
            </nav>

            {/* Search and User Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search T-shirts, Pants..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-60 bg-slate-50 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-amber-600 transition-colors">
                  <Search size={16} />
                </button>
              </form>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-1 text-slate-700 hover:text-amber-600 transition-colors">
                <Heart size={22} />
              </Link>

              {/* Cart Toggle */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-1 text-slate-700 hover:text-amber-600 transition-colors focus:outline-none"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 p-1 text-slate-700 hover:text-amber-600 transition-colors focus:outline-none"
                >
                  <User size={22} />
                  {user && <span className="text-xs font-semibold max-w-[80px] truncate">{user.name.split(' ')[0]}</span>}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50">
                    {user ? (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                        >
                          My Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-amber-700 font-semibold hover:bg-amber-50"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <hr className="border-slate-100 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                        >
                          Log In
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Actions (Menu button, Cart button) */}
            <div className="flex lg:hidden items-center space-x-4">
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-1.5 text-slate-700 hover:text-amber-600 transition-colors"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-amber-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-slate-700 hover:text-amber-600 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-4 shadow-lg animate-fadeIn">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mt-2">
              <input
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button type="submit" className="absolute right-3 top-3 text-slate-400">
                <Search size={16} />
              </button>
            </form>

            <div className="flex flex-col space-y-3 font-semibold text-slate-700 pt-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-600 py-1 border-b border-slate-50">Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-600 py-1 border-b border-slate-50">Shop All</Link>
              <Link to="/category/t-shirts" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-600 py-1 border-b border-slate-50">T-Shirts</Link>
              <Link to="/category/pants" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-600 py-1 border-b border-slate-50">Pants</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-600 py-1 border-b border-slate-50">About Us</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-600 py-1 border-b border-slate-50">Contact</Link>
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-600 py-1 border-b border-slate-50 flex items-center justify-between">
                <span>Wishlist</span>
                <Heart size={18} />
              </Link>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-600 py-1 border-b border-slate-50 flex items-center justify-between">
                <span>My Profile</span>
                <User size={18} />
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-amber-700 py-1 border-b border-slate-50 font-bold">
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-600 font-bold py-2 hover:bg-red-50 rounded"
                >
                  Sign Out
                </button>
              ) : (
                <div className="flex space-x-4 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 bg-amber-600 text-white rounded-full text-sm font-bold shadow-md shadow-amber-600/20 hover:bg-amber-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sliding Shopping Cart Drawer */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartDrawerOpen(false)}
          ></div>

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-all duration-300">
              {/* Drawer Header */}
              <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-amber-600" />
                  Your Shopping Cart ({cartCount})
                </h2>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-slate-50 p-6 rounded-full text-slate-300">
                      <ShoppingBag size={48} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700">Your cart is empty</h3>
                      <p className="text-sm text-slate-400 mt-1">Start shopping our collection of T-Shirts and Pants today!</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigate('/shop');
                      }}
                      className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-full hover:bg-slate-800 transition-colors"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {cartItems.map((item) => {
                      const activePrice = item.discountPrice > 0 ? item.discountPrice : item.price;
                      return (
                        <div key={item._id} className="py-4 flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-20 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-800 truncate">{item.name}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Qty: {item.qty}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm font-bold text-slate-900">₹{activePrice}</span>
                              {item.discountPrice > 0 && (
                                <span className="text-xs line-through text-slate-400">₹{item.price}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-slate-400 hover:text-red-500 self-center p-1 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-slate-100 px-6 py-6 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                    <span>Subtotal:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <p className="text-xs text-slate-400">Shipping and GST calculated at checkout. Free shipping on orders over ₹1,000.</p>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigate('/cart');
                      }}
                      className="flex-1 py-3 text-center border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-full font-bold text-sm transition-all"
                    >
                      View Cart
                    </button>
                    <button
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigate('/checkout');
                      }}
                      className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-full shadow-lg shadow-amber-600/15 flex items-center justify-center gap-2 transition-all"
                    >
                      Checkout
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
