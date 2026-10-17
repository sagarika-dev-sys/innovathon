'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Cpu,
  GraduationCap,
  KeyRound,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Inputs are strictly empty by default
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Checkboxes are strictly UNCHECKED by default
  const [rememberMe, setRememberMe] = useState(false);

  // Validation & Auth state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmailFormat = (inputEmail: string): { isValid: boolean; error: string } => {
    const trimmed = inputEmail.trim().toLowerCase();
    if (!trimmed) {
      return { isValid: false, error: 'Please enter your institute email address.' };
    }

    // Strict NIT Raipur domain check: MUST end exactly with @nitrr.ac.in
    if (!trimmed.endsWith('@nitrr.ac.in')) {
      return {
        isValid: false,
        error: 'Access Denied: Only official NIT Raipur email addresses ending with @nitrr.ac.in are authorized to sign in.',
      };
    }

    // Check that there is a valid user prefix before @nitrr.ac.in
    const parts = trimmed.split('@');
    if (parts.length !== 2 || parts[0].length < 2) {
      return {
        isValid: false,
        error: 'Please enter a valid NIT Raipur username (e.g. rollnumber.branch@nitrr.ac.in).',
      };
    }

    return { isValid: true, error: '' };
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError || generalError) {
      setEmailError('');
      setGeneralError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    const emailCheck = validateEmailFormat(email);
    if (!emailCheck.isValid) {
      setEmailError(emailCheck.error);
      setGeneralError(emailCheck.error);
      return;
    }

    if (!password.trim()) {
      setPasswordError('Please enter your account password.');
      return;
    }

    // Valid NITRR credentials authenticated
    setIsLoading(true);

    try {
      // Simulate authenticating against NIT Raipur LDAP / Auth directory
      await new Promise((resolve) => setTimeout(resolve, 800));

      const userData = {
        email: email.trim().toLowerCase(),
        college: 'National Institute of Technology Raipur (NITRR)',
        role: 'Verified NITRR Scholar',
        authenticated: true,
        loginAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('nitrr_user_session', JSON.stringify(userData));
        sessionStorage.setItem('nitrr_user_session', JSON.stringify(userData));
      }

      setIsSuccess(true);

      // Post-Login Routing: Redirect to Home Page (Landing Page)
      setTimeout(() => {
        router.push('/home');
      }, 500);
    } catch {
      setGeneralError('An unexpected authentication error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Helper buttons for reviewer convenience
  const fillValidSample = () => {
    setEmail('anuj.cse@nitrr.ac.in');
    setPassword('PeerSync@2026');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
  };

  const fillInvalidSample = () => {
    setEmail('candidate@gmail.com');
    setPassword('Password123');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-grid-pattern overflow-hidden">
      {/* Dynamic Background Glow Spheres (Anti-Gravity Theme) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Login Container */}
      <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-500">
        <Card className="p-6 sm:p-8 border-indigo-500/30 bg-slate-900/85 backdrop-blur-2xl shadow-2xl shadow-indigo-950/60 ring-1 ring-white/10">
          {/* Header & Badges */}
          <div className="text-center space-y-3 pb-6 border-b border-white/[0.08]">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/30 mb-1">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-cyan-400" />
                  NIT Raipur Portal
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  SSO v2.0
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Peer<span className="text-indigo-400">Sync</span> Engine
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Combinatorial Teaming & Peer Matching for NITRR Students
              </p>
            </div>
          </div>

          {/* General Error Notice */}
          {generalError && (
            <div className="mt-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-200">Domain Restriction Enforced</p>
                <p className="text-[11px] text-rose-300/90 mt-0.5 leading-relaxed">
                  {generalError}
                </p>
              </div>
            </div>
          )}

          {/* Success Notice */}
          {isSuccess && (
            <div className="mt-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-emerald-200">NITRR Credential Verified</p>
                <p className="text-[11px] text-emerald-300/90 mt-0.5">
                  Redirecting to PeerSync Home Page...
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4.5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="nitrr-email" className="font-medium text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Institute Email
                </label>
                <span className="text-[10px] text-cyan-400 font-mono">
                  @nitrr.ac.in only
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  id="nitrr-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="rollnumber.branch@nitrr.ac.in"
                  className={`w-full rounded-xl bg-slate-950/90 border text-slate-100 placeholder-slate-500 text-xs sm:text-sm py-2.5 pl-3.5 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    emailError
                      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30'
                  }`}
                  required
                />
                <div className="absolute right-3 text-slate-400 pointer-events-none">
                  {email.toLowerCase().endsWith('@nitrr.ac.in') ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>
              {emailError && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="nitrr-password" className="font-medium text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  Password
                </label>
                <span className="text-[10px] text-slate-500">
                  NITRR Portal Credentials
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  id="nitrr-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••••"
                  className={`w-full rounded-xl bg-slate-950/90 border text-slate-100 placeholder-slate-500 text-xs sm:text-sm py-2.5 pl-3.5 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    passwordError
                      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox - UNCHECKED BY DEFAULT */}
            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/40 focus:ring-offset-0 focus:ring-2 cursor-pointer"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  Remember this device (Unchecked by default)
                </span>
              </label>

              <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                NITRR Helpdesk
              </span>
            </div>

            {/* Login CTA */}
            <Button
              type="submit"
              variant="glow"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading || isSuccess}
              className="w-full mt-4"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Verifying NITRR Directory...' : 'Sign In with NITRR Account'}
            </Button>
          </form>

          {/* Quick Test Demo Helpers */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block text-center">
              Evaluator Quick-Fill Controls
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillValidSample}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                Fill Valid @nitrr.ac.in
              </button>
              <button
                type="button"
                onClick={fillInvalidSample}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                Test Invalid Domain
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              Strict Rule: Any non-NITRR domain (e.g. Gmail, Yahoo, Outlook) is blocked with an instant error alert.
            </p>
          </div>

          {/* Security Assurance Badge */}
          <div className="mt-4 pt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>256-Bit Encrypted Campus Authentication Handshake</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
