'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { generateTeam } from '@/lib/matchingAlgorithm';
import { studentsData } from '@/data/students';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Users,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Terminal,
  FolderGit2,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  // Interactive mini-demo right on the hero!
  const [demoSkill, setDemoSkill] = useState<'ai' | 'web3' | 'fullstack'>('ai');

  const demoConfigs = {
    ai: {
      name: 'Agentic Healthcare AI',
      skills: ['Python', 'Machine Learning', 'Next.js', 'UI/UX'],
      size: 3,
    },
    web3: {
      name: 'Zero-Knowledge Micro-Vault',
      skills: ['Rust', 'Solidity', 'Node.js', 'Testing'],
      size: 3,
    },
    fullstack: {
      name: 'Campus High-Concurrency Lab',
      skills: ['React', 'TypeScript', 'PostgreSQL', 'Databases'],
      size: 3,
    },
  };

  const activeDemo = demoConfigs[demoSkill];
  const demoResult = generateTeam(studentsData, activeDemo.skills, activeDemo.size);

  return (
    <div className="relative min-h-screen bg-grid-pattern overflow-hidden">
      {/* Background Glow Spheres */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md shadow-lg shadow-indigo-500/10 animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">
              Next-Gen Hackathon Teaming Engine
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white">
              Live
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Assemble Elite Hackathon Teams With{' '}
            <span className="gradient-text">Algorithmic Precision</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Eliminate random teaming friction. PeerSync analyzes candidate competence, availability, and complementary skill coverage to synthesize the mathematically optimum team for your next big win.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
            <Link href="/dashboard?tab=matcher" className="w-full sm:w-auto">
              <Button size="lg" variant="glow" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Team Matcher
              </Button>
            </Link>

            <Link href="/dashboard?tab=overview" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" leftIcon={<Terminal className="w-4 h-4" />}>
                Explore Live Dashboard
              </Button>
            </Link>
          </div>

          {/* Social Proof / Stats Ticker */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center w-full max-w-3xl border-t border-white/[0.08]">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white">100%</span>
              <p className="text-xs text-slate-400 mt-0.5">Deterministic Search</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-cyan-400">500,000</span>
              <p className="text-xs text-slate-400 mt-0.5">Permutations Evaluated</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-indigo-400">&lt;200ms</span>
              <p className="text-xs text-slate-400 mt-0.5">Latency Guaranteed</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">16+</span>
              <p className="text-xs text-slate-400 mt-0.5">Verified Tech Domains</p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE HERO PREVIEW WIDGET */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 border-indigo-500/30 bg-slate-900/80 shadow-2xl shadow-indigo-950/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  Interactive Live Teaming Simulation
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Target Project: {activeDemo.name}
                </h3>
              </div>

              {/* Demo Preset Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
                {(['ai', 'web3', 'fullstack'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setDemoSkill(key)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      demoSkill === key
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Matcher Result Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
              {/* Score ring */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-500/40 flex flex-col items-center justify-center shadow-lg shadow-indigo-500/20">
                  <span className="text-2xl font-black gradient-text">
                    {Math.round(demoResult.score)}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                    Fit Score
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-200 mt-3">
                  Pareto-Optimal Match
                </span>
                <span className="text-[11px] text-slate-400">
                  {demoResult.coveragePercentage}% Skill Coverage
                </span>
              </div>

              {/* Matched Squad Members */}
              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Algorithmically Selected Squad ({demoResult.team.length} Members)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {demoResult.team.map((member) => (
                    <div
                      key={member.id}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} availability={member.availability} size="md" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{member.name}</h4>
                          <p className="text-[11px] text-indigo-300">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Avail</span>
                        <span className="text-xs font-bold text-emerald-400">
                          {member.availability}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <Link href="/dashboard?tab=matcher">
                    <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Customize Your Own Project
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="indigo" size="md" dot className="mb-3">
            Engine Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Designed to Solve the Hardest Part of Hackathons
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Four specialized modules synchronized into a single cohesive platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <Card className="p-6 glass-panel-hover" glow="indigo">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Combinatorial Engine</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Exhaustively enumerates team candidate permutations. Guarantees 100% skill coverage prioritized over availability.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="p-6 glass-panel-hover" glow="cyan">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Skill Disparity Balance</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Selects lean squads without redundant personnel. Complementary talents cover cross-domain architecture from UI/UX to ML.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="p-6 glass-panel-hover" glow="indigo">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Live Activity Stream</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Instant notification dispatch for invites, acceptances, and squad locks. Never miss a collaboration opportunity.
            </p>
          </Card>

          {/* Feature 4 */}
          <Card className="p-6 glass-panel-hover" glow="cyan">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Verified Peer Directory</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Explore 16+ verified student profiles with standardized availability scores and validated skill repertoires.
            </p>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-white">PeerSync Engine</span>
          <span className="text-xs text-slate-500">© 2026 Innovathon Collaboration</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link href="/dashboard?tab=overview" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard?tab=matcher" className="hover:text-white transition-colors">
            Team Matcher
          </Link>
          <Link href="/dashboard?tab=projects" className="hover:text-white transition-colors">
            Projects Hub
          </Link>
          <Link href="/dashboard?tab=peers" className="hover:text-white transition-colors">
            Peers
          </Link>
        </div>
      </footer>
    </div>
  );
}
