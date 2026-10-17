'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Layers,
  Sparkles,
  FolderGit2,
  Users,
  Bell,
  Menu,
  X,
  ArrowRight,
  GraduationCap,
  LogOut,
  LogIn,
} from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    // Check authentication session
    const checkSession = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('nitrr_user_session');
        if (stored) {
          try {
            setCurrentUser(JSON.parse(stored));
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    };

    checkSession();
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nitrr_user_session');
      sessionStorage.removeItem('nitrr_user_session');
    }
    setCurrentUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/dashboard?tab=overview', label: 'Dashboard', icon: Layers },
    { href: '/dashboard?tab=matcher', label: 'Team Matcher', icon: Sparkles },
    { href: '/dashboard?tab=projects', label: 'Projects Hub', icon: FolderGit2 },
    { href: '/dashboard?tab=peers', label: 'Peer Directory', icon: Users },
  ];

  const isLoginPage = pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={currentUser ? '/home' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
              Peer<span className="text-indigo-400">Sync</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              NITRR
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-slate-800/80 border border-slate-700/60 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4 text-slate-400" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5">
          {currentUser?.email ? (
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-mono text-indigo-200 truncate max-w-[150px]">
                {currentUser.email}
              </span>
            </div>
          ) : null}

          {!isLoginPage && (
            <Link
              href="/dashboard?tab=notifications"
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </Link>
          )}

          {currentUser ? (
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer"
              title="Sign out from NITRR session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : isLoginPage ? (
            <span className="text-xs text-slate-400 font-medium px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hidden sm:inline-block">
              NIT Raipur Portal
            </span>
          ) : (
            <Link href="/" className="hidden sm:inline-block">
              <Button size="sm" variant="outline" leftIcon={<LogIn className="w-3.5 h-3.5" />}>
                Login
              </Button>
            </Link>
          )}

          <Link href="/dashboard?tab=matcher" className="hidden sm:inline-block">
            <Button size="sm" variant="glow" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Build Team
            </Button>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl px-4 pt-2 pb-4 space-y-1">
          {currentUser?.email && (
            <div className="px-3.5 py-2 mb-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span className="truncate">{currentUser.email}</span>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/70"
            >
              {link.icon && <link.icon className="w-4 h-4 text-indigo-400" />}
              {link.label}
            </Link>
          ))}

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/dashboard?tab=matcher"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full"
            >
              <Button size="sm" variant="glow" className="w-full">
                Build Team Now
              </Button>
            </Link>

            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-rose-300 flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button size="sm" variant="outline" className="w-full">
                  Sign In with @nitrr.ac.in
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
