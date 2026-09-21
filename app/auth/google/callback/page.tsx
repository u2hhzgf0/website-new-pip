'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function GoogleCallbackInner() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken  = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userRaw      = searchParams.get('user');
    const error        = searchParams.get('error');

    if (error || !accessToken || !refreshToken || !userRaw) {
      router.replace('/login?error=google_auth_failed');
      return;
    }

    try {
      const user = JSON.parse(userRaw);

      localStorage.setItem('accessToken',  accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user',         JSON.stringify(user));

      dispatch(setUser(user));
      router.replace('/dashboard');
    } catch {
      router.replace('/login?error=google_auth_failed');
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      <p className="text-slate-500 dark:text-slate-400 text-sm">Signing you in with Google...</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    }>
      <GoogleCallbackInner />
    </Suspense>
  );
}
