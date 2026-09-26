'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/signup';
  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#faf7f2] text-[#1c1510]">
        <AnnouncementBar />
        <Header solidBg={true} isRelative={true} />
        <div className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
          {children}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pb-16 md:pb-0">
      <AnnouncementBar />
      <Header />
      <div className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
        {children}
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
