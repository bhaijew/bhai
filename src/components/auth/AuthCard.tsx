'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/shared/ScrollReveal';

interface AuthCardProps {
  initialMode?: 'login' | 'signup';
}

export default function AuthCard({ initialMode = 'login' }: AuthCardProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Register Form States
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Security & Auth States
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);

  // Sync with browser back/forward and URL change
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('signup') || path.includes('register')) {
        setMode('signup');
      } else {
        setMode('login');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Lockout Countdown Timer
  useEffect(() => {
    if (!isBlocked || lockCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockCountdown((prev) => {
        if (prev <= 1) {
          setIsBlocked(false);
          setLoginError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBlocked, lockCountdown]);

  const switchMode = (newMode: 'login' | 'signup') => {
    if (newMode === mode) return;
    setMode(newMode);
    setLoginError('');
    setSignupError('');
    const targetPath = newMode === 'signup' ? '/signup' : '/login';
    window.history.pushState(null, '', targetPath);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword || isBlocked || authLoading) return;
    setAuthLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      setAuthLoading(false);

      if (data.success) {
        setLoggedIn(true);
        if (data.user?.role === 'admin' || loginIdentifier === 'admin@bhaijeweller.com') {
          setTimeout(() => {
            window.location.href = '/admin';
          }, 800);
        }
      } else {
        setLoginError(data.error || 'Login failed.');
        if (data.isBlocked) {
          setIsBlocked(true);
          setLockCountdown(data.remainingSeconds || 900);
        } else if (typeof data.attemptsLeft === 'number') {
          setAttemptsLeft(data.attemptsLeft);
        }
      }
    } catch (err) {
      setAuthLoading(false);
      setLoginError('Server connection error. Please try again.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupFullName || !signupEmail || !signupPassword || authLoading) return;

    if (signupPassword.length < 8) {
      setSignupError('Password must be at least 8 characters long.');
      return;
    }

    setAuthLoading(true);
    setSignupError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signupFullName,
          email: signupEmail,
          phone: signupPhone,
          password: signupPassword,
        }),
      });

      const data = await res.json();
      setAuthLoading(false);

      if (data.success) {
        setRegistered(true);
      } else {
        setSignupError(data.error || 'Failed to create account.');
      }
    } catch (err) {
      setAuthLoading(false);
      setSignupError('Server connection error. Please try again.');
    }
  };

  // Password Strength Evaluation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    if (pass.length < 8) return { score: 1, label: 'Weak (min 8 chars)', color: 'bg-red-500' };
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpec = /[^A-Za-z0-9]/.test(pass);
    const matches = [hasUpper, hasLower, hasNum, hasSpec].filter(Boolean).length;

    if (matches >= 3 && pass.length >= 10) return { score: 3, label: 'Strong Security ✓', color: 'bg-emerald-600' };
    if (matches >= 2) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 1, label: 'Weak', color: 'bg-red-500' };
  };

  const isLogin = mode === 'login';

  return (
    <main className="w-full flex-1 min-h-[680px] xl:min-h-[760px] bg-[#faf7f2] flex flex-col justify-center relative overflow-hidden select-none py-0">
      {/* ─────────────────────────────────────────────────────────────
          DESKTOP CONTAINER: Sliding Swap Layout (lg screens and above)
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block relative w-full h-full min-h-[680px] xl:min-h-[760px] overflow-hidden bg-[#faf7f2]">
        
        {/* The 2 Fixed Under-Panels (Login Form on Right, Sign Up Form on Left) */}
        <div className="absolute inset-0 grid grid-cols-2 w-full h-full">
          
          {/* Left Slot: SIGN UP FORM (Revealed when Hero Banner slides to the Right) */}
          <div
            className={`w-full h-full p-8 xl:p-14 flex flex-col justify-between transition-all duration-700 ease-out ${
              !isLogin
                ? 'opacity-100 scale-100 pointer-events-auto delay-150'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            {/* Top Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-[#ede4d8] p-1 rounded-full border border-[#ded3c5]">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
                    isLogin
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-sm'
                      : 'text-[#736355] hover:text-[#1c1510]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
                    !isLogin
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-sm'
                      : 'text-[#736355] hover:text-[#1c1510]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="text-xs text-[#8a796c] font-light">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="ml-1 text-[#9e7d56] font-medium hover:text-[#1c1510] transition-colors underline underline-offset-4"
                >
                  Log In
                </button>
              </div>
            </div>

            {/* Form Content */}
            <ScrollReveal direction="up" delay={100} className="max-w-md w-full mx-auto my-auto py-3">
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full border border-[#d8bb93] flex items-center justify-center bg-[#faf6ee] shadow-2xs">
                    <span className="font-serif text-sm text-[#9e7d56] font-semibold italic">B</span>
                  </div>
                  <span className="font-serif text-[11px] tracking-[0.25em] text-[#1c1510] uppercase font-normal">
                    BHAI JEWELLER
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1c1510] font-normal">
                  Create Your Account
                </h1>
                <p className="text-xs text-[#8a796c] font-light mt-1">
                  Join Bhai Jeweller and enjoy bespoke previews and private releases.
                </p>
              </div>

              {registered ? (
                <div className="p-6 rounded-2xl bg-[#faf6ee] border border-[#dec29b]/60 text-center animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-[#1c1510] text-[#f5efe8] flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <svg className="w-6 h-6 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-lg text-[#1c1510]">Account Created!</h3>
                  <p className="text-xs text-[#736355] font-light mt-1 mb-4">
                    Welcome to Bhai Jeweller, {signupFullName}. You can now save your wishlist and track your orders.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-light hover:bg-[#33261d] transition-all"
                  >
                    Start Exploring →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  {signupError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-light flex items-center gap-2 animate-fadeIn">
                      <svg className="w-4 h-4 text-red-600 shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      <span>{signupError}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1">
                      Full Name <span className="text-[#a83232]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1">
                      Email Address <span className="text-[#a83232]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1">
                      Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </span>
                      <input
                        type="tel"
                        placeholder="+44 7000 123456 or +92 300 1234567"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1">
                      Password <span className="text-[#a83232]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </span>
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="Create a strong password (min 8 chars)"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        aria-label="Toggle password visibility"
                        className="absolute right-3 p-1 text-[#8a796c] hover:text-[#1c1510] transition-colors"
                      >
                        {showSignupPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {signupPassword && (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#8a796c] font-light">Password Strength:</span>
                          <span className={`font-medium ${getPasswordStrength(signupPassword).score === 3 ? 'text-emerald-700' : getPasswordStrength(signupPassword).score === 2 ? 'text-amber-700' : 'text-red-600'}`}>
                            {getPasswordStrength(signupPassword).label}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#ede5db] rounded-full overflow-hidden flex gap-1 p-0.5">
                          <div className={`h-full rounded-full transition-all duration-300 flex-1 ${getPasswordStrength(signupPassword).score >= 1 ? getPasswordStrength(signupPassword).color : 'bg-transparent'}`} />
                          <div className={`h-full rounded-full transition-all duration-300 flex-1 ${getPasswordStrength(signupPassword).score >= 2 ? getPasswordStrength(signupPassword).color : 'bg-transparent'}`} />
                          <div className={`h-full rounded-full transition-all duration-300 flex-1 ${getPasswordStrength(signupPassword).score >= 3 ? getPasswordStrength(signupPassword).color : 'bg-transparent'}`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] font-medium text-xs tracking-wide hover:bg-[#33261d] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <span>{authLoading ? 'Creating Account...' : 'Create Account'}</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-2">
                    <div className="w-full border-t border-[#ede5db]" />
                    <span className="absolute bg-[#faf7f2] px-3 text-[10px] text-[#9a897b] font-light uppercase tracking-wider">
                      or sign up with
                    </span>
                  </div>

                  {/* Google and Apple */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 py-2 rounded-xl border border-[#ded3c5] bg-[#fdfbf7] hover:bg-[#f5efe7] text-xs font-light text-[#1c1510] transition-colors shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 py-2 rounded-xl border border-[#ded3c5] bg-[#fdfbf7] hover:bg-[#f5efe7] text-xs font-light text-[#1c1510] transition-colors shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5 fill-current text-[#1c1510]" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.66-2.88 1.48-.61.71-1.15 1.87-1.01 2.98 1.07.08 2.22-.54 2.9-1.36z" />
                      </svg>
                      <span>Apple</span>
                    </button>
                  </div>
                </form>
              )}
            </ScrollReveal>

            {/* Bottom Note */}
            <div className="pt-2 text-center text-[10px] text-[#9a897b] font-light flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Your data is safe and secure with us.</span>
            </div>
          </div>


          {/* Right Slot: LOGIN FORM (Revealed when Hero Banner is on the Left) */}
          <div
            className={`w-full h-full p-8 xl:p-14 flex flex-col justify-between transition-all duration-700 ease-out ${
              isLogin
                ? 'opacity-100 scale-100 pointer-events-auto delay-150'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            {/* Top Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-[#ede4d8] p-1 rounded-full border border-[#ded3c5]">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
                    isLogin
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-sm'
                      : 'text-[#736355] hover:text-[#1c1510]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
                    !isLogin
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-sm'
                      : 'text-[#736355] hover:text-[#1c1510]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="text-xs text-[#8a796c] font-light">
                <span>Don&apos;t have an account? </span>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="ml-1 text-[#9e7d56] font-medium hover:text-[#1c1510] transition-colors underline underline-offset-4"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form Content */}
            <ScrollReveal direction="up" delay={100} className="max-w-md w-full mx-auto my-auto py-4">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full border border-[#d8bb93] flex items-center justify-center bg-[#faf6ee] shadow-2xs">
                    <span className="font-serif text-sm text-[#9e7d56] font-semibold italic">B</span>
                  </div>
                  <span className="font-serif text-[11px] tracking-[0.25em] text-[#1c1510] uppercase font-normal">
                    BHAI JEWELLER
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1c1510] font-normal">
                  Welcome Back
                </h1>
                <p className="text-xs text-[#8a796c] font-light mt-1">
                  Log in to your account to continue your bespoke journey with us.
                </p>
              </div>

              {loggedIn ? (
                <div className="p-6 rounded-2xl bg-[#faf6ee] border border-[#dec29b]/60 text-center animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-[#1c1510] text-[#f5efe8] flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <svg className="w-6 h-6 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-lg text-[#1c1510]">Welcome back!</h3>
                  <p className="text-xs text-[#736355] font-light mt-1 mb-4">You have successfully logged in.</p>
                  <Link
                    href="/shop"
                    className="inline-flex px-6 py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-light hover:bg-[#33261d] transition-all"
                  >
                    Continue Shopping →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Security Lockout / Error Banner */}
                  {isBlocked ? (
                    <div className="p-3.5 rounded-xl bg-red-950/10 border border-red-800/30 text-red-900 text-xs font-light space-y-1 animate-shake">
                      <div className="flex items-center gap-2 font-medium text-red-950">
                        <svg className="w-4 h-4 text-red-700 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        <span>Security Lockout Activated</span>
                      </div>
                      <p className="text-[11px] text-red-800 leading-snug">
                        Too many failed login attempts (5/5). Your IP address is temporarily blocked for 15 minutes.
                      </p>
                      <div className="pt-1.5 flex items-center justify-between">
                        <span className="text-[10px] text-red-700">Try again in:</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-red-900 text-white font-mono text-[11px] font-semibold tracking-wider">
                          {Math.floor(lockCountdown / 60)}:{(lockCountdown % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  ) : loginError ? (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-light flex items-center justify-between gap-2 animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-600 shrink-0 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <span>{loginError}</span>
                      </div>
                      {attemptsLeft !== null && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-900 font-semibold text-[10px] shrink-0">
                          {attemptsLeft} left
                        </span>
                      )}
                    </div>
                  ) : null}

                  {/* Email or Phone */}
                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                      Email Address or Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        required
                        disabled={isBlocked}
                        placeholder="you@example.com or +44 7000 123456"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </span>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        disabled={isBlocked}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors font-mono disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label="Toggle password visibility"
                        className="absolute right-3 p-1 text-[#8a796c] hover:text-[#1c1510] transition-colors"
                      >
                        {showLoginPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-[#6b5c50] font-light select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-[#ded3c5] text-[#1c1510] focus:ring-0 cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>

                    <a href="#forgot" className="text-[#8a796c] hover:text-[#1c1510] font-light transition-colors">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isBlocked || authLoading}
                    className="w-full py-3 rounded-full bg-[#1c1510] text-[#f5efe8] font-medium text-xs sm:text-sm tracking-wide hover:bg-[#33261d] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <span>{authLoading ? 'Logging In...' : 'Log In'}</span>
                    <span>→</span>
                  </button>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-3">
                    <div className="w-full border-t border-[#ede5db]" />
                    <span className="absolute bg-[#faf7f2] px-3 text-[10.5px] text-[#9a897b] font-light uppercase tracking-wider">
                      or continue with
                    </span>
                  </div>

                  {/* Google and Apple */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#ded3c5] bg-[#fdfbf7] hover:bg-[#f5efe7] text-xs font-light text-[#1c1510] transition-colors shadow-2xs"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#ded3c5] bg-[#fdfbf7] hover:bg-[#f5efe7] text-xs font-light text-[#1c1510] transition-colors shadow-2xs"
                    >
                      <svg className="w-4 h-4 fill-current text-[#1c1510]" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.66-2.88 1.48-.61.71-1.15 1.87-1.01 2.98 1.07.08 2.22-.54 2.9-1.36z" />
                      </svg>
                      <span>Apple</span>
                    </button>
                  </div>
                </form>
              )}
            </ScrollReveal>

            {/* Bottom Note */}
            <div className="pt-3 text-center text-[10.5px] text-[#9a897b] font-light flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Your data is safe and secure with us.</span>
            </div>
          </div>

        </div>

        {/* ── THE SLIDING SWAP HERO BANNER (Slides smoothly Left <-> Right with 3D Luxury Glaze) ── */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-1/2 h-full z-30 transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-auto ${
            isLogin ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ willChange: 'transform' }}
        >
          <div className="relative w-full h-full bg-[#140e0b] text-[#f5efe8] p-10 xl:p-14 flex flex-col justify-between overflow-hidden shadow-2xl border-x border-[#2d221a]">
            {/* Background Image */}
            <Image
              src="/images/auth-ring-full.jpg"
              alt="Bhai Jeweller Heritage"
              fill
              priority
              sizes="50vw"
              className={`object-cover object-center transition-all duration-1000 ${
                isLogin ? 'scale-100 opacity-95' : 'scale-105 opacity-90'
              }`}
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#120d09]/95 via-[#120d09]/40 to-[#120d09]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(222,194,155,0.08),transparent_70%)] pointer-events-none" />

            {/* Top Monogram Brand Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#dec29b]/70 flex items-center justify-center bg-[#1a1410] shadow-sm">
                  <span className="font-serif text-sm text-[#dec29b] font-semibold italic">B</span>
                </div>
                <div>
                  <span className="font-serif text-xs tracking-[0.24em] uppercase text-[#f5efe8]">BHAI JEWELLER</span>
                  <p className="text-[7.5px] tracking-[0.35em] uppercase text-[#b8a798]">— BRADFORD —</p>
                </div>
              </div>

              {/* Quick Swap Overlay Button */}
              <button
                type="button"
                onClick={() => switchMode(isLogin ? 'signup' : 'login')}
                className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#dec29b]/40 text-[#f5efe8] text-[11px] font-light hover:border-[#dec29b] hover:text-[#dec29b] transition-all flex items-center gap-1.5 shadow-sm group"
              >
                <span>{isLogin ? 'Need an account?' : 'Already a member?'}</span>
                <span className="text-[#dec29b] font-medium group-hover:translate-x-0.5 transition-transform">
                  {isLogin ? 'Sign Up →' : 'Log In →'}
                </span>
              </button>
            </div>

            {/* Dynamic Bottom Hero Quote with Crossfade */}
            <div className="relative z-10 max-w-md min-h-[160px] flex flex-col justify-end">
              {isLogin ? (
                <div key="login-quote" className="animate-fadeIn">
                  <p className="text-[10.5px] tracking-[0.32em] uppercase text-[#e3c79e] font-bold mb-2.5 drop-shadow-xs">
                    TIMELESS ELEGANCE
                  </p>
                  <h2 className="font-serif text-3xl xl:text-4xl text-[#ffffff] font-semibold leading-[1.2] drop-shadow-md">
                    Your Story,<br />Adorned in Gold
                  </h2>
                  <p className="text-xs xl:text-sm text-[#d6c9be] font-light mt-3 leading-relaxed">
                    Discover fine jewellery pieces crafted for life&apos;s most precious moments.
                  </p>
                </div>
              ) : (
                <div key="signup-quote" className="animate-fadeIn">
                  <p className="text-[10.5px] tracking-[0.32em] uppercase text-[#e3c79e] font-bold mb-2.5 drop-shadow-xs">
                    JOIN BHAI JEWELLER
                  </p>
                  <h2 className="font-serif text-3xl xl:text-4xl text-[#ffffff] font-semibold leading-[1.2] drop-shadow-md">
                    Elegance Awaits<br />You
                  </h2>
                  <p className="text-xs xl:text-sm text-[#d6c9be] font-light mt-3 leading-relaxed">
                    Create your account and be the first to know about new collections, bespoke previews and private releases.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────
          MOBILE CONTAINER: Smooth Directional Sliding Panels (Below lg)
          ───────────────────────────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col w-full min-h-full">
        
        {/* Mobile Hero Top Banner */}
        <div className="relative w-full h-64 sm:h-72 bg-[#140f0c] overflow-hidden flex flex-col justify-between">
          <Image
            src="/images/auth-ring-full.jpg"
            alt="Bhai Jeweller Ring Header"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_55%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#140f0c] pointer-events-none" />

          {/* Top Bar */}
          <div className="relative z-10 w-full px-4 pt-3.5 flex items-center justify-between">
            <Link
              href="/"
              aria-label="Back to store"
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-[#dec29b]/50 flex items-center justify-center text-[#f5efe8] hover:text-[#dec29b] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>

            <Link href="/" className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#dec29b]/50 shadow-sm">
              <div className="w-5 h-5 rounded-full border border-[#dec29b] flex items-center justify-center bg-[#1a1410]">
                <span className="font-serif text-[11px] text-[#dec29b] font-semibold leading-none">B</span>
              </div>
              <span className="font-serif text-[10.5px] tracking-[0.22em] text-[#f5efe8] uppercase font-light">
                BHAI JEWELLER
              </span>
            </Link>

            <button
              type="button"
              onClick={() => switchMode(isLogin ? 'signup' : 'login')}
              className="text-[11px] font-medium text-[#f5efe8] px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#dec29b]/50 hover:text-[#dec29b] transition-colors shadow-sm"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

          {/* Dynamic Mobile Banner Quote (Bolder, Positioned Higher, Animated) */}
          <div key={mode} className="relative z-10 px-6 pb-10 sm:pb-12 transition-all duration-500 animate-fadeIn">
            <p className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-[#e3c79e] font-bold drop-shadow-xs">
              {isLogin ? 'WELCOME BACK' : 'JOIN THE FAMILY'}
            </p>
            <h2 className="font-serif text-xl sm:text-2xl text-[#ffffff] font-semibold leading-tight mt-1 drop-shadow-md">
              {isLogin ? 'Your Story, Adorned in Gold' : 'Elegance Awaits You'}
            </h2>
          </div>
        </div>

        {/* Mobile Sliding Form Card */}
        <div className="w-full bg-[#faf7f2] -mt-5 rounded-t-[28px] relative z-20 p-5 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
          
          {/* Animated Segmented Switcher Tab */}
          <div className="relative flex items-center bg-[#ede4d8] p-1 rounded-full border border-[#ded3c5] max-w-xs mx-auto mb-5 w-full">
            {/* Sliding Gold Indicator Pill */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1c1510] rounded-full shadow-sm transition-all duration-300 ease-out ${
                isLogin ? 'left-1' : 'left-[calc(50%+2px)]'
              }`}
            />
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`relative z-10 w-1/2 py-1.5 text-xs font-medium text-center transition-colors ${
                isLogin ? 'text-[#f5efe8]' : 'text-[#736355]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`relative z-10 w-1/2 py-1.5 text-xs font-medium text-center transition-colors ${
                !isLogin ? 'text-[#f5efe8]' : 'text-[#736355]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Views with Horizontal Sliding Track */}
          <div className="relative w-full overflow-hidden">
            <div
              className={`flex w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isLogin ? 'translate-x-0' : '-translate-x-1/2'
              }`}
            >
              
              {/* ── Slide 1: Mobile Login Form ── */}
              <div className="w-1/2 px-1">
                <div className="mb-4 text-center">
                  <h1 className="font-serif text-2xl text-[#1c1510] font-normal">
                    Log In to Account
                  </h1>
                  <p className="text-xs text-[#8a796c] font-light mt-0.5">
                    Access your wishlist and order history.
                  </p>
                </div>

                {loggedIn ? (
                  <div className="p-6 rounded-2xl bg-[#faf6ee] border border-[#dec29b]/60 text-center animate-fadeIn">
                    <div className="w-10 h-10 rounded-full bg-[#1c1510] text-[#f5efe8] flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                      <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-base text-[#1c1510]">Welcome back!</h3>
                    <p className="text-xs text-[#736355] font-light mt-1 mb-3">You have logged in successfully.</p>
                    <Link
                      href="/shop"
                      className="inline-flex px-5 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-light hover:bg-[#33261d] transition-all"
                    >
                      Continue Shopping →
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                    {/* Security Lockout / Error Banner */}
                    {isBlocked ? (
                      <div className="p-3 rounded-xl bg-red-950/10 border border-red-800/30 text-red-900 text-xs font-light space-y-1">
                        <div className="flex items-center gap-1.5 font-medium text-red-950">
                          <svg className="w-4 h-4 text-red-700 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                          <span>Security Lockout</span>
                        </div>
                        <p className="text-[10.5px] text-red-800">
                          5 failed attempts reached. Blocked for 15 minutes.
                        </p>
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] text-red-700">Timer:</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-900 text-white font-mono text-[10px] font-semibold">
                            {Math.floor(lockCountdown / 60)}:{(lockCountdown % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    ) : loginError ? (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-light flex items-center justify-between gap-2">
                        <span className="text-[11px]">{loginError}</span>
                        {attemptsLeft !== null && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-900 font-semibold text-[9.5px]">
                            {attemptsLeft} left
                          </span>
                        )}
                      </div>
                    ) : null}

                    <div>
                      <label className="block text-xs font-medium text-[#1c1510] mb-1">
                        Email or Phone
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 pointer-events-none">
                          <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          required
                          disabled={isBlocked}
                          placeholder="you@example.com or phone"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1c1510] mb-1">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 pointer-events-none">
                          <svg className="w-4 h-4 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        </span>
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          disabled={isBlocked}
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] font-mono disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 p-1 text-[#8a796c]"
                        >
                          {showLoginPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[#6b5c50]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-[#ded3c5] text-[#1c1510]"
                        />
                        <span>Remember me</span>
                      </label>
                      <a href="#forgot" className="text-[#8a796c]">Forgot password?</a>
                    </div>

                    <button
                      type="submit"
                      disabled={isBlocked || authLoading}
                      className="w-full py-3 rounded-full bg-[#1c1510] text-[#f5efe8] font-medium text-xs tracking-wide hover:bg-[#33261d] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <span>{authLoading ? 'Logging In...' : 'Log In'}</span>
                      <span>→</span>
                    </button>
                  </form>
                )}
              </div>

              {/* ── Slide 2: Mobile Sign Up Form ── */}
              <div className="w-1/2 px-1">
                <div className="mb-4 text-center">
                  <h1 className="font-serif text-2xl text-[#1c1510] font-normal">
                    Create Account
                  </h1>
                  <p className="text-xs text-[#8a796c] font-light mt-0.5">
                    Join Bhai Jeweller for private VIP releases.
                  </p>
                </div>

                {registered ? (
                  <div className="p-6 rounded-2xl bg-[#faf6ee] border border-[#dec29b]/60 text-center animate-fadeIn">
                    <div className="w-10 h-10 rounded-full bg-[#1c1510] text-[#f5efe8] flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                      <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-base text-[#1c1510]">Account Created!</h3>
                    <p className="text-xs text-[#736355] font-light mt-1 mb-3">Welcome to Bhai Jeweller, {signupFullName}.</p>
                    <Link
                      href="/shop"
                      className="inline-flex px-5 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-light hover:bg-[#33261d] transition-all"
                    >
                      Start Exploring →
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSignupSubmit} className="space-y-3">
                    {signupError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-light flex items-center gap-2">
                        <span className="text-[11px]">{signupError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-[#1c1510] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1c1510] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1c1510] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+44 7000 123456"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1c1510] mb-1">
                        Password *
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          placeholder="Password (min 8 chars)"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="w-full pl-3.5 pr-10 py-2 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3 p-1 text-[#8a796c]"
                        >
                          {showSignupPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {signupPassword && (
                        <div className="mt-1.5 space-y-1">
                          <div className="flex items-center justify-between text-[9.5px]">
                            <span className="text-[#8a796c] font-light">Strength:</span>
                            <span className={`font-medium ${getPasswordStrength(signupPassword).score === 3 ? 'text-emerald-700' : getPasswordStrength(signupPassword).score === 2 ? 'text-amber-700' : 'text-red-600'}`}>
                              {getPasswordStrength(signupPassword).label}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-[#ede5db] rounded-full overflow-hidden flex gap-1 p-0.5">
                            <div className={`h-full rounded-full transition-all duration-300 flex-1 ${getPasswordStrength(signupPassword).score >= 1 ? getPasswordStrength(signupPassword).color : 'bg-transparent'}`} />
                            <div className={`h-full rounded-full transition-all duration-300 flex-1 ${getPasswordStrength(signupPassword).score >= 2 ? getPasswordStrength(signupPassword).color : 'bg-transparent'}`} />
                            <div className={`h-full rounded-full transition-all duration-300 flex-1 ${getPasswordStrength(signupPassword).score >= 3 ? getPasswordStrength(signupPassword).color : 'bg-transparent'}`} />
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2.5 rounded-full bg-[#1c1510] text-[#f5efe8] font-medium text-xs tracking-wide hover:bg-[#33261d] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <span>{authLoading ? 'Creating...' : 'Create Account'}</span>
                      <span>→</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

          {/* Mobile Bottom Switch Helper */}
          <div className="mt-5 text-center text-xs text-[#8a796c] font-light">
            <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
            <button
              type="button"
              onClick={() => switchMode(isLogin ? 'signup' : 'login')}
              className="text-[#1c1510] font-medium underline underline-offset-2 ml-1"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

          {/* Security Guarantee */}
          <div className="pt-3 text-center text-[10px] text-[#9a897b] font-light flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#9a897b]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Your data is safe and secure with us.</span>
          </div>

        </div>

      </div>

    </main>
  );
}
