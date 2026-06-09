import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to NanuGujar newsletters!');
    e.target.reset();
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-extrabold tracking-wider text-white font-display">
              NANU<span className="text-amber-500">GUJAR</span>
            </Link>
            <p className="text-sm text-slate-400">
              NanuGujar is your ultimate destination for premium quality T-shirts and Pants. Discover comfort, durability, and top-tier streetwear fashion.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-slate-800 hover:bg-amber-600 hover:text-white rounded-full text-slate-400 transition-all" aria-label="Facebook">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-amber-600 hover:text-white rounded-full text-slate-400 transition-all" aria-label="Instagram">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-amber-600 hover:text-white rounded-full text-slate-400 transition-all" aria-label="Twitter">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-6">Shop Collection</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/shop" className="hover:text-amber-500 transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/category/t-shirts" className="hover:text-amber-500 transition-colors">T-Shirts Collection</Link>
              </li>
              <li>
                <Link to="/category/pants" className="hover:text-amber-500 transition-colors">Premium Pants</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-amber-500 transition-colors">My Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-base mb-6">Contact & Support</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">Bhadli khrud , Jalgaon,Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-500 flex-shrink-0" />
                <span className="text-slate-400">+919370793886</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-500 flex-shrink-0" />
                <span className="text-slate-400">gujarnanu124@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-base mb-6">Join the Club</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to get notified about product releases, secret discounts, and custom deals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-2.5 rounded-lg shadow-lg shadow-amber-600/10 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-850 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NanuGujar E-Commerce. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-350">Privacy Policy</a>
            <a href="#" className="hover:text-slate-350">Terms of Service</a>
            <a href="#" className="hover:text-slate-350">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
