'use client'

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { TrendingUp, ArrowRight, Lock, Mail, User, Users, Phone, Loader2, Eye, EyeOff, ShieldCheck, LineChart, Sparkles } from 'lucide-react';
import { useRegisterMutation } from '@/store/api/authApi';
import { Toast, ToastType } from '@/components/Toast';
// Cloudflare Turnstile is disabled for local development because the configured
// site key is only authorized for the production domain. Re-enable by restoring
// this import and the commented blocks below once testing on the real domain.
// import { Turnstile } from '@marsidev/react-turnstile';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState(refCode);
  // const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    // if (!turnstileToken) {
    //   setToast({ message: 'Please complete the security check.', type: 'error' });
    //   return;
    // }

    try {
      await register({
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        // cfTurnstileToken: turnstileToken,
        ...(referralCode ? { referralCode } : {}),
      }).unwrap();

      setToast({ message: 'Account created! Please verify your email.', type: 'success' });

      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (error: any) {
      const errorMsg = error?.data?.message || 'Registration failed. Please try again.';
      setToast({ message: errorMsg, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen relative flex bg-slate-50 dark:bg-slate-950">
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Left Branding / Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-950 to-brand-700/40">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          <Link href="/" className="inline-flex items-center space-x-2 group w-fit">
            <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6 text-slate-950" />
            </div>
            <span className="text-2xl font-serif font-bold text-white tracking-wide leading-none">
              Pip<span className="text-brand-400">guardian</span><span className="text-brand-300 text-xs font-bold ml-0.5 align-bottom">elt</span>
            </span>
          </Link>

          <div className="flex flex-col items-center text-center">
            <img
              src="/images/auth-sidebar.png"
              alt="Join Pipguardian and grow your investments"
              className="w-full max-w-md drop-shadow-2xl"
            />
            <h3 className="text-2xl xl:text-3xl font-bold text-white mt-6">
              Start your journey to financial freedom.
            </h3>
            <p className="text-slate-300 text-sm mt-3 max-w-sm">
              Join thousands of investors already growing their portfolio with Pipguardian.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <ShieldCheck className="h-5 w-5 text-brand-400 shrink-0" />
              Bank-grade security on every account
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <LineChart className="h-5 w-5 text-brand-400 shrink-0" />
              Real-time portfolio tracking & insights
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Sparkles className="h-5 w-5 text-brand-400 shrink-0" />
              Trusted by thousands of investors
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative overflow-hidden py-12">
        {/* Mobile background */}
        <div className="absolute inset-0 z-0 lg:hidden">
          <img
            src="https://picsum.photos/seed/building/1920/1080?grayscale&blur=4"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-900/50"></div>
        </div>

        <div className="relative z-10 w-full max-w-xl px-4">
          {/* Brand Header (mobile only, since desktop shows it on the left panel) */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4 group">
               <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-slate-950" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-wide leading-none">
                Pip<span className="text-brand-400">guardian</span><span className="text-brand-300 text-xs font-bold ml-0.5 align-bottom">elt</span>
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-white">Join the Elite</h2>
            <p className="text-slate-400 text-sm mt-2">Start your journey to financial freedom today.</p>
          </div>

          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Join the Elite</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Start your journey to financial freedom today.</p>
          </div>

          {/* Register Card */}
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 rounded-2xl shadow-2xl">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 dark:text-slate-500">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder-slate-400 dark:placeholder-slate-600"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 dark:text-slate-500">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder-slate-400 dark:placeholder-slate-600"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 dark:text-slate-500">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 dark:text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 dark:text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 dark:text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                  Referral Code <span className="text-slate-600 dark:text-slate-500">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 dark:text-slate-500">
                    <Users size={18} />
                  </div>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="Enter referral code"
                  />
                </div>
              </div>

              <div className="flex items-start mt-2">
                <div className="flex items-center h-5">
                  <input id="terms" type="checkbox" required className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-brand-500 focus:ring-brand-500/50" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-slate-500 dark:text-slate-400">I agree to the <a href="#" className="text-brand-500 hover:underline">Terms of Service</a> and <a href="#" className="text-brand-500 hover:underline">Privacy Policy</a></label>
                </div>
              </div>

              {/* <div className="flex justify-center">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                  onSuccess={setTurnstileToken}
                  onExpire={() => setTurnstileToken(null)}
                  onError={() => setTurnstileToken(null)}
                  options={{ theme: 'dark' }}
                />
              </div> */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-500/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center group mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
              <span className="text-xs text-slate-600 dark:text-slate-500 shrink-0">or sign up with</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Google Register */}
            <button
              type="button"
              onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`; }}
              className="mt-4 w-full flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-900 dark:text-white font-medium py-3.5 px-4 rounded-xl transition-all"
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
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-brand-500 font-semibold hover:text-brand-400 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Register = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="text-brand-500 animate-spin" size={32} />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
};

export default Register;
