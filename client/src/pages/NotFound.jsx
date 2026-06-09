import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="relative mb-6">
        <h1 className="text-9xl font-black text-slate-100 tracking-widest font-display select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xl font-bold uppercase tracking-widest text-amber-600 bg-slate-50 px-4 py-1">
            Page Not Found
          </p>
        </div>
      </div>
      
      <p className="text-slate-500 max-w-md mb-8 text-sm">
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-sm shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
        >
          <Home size={16} />
          Go Home
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Compass size={16} />
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
