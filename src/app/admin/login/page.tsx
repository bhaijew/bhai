'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function AdminLoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [checkingExistingSession, setCheckingExistingSession] = useState(true);

  // If already authenticated as admin, automatically redirect to /admin
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.role === 'admin') {
          router.replace('/admin');
        } else {
          setCheckingExistingSession(false);
        }
      })
      .catch(() => {
        setCheckingExistingSession(false);
      });
  }, [router]);

  // Lockout countdown timer
  useEffect(() => {
    if (!isBlocked || lockCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockCountdown((prev) => {
        if (prev <= 1) {
          setIsBlocked(false);
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBlocked, lockCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password || isBlocked || authLoading) return;

    setAuthLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          roleRequired: 'admin',
        }),
      });

      const data = await res.json();
      setAuthLoading(false);

      if (data.success && data.user?.role === 'admin') {
        setSuccessMsg('✓ Identity verified. Loading Bradford Admin Terminal...');
        setTimeout(() => {
          const searchParams = new URLSearchParams(window.location.search);
          const redirectTarget = searchParams.get('redirect') || '/admin';
          window.location.href = redirectTarget;
        }, 800);
      } else {
        if (data.isBlocked) {
          setIsBlocked(true);
          setLockCountdown(data.remainingSeconds || 15 * 60);
          setErrorMsg(data.error || 'Temporary security quarantine active.');
        } else {
          if (typeof data.attemptsLeft === 'number') {
            setAttemptsLeft(data.attemptsLeft);
          }
          setErrorMsg(data.error || 'Invalid administrator credentials.');
        }
      }
    } catch {
      setAuthLoading(false);
      setErrorMsg('Network error. Unable to establish secure handshake with auth server.');
    }
  };

  if (checkingExistingSession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
          <span className="text-xs font-mono tracking-widest text-gray-700 uppercase">Verifying Terminal Handshake...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-[#f8fafc] text-gray-900 relative flex flex-col justify-between selection:bg-gray-900 selection:text-white overflow-hidden text-[13px]"
    >
      {/* SUBTLE LIGHT MESH BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-gray-200/40 via-gray-100/20 to-transparent blur-3xl pointer-events-none" />

      {/* TOP BAR / BREADCRUMB */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
          <span>Return to Storefront</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Bradford HQ Gateway</span>
        </div>
      </header>

      {/* MAIN LOGIN CARD */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <ScrollReveal direction="up" delay={50} className="w-full max-w-md">
          <div className="bg-white rounded-[8px] border border-gray-200 p-6 sm:p-7 shadow-lg shadow-gray-200/50 relative overflow-hidden">
            {/* Top Dark Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-900" />

            {/* BRAND HEADER */}
            <div className="text-center space-y-2 mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white shadow-sm mb-1">
                <span className="text-xl">👑</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-gray-900 uppercase">
                BHAI JEWELLER
              </h1>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 font-semibold">
                BRADFORD, WEST YORKSHIRE
              </p>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-[4px] bg-gray-100 border border-gray-200 text-[10.5px] font-mono uppercase tracking-wider text-gray-700">
                  🔒 Administrative Terminal
                </span>
              </div>
            </div>

            {/* ERROR / QUARANTINE NOTIFICATION */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-[5px] bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-shake">
                <span className="text-base flex-shrink-0 mt-0.5">🚫</span>
                <div className="flex-1">
                  <p className="font-semibold">{errorMsg}</p>
                  {isBlocked && lockCountdown > 0 && (
                    <p className="text-[11px] text-red-600 font-mono mt-1">
                      Cooldown remaining: {Math.floor(lockCountdown / 60)}m {lockCountdown % 60}s
                    </p>
                  )}
                  {attemptsLeft !== null && !isBlocked && (
                    <p className="text-[11px] text-amber-700 font-mono mt-1">
                      Attempts remaining: {attemptsLeft} of 5
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* SUCCESS NOTIFICATION */}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-[5px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-pulse">
                <span className="text-base">✓</span>
                <p className="font-medium font-mono">{successMsg}</p>
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-700 font-semibold mb-1.5 font-mono">
                  Administrator Email / ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={isBlocked || authLoading}
                    placeholder="admin@bhai.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3 rounded-[5px] bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-xs font-mono outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all disabled:opacity-50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    👤
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-gray-700 font-semibold font-mono">
                    Master Password
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">HMAC SHA-256</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isBlocked || authLoading}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-[5px] bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-xs font-mono outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all tracking-wider disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 text-xs transition-colors p-1"
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              {/* SECURITY NOTICE */}
              <div className="p-3 rounded-[4px] bg-gray-50 border border-gray-200 text-[10.5px] text-gray-600 space-y-1">
                <div className="flex items-center gap-1.5 text-gray-800 font-semibold">
                  <span>🛡️</span>
                  <span>Restricted Access Warning</span>
                </div>
                <p className="leading-relaxed">
                  All administrative access is monitored. Unauthorized login attempts are subject to automatic IP quarantine and audit logging.
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isBlocked || authLoading}
                className="w-full mt-2 py-3.5 rounded-[5px] bg-gray-900 text-white hover:bg-black font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Authorizing Session...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Terminal Dashboard</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>
            </form>

            {/* FOOTER INFO */}
            <div className="mt-6 pt-5 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
              <span>Assay Reg: UK-BFD-882</span>
              <span>TLS 1.3 Strict</span>
            </div>
          </div>
        </ScrollReveal>
      </main>

      {/* FOOTER DISCLAIMER */}
      <footer className="relative z-10 py-4 px-6 text-center text-[10.5px] text-gray-500 border-t border-gray-200 bg-white">
        <p>&copy; {new Date().getFullYear()} Bhai Jeweller Bradford. Master Admin Environment.</p>
      </footer>
    </div>
  );
}
