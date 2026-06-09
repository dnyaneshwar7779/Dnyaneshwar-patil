import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, Heart, ShoppingBag, Truck, RotateCcw, AlertTriangle, MessageSquare } from 'lucide-react';

const CLOTHING_SIZES = ['S', 'M', 'L', 'XL'];

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, addToWishlist, wishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);

  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prodData = await api.products.getOne(id);
        setProduct(prodData);
        
        const revData = await api.products.getReviews(id);
        setReviews(revData);
      } catch (error) {
        console.error('Failed to load product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setSubmittingReview(true);

    try {
      const data = await api.products.createReview(id, { rating, comment });
      setReviewSuccess(data.message || 'Review added successfully!');
      
      // Reload product and reviews
      const prodData = await api.products.getOne(id);
      setProduct(prodData);
      const revData = await api.products.getReviews(id);
      setReviews(revData);
      
      setComment('');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleQtyChange = (val) => {
    const newQty = qty + val;
    if (newQty >= 1 && newQty <= (product?.stockQuantity || 1)) {
      setQty(newQty);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-slate-200 aspect-[3/4] rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-200 rounded w-2/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-20 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h3 className="text-lg font-bold text-slate-800">Product Not Found</h3>
        <Link to="/shop" className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const isWishlisted = wishlist.some((x) => x._id === product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Side: Images Viewer */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-all"
            />
          </div>
          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 bg-slate-50 flex-shrink-0 ${
                    idx === selectedImage ? 'border-amber-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
            <h1 className="text-3xl font-extrabold text-slate-900 font-display leading-tight">{product.name}</h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                <Star size={18} fill="currentColor" />
                <span className="text-sm font-bold text-slate-700 ml-1">{product.ratings.toFixed(1)}</span>
              </div>
              <span className="text-slate-200">|</span>
              <span className="text-xs text-slate-500 font-medium">{product.numReviews} Customer Reviews</span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-black text-slate-900">₹{activePrice}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-slate-450 line-through">₹{product.price}</span>
                  <span className="text-sm font-bold text-red-500">
                    ({Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF)
                  </span>
                </>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Product Details</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Size Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Size</h3>
            <div className="flex gap-3">
              {CLOTHING_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl border-2 font-bold text-sm flex items-center justify-center transition-all ${
                    size === selectedSize
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 hover:border-slate-400 text-slate-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sizing Note / Stock Limit warning */}
          <div className="space-y-2">
            {product.stockQuantity === 0 ? (
              <div className="flex items-center gap-2 text-red-650 bg-red-50 p-3.5 rounded-xl text-xs font-semibold">
                <AlertTriangle size={16} />
                <span>Out of stock! This product is currently unavailable.</span>
              </div>
            ) : product.stockQuantity <= 5 ? (
              <div className="flex items-center gap-2 text-amber-800 bg-amber-50 p-3.5 rounded-xl text-xs font-semibold">
                <AlertTriangle size={16} />
                <span>Only {product.stockQuantity} items left in stock. Order soon!</span>
              </div>
            ) : (
              <div className="text-xs text-emerald-600 font-bold">✓ In Stock (Ready to dispatch)</div>
            )}
          </div>

          {/* Qty Adjustment and Add Actions */}
          {product.stockQuantity > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-slate-200 rounded-full p-1 self-start sm:self-auto bg-white">
                <button
                  onClick={() => handleQtyChange(-1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-800">{qty}</span>
                <button
                  onClick={() => handleQtyChange(1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => {
                  addToCart(product, qty);
                  alert(`Added ${qty} × ${product.name} (Size: ${selectedSize}) to cart!`);
                }}
                className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag size={18} />
                Add To Cart
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  addToWishlist(product);
                  alert(`${product.name} added to wishlist!`);
                }}
                className={`p-3.5 rounded-full border shadow-sm transition-colors ${
                  isWishlisted ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-amber-600">
                <Truck size={16} />
              </div>
              <span className="text-xs text-slate-500 font-semibold">Free Shipping above ₹1000</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-amber-600">
                <RotateCcw size={16} />
              </div>
              <span className="text-xs text-slate-500 font-semibold">Easy 15 Days Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <section className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side: Reviews list */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-slate-400" />
            Customer Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-sm text-slate-400">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="divide-y divide-slate-100 space-y-6">
              {reviews.map((rev) => (
                <div key={rev._id} className="pt-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">{rev.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Stars */}
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.round(rev.rating) ? 'currentColor' : 'none'}
                        className="mr-0.5"
                      />
                    ))}
                  </div>

                  <p className="text-sm text-slate-650 leading-relaxed font-medium">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Write a review form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sticky top-28 space-y-6">
            <h3 className="font-bold text-slate-900">Write a Review</h3>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs">
                    {reviewSuccess}
                  </div>
                )}
                {reviewError && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-xl text-xs">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                    <option value="2">2 Stars (Poor)</option>
                    <option value="1">1 Star (Terrible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Comment</label>
                  <textarea
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write details of your experience..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs shadow-md transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-slate-500">You must be logged in to leave reviews.</p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
