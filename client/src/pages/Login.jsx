import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');

  const redirect = location.state?.from?.pathname || '/profile';

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Handle the admin seeder alias: seeder seeds email 'nanugujar@nanugujar.com' but username is 'nanugujar'.
      // If user inputs 'nanugujar' as email, map it internally to 'nanugujar@nanugujar.com'!
      let loginEmail = email.trim();
      if (loginEmail === 'nanugujar') {
        loginEmail = 'nanugujar@nanugujar.com';
      }

      await login(loginEmail, password);
      // Success will trigger redirect via the useEffect
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    setForgotErr('');

    try {
      let resetEmail = forgotEmail.trim();
      if (resetEmail === 'nanugujar') {
        resetEmail = 'nanugujar@nanugujar.com';
      }
      
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await response.json();

      if (response.ok) {
        setForgotMsg(data.message);
      } else {
        setForgotErr(data.message);
      }
    } catch (err) {
      setForgotErr('Network error. Make sure server is running.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-100 space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-2">Log in to check out, track orders, or manage your wishlist.</p>
        </div>

        {/* Credentials helper *
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
          <p className="font-bold">💡 Test Login Credentials:</p>
          <p>• <strong>Admin Login:</strong> Username: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">nanugujar</code> | Password: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">nanu@123</code></p>
          <p>• <strong>Customer Login:</strong> Email: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">customer@customer.com</code> | Password: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">customer123</code></p>
        </div>*/}

        {error && (
          <div className="bg-red-50 border border-red-150 text-red-700 p-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Username / Email Address</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="nanugujar or customer@customer.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                />
                <Key size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-amber-600 hover:text-amber-700">
            Create Account
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setShowForgotModal(false)}></div>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
              <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            
            <p className="text-xs text-slate-500">Enter your email and we'll send credentials instructions.</p>

            {forgotMsg && <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs">{forgotMsg}</div>}
            {forgotErr && <div className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-xl text-xs">{forgotErr}</div>}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="text"
                required
                placeholder="nanugujar or email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-xs shadow-md transition-colors"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
