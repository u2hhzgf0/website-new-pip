'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../store/api/authApi';
import { setUser } from '../store/slices/authSlice';
import { Toast, ToastType } from './Toast';
import { TrendingUp, ArrowRight, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrorMessage(''); // Clear error on input change
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // Check if user is admin (admins should use admin panel)
      const user = result.data.attributes.user;
      if (user.role === 'admin' || user.role === 'superadmin') {
        setErrorMessage('Access denied. This portal is for users only. Please use the admin panel.');
        setToast({
          message: 'Access denied. Please use the admin panel.',
          type: 'error'
        });
        // Clear the stored tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return;
      }

      // Set user in Redux store
      dispatch(setUser(user));

      // Show success toast
      setToast({
        message: `Welcome back, ${user.firstName}! Redirecting to dashboard...`,
        type: 'success'
      });

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.data?.message || 'Login failed. Please check your credentials.';
      setErrorMessage(errorMsg);
      setToast({
        message: errorMsg,
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/seed/finance/1920/1080?grayscale&blur=4"
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-900/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4 group">
            <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6 text-slate-950" />
            </div>
            <span className="text-2xl font-serif font-bold text-white tracking-wide leading-none">
              Pip<span className="text-gold-500">guardian</span><span className="text-green-400 text-xs font-bold ml-0.5 align-bottom">elt</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">Access your portfolio and track your growth.</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 sm:p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-rose-500/10 border border-rose-500/50 rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-400">{errorMessage}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-gold-500 hover:text-gold-400">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-lg pl-10 pr-10 py-3 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-gold-500 focus:ring-gold-500/50"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-slate-950 font-bold py-3 px-4 rounded-lg shadow-lg shadow-gold-500/20 disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-500 shrink-0">or continue with</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`; }}
            className="mt-4 w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-gold-500 font-semibold hover:text-gold-400 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center space-x-4 sm:space-x-6 text-xs text-slate-500">
          <a href="#" className="hover:text-slate-300">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300">Terms of Service</a>
          <a href="#" className="hover:text-slate-300">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
