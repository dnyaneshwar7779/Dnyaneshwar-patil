import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { ArrowRight, ShoppingBag, Heart, Star, ShieldCheck, Zap, Truck, RotateCcw } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: 'Signature T-Shirts Collection',
    subtitle: 'Crafted from 100% premium combed cotton. Perfect fits, timeless cuts.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop',
    link: '/category/t-shirts',
    btnText: 'Shop T-Shirts',
  },
  {
    title: 'Premium Fit Pants & Chinos',
    subtitle: 'Elevated trousers, cargo pants, and lounge joggers tailored for modern comfort.',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1600&auto=format&fit=crop',
    link: '/category/pants',
    btnText: 'Shop Pants',
  }
];

export default function Home() {
  const { addToCart, addToWishlist, wishlist } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await api.products.getAll();
        // Take first 4 items as featured
        setProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const isInWishlist = (id) => wishlist.some((item) => item._id === id);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Carousel */}
      <section className="relative h-[480px] sm:h-[600px] overflow-hidden bg-slate-950">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background image */}
            <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transform scale-105 transition-transform duration-10000"
            />
            {/* Text details overlay */}
            <div className="absolute inset-0 flex items-center z-25 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="max-w-2xl text-white space-y-6 animate-fadeIn">
                <span className="inline-block text-amber-500 font-bold uppercase tracking-widest text-xs sm:text-sm">
                  New Season Arrivals
                </span>
                <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-tight">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-lg text-slate-200 font-medium max-w-lg">
                  {slide.subtitle}
                </p>
                <div className="pt-4 flex gap-4">
                  <Link
                    to={slide.link}
                    className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-sm shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all hover:translate-x-1"
                  >
                    {slide.btnText}
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/shop"
                    className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-sm backdrop-blur-sm transition-all"
                  >
                    Browse Catalog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Categories Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">Shop by Category</h2>
          <p className="text-sm text-slate-500">Pick from our premium tees or functional trousers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* T-shirts block */}
          <Link
            to="/category/t-shirts"
            className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 z-10 transition-colors"></div>
            <img
              src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop"
              alt="T-Shirts category"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-8 left-8 z-20 text-white space-y-2">
              <h3 className="text-2xl font-black font-display uppercase tracking-wider">T-Shirts Collection</h3>
              <p className="text-xs text-slate-200">Starting from ₹399. Cotton tees, graphic prints, and sport polos.</p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:text-amber-300 pt-1">
                Explore Items <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* Pants block */}
          <Link
            to="/category/pants"
            className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 z-10 transition-colors"></div>
            <img
              src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop"
              alt="Pants category"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-8 left-8 z-20 text-white space-y-2">
              <h3 className="text-2xl font-black font-display uppercase tracking-wider">Premium Pants</h3>
              <p className="text-xs text-slate-200">Starting from ₹799. Cargo pants, tech joggers, and tailored chinos.</p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:text-amber-300 pt-1">
                Explore Items <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 font-display">Trending Now</h2>
            <p className="text-sm text-slate-500">Take a look at this week's highest-rated clothes.</p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 transition-colors"
          >
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="bg-slate-200 aspect-[3/4] rounded-2xl"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
              const hasDiscount = product.discountPrice > 0;
              const offPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

              return (
                <div key={product._id} className="group relative bg-white rounded-2xl border border-slate-100 p-3 shadow-xs hover:shadow-lg transition-all duration-300">
                  {/* Image wrapper */}
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 mb-4">
                    {hasDiscount && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md z-20">
                        {offPercent}% OFF
                      </span>
                    )}
                    
                    {/* Actions on hover */}
                    <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-25 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => addToWishlist(product)}
                        className={`p-2.5 rounded-full shadow-md transition-colors ${
                          isInWishlist(product._id)
                            ? 'bg-amber-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Heart size={16} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="p-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-md transition-colors"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>

                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  {/* Text details */}
                  <div className="space-y-1.5 px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                    <Link to={`/product/${product._id}`} className="block">
                      <h3 className="text-sm font-bold text-slate-800 hover:text-amber-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold text-slate-650">{product.ratings.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-450">({product.numReviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-base font-extrabold text-slate-900">₹{activePrice}</span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Selling Points Section */}
      <section className="bg-slate-900 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3 flex flex-col items-center">
            <div className="p-4 bg-white/5 rounded-2xl text-amber-500">
              <Truck size={32} />
            </div>
            <h3 className="font-bold text-base">Free Express Shipping</h3>
            <p className="text-xs text-slate-400 max-w-[180px]">Enjoy free delivery on all purchases above ₹1,000.</p>
          </div>

          <div className="space-y-3 flex flex-col items-center">
            <div className="p-4 bg-white/5 rounded-2xl text-amber-500">
              <RotateCcw size={32} />
            </div>
            <h3 className="font-bold text-base">Easy 15-Day Returns</h3>
            <p className="text-xs text-slate-400 max-w-[180px]">No questions asked return or size swap policies.</p>
          </div>

          <div className="space-y-3 flex flex-col items-center">
            <div className="p-4 bg-white/5 rounded-2xl text-amber-500">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-bold text-base">Secure UPI & COD</h3>
            <p className="text-xs text-slate-400 max-w-[180px]">Pay securely using UPI networks or cash on delivery.</p>
          </div>

          <div className="space-y-3 flex flex-col items-center">
            <div className="p-4 bg-white/5 rounded-2xl text-amber-500">
              <Zap size={32} />
            </div>
            <h3 className="font-bold text-base">24/7 Support Desk</h3>
            <p className="text-xs text-slate-400 max-w-[180px]">Get round-the-clock chat support for sizing help.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
