import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { Star, Heart, ShoppingBag, SlidersHorizontal, Grid, ArrowUpDown, X } from 'lucide-react';

export default function ProductListing() {
  const { addToCart, addToWishlist, wishlist } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams();

  // Filter States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState('newest');

  // Search parameters from URL
  const categoryParam = slug
    ? (slug.toLowerCase() === 't-shirts' ? 'T-Shirts' : slug.toLowerCase() === 'pants' ? 'Pants' : '')
    : (searchParams.get('category') || '');
  const keywordParam = searchParams.get('keyword') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = {
          keyword: keywordParam,
          category: categoryParam,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < 2000 ? maxPrice : undefined,
          sort,
        };
        const data = await api.products.getAll(queryParams);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, keywordParam, minPrice, maxPrice, sort]);

  const handleCategoryChange = (catName) => {
    if (catName) {
      setSearchParams({ category: catName, ...(keywordParam && { keyword: keywordParam }) });
    } else {
      const newParams = {};
      if (keywordParam) newParams.keyword = keywordParam;
      setSearchParams(newParams);
    }
  };

  const handleClearFilters = () => {
    setMinPrice(0);
    setMaxPrice(2000);
    setSort('newest');
    setSearchParams({});
  };

  const isInWishlist = (id) => wishlist.some((item) => item._id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Listing Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            {categoryParam ? `${categoryParam}` : 'All Products'}
          </h1>
          {keywordParam && (
            <p className="text-sm text-slate-500 mt-1">
              Search results for: <span className="font-bold text-amber-600">"{keywordParam}"</span>
            </p>
          )}
        </div>

        {/* Filter Controls (Desktop & Mobile trigger) */}
        <div className="flex items-center gap-4 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 bg-white"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-slate-200 rounded-full py-2 pl-3 pr-8 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters (Desktop only) */}
        <aside className="hidden lg:block space-y-8 self-start sticky top-28">
          {/* Categories Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Categories</h3>
            <div className="flex flex-col space-y-2.5">
              <button
                onClick={() => handleCategoryChange('')}
                className={`text-left text-sm font-medium ${
                  !categoryParam ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All Collections
              </button>
              <button
                onClick={() => handleCategoryChange('T-Shirts')}
                className={`text-left text-sm font-medium ${
                  categoryParam === 'T-Shirts' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                T-Shirts
              </button>
              <button
                onClick={() => handleCategoryChange('Pants')}
                className={`text-left text-sm font-medium ${
                  categoryParam === 'Pants' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pants
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Price Range Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Price Range</h3>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
                <span>Min: ₹0</span>
                <span>Max: ₹{maxPrice}</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Clear Button */}
          <button
            onClick={handleClearFilters}
            className="w-full py-2.5 border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold text-sm rounded-full transition-all"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="bg-slate-200 aspect-[3/4] rounded-2xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl space-y-4 px-4">
              <div className="text-slate-300 text-5xl flex justify-center">🔍</div>
              <h3 className="font-extrabold text-slate-700 text-lg">No Products Found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                We couldn't find any products matching your search terms or filter selections. Try clearing your filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
                const hasDiscount = product.discountPrice > 0;
                const offPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 mb-4">
                      {hasDiscount && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md z-15">
                          {offPercent}% OFF
                        </span>
                      )}

                      <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
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

                    <div className="space-y-1.5 px-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                      <Link to={`/product/${product._id}`} className="block">
                        <h3 className="text-sm font-bold text-slate-800 hover:text-amber-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold text-slate-650">{product.ratings.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-450">({product.numReviews})</span>
                      </div>

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
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden flex lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          ></div>
          <div className="absolute inset-y-0 left-0 w-80 max-w-full bg-white shadow-2xl flex flex-col h-full transform transition-all">
            <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-1 text-slate-500 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {/* Category Filter */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</h3>
                <div className="flex flex-col space-y-3 font-semibold text-slate-700">
                  <button
                    onClick={() => { handleCategoryChange(''); setShowMobileFilters(false); }}
                    className={`text-left text-sm ${!categoryParam ? 'text-amber-600' : ''}`}
                  >
                    All Collections
                  </button>
                  <button
                    onClick={() => { handleCategoryChange('T-Shirts'); setShowMobileFilters(false); }}
                    className={`text-left text-sm ${categoryParam === 'T-Shirts' ? 'text-amber-600' : ''}`}
                  >
                    T-Shirts
                  </button>
                  <button
                    onClick={() => { handleCategoryChange('Pants'); setShowMobileFilters(false); }}
                    className={`text-left text-sm ${categoryParam === 'Pants' ? 'text-amber-600' : ''}`}
                  >
                    Pants
                  </button>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Price Filter */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Price (₹{maxPrice})</h3>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
              <button
                onClick={() => { handleClearFilters(); setShowMobileFilters(false); }}
                className="flex-1 py-3 text-center border border-slate-200 bg-white font-bold text-xs rounded-full"
              >
                Clear
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
