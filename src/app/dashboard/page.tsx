'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import NotificationFeed from '@/components/ui/NotificationFeed';
import TeamMatcher from '@/features/matching/TeamMatcher';
import ProjectExplorer from '@/features/projects/ProjectExplorer';
import PeerDirectory from '@/features/peers/PeerDirectory';
import { studentsData } from '@/data/students';
import { mockProjects, initialActivities } from '@/data/mockProjects';
import {
  Layers,
  Sparkles,
  FolderGit2,
  Users,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  UserCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formationsOnly, setFormationsOnly] = useState(false);

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab && ['overview', 'matcher', 'projects', 'peers', 'notifications'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'matcher', label: 'Team Matcher', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects Hub', icon: <FolderGit2 className="w-4 h-4" />, badge: mockProjects.length },
    { id: 'peers', label: 'Peer Directory', icon: <Users className="w-4 h-4" />, badge: studentsData.length },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: 2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar with Title and Tab Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Campus Collaboration Dashboard
          </h1>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 glass-panel-hover border-indigo-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Total Indexed Peers</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{studentsData.length}</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +4 this week
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Verified skill profiles</p>
            </Card>

            <Card className="p-5 glass-panel-hover border-cyan-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Match Accuracy</span>
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black gradient-text">98.4%</span>
                <span className="text-xs text-slate-400 font-medium">Combinatorial</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Exact Pareto-optimal fit</p>
            </Card>

            <Card className="p-5 glass-panel-hover border-emerald-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Active Hackathons</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FolderGit2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{mockProjects.length}</span>
                <span className="text-xs text-emerald-400 font-medium">8 open slots</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Accepting teammates</p>
            </Card>

            <Card className="p-5 glass-panel-hover border-purple-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Average Availability</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-300">81.6%</span>
                <span className="text-xs text-slate-400">Active hours</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Pool availability score</p>
            </Card>
          </div>

          {/* Main Grid: Team Matcher Launcher + Activity Stream & Notification Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Quick Launch Banner & Active Projects Preview */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quick Launch Matcher CTA */}
              <Card className="p-6 relative overflow-hidden border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950/80">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="max-w-md">
                    <Badge variant="cyan" size="sm" dot className="mb-2">
                      Ready to Assemble
                    </Badge>
                    <h3 className="text-lg font-bold text-white">
                      Need a Dream Team for Your Next Hackathon?
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      Select required competencies and squad size to execute Member 2's deterministic combinatorial engine with real-time Pareto coverage.
                    </p>
                  </div>
                  <Button
                    variant="glow"
                    size="md"
                    onClick={() => setActiveTab('matcher')}
                    rightIcon={<ArrowUpRight className="w-4 h-4" />}
                  >
                    Open Matcher
                  </Button>
                </div>
              </Card>

              {/* Campus Live Activity Feed */}
              <Card className="p-6">
                <CardHeader className="p-0 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Live Campus Activity Feed
                    </h3>
                    <p className="text-xs text-slate-400">Real-time collaboration events</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-400 hover:text-slate-200">
                      <input
                        type="checkbox"
                        checked={formationsOnly}
                        onChange={(e) => setFormationsOnly(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
                      />
                      <span>Squad Formations Only</span>
                    </label>
                    <Badge variant="emerald" size="sm" dot>
                      Live Updates
                    </Badge>
                  </div>
                </CardHeader>

                <CardBody className="p-0 pt-3 space-y-3">
                  {initialActivities
                    .filter((act) => !formationsOnly || act.action.includes('formed'))
                    .map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                          </div>
                          <div className="text-slate-300">
                            <span className="font-semibold text-white">{act.actor}</span>{' '}
                            <span className="text-slate-400">{act.action}</span>{' '}
                            <span className="text-indigo-300 font-medium">{act.target}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-500 shrink-0">{act.timestamp}</span>
                      </div>
                    ))}
                </CardBody>
              </Card>
            </div>

            {/* Right 5 cols: Integrated Notification Feed */}
            <div className="lg:col-span-5">
              <NotificationFeed />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEAM MATCHER */}
      {activeTab === 'matcher' && (
        <div className="animate-in fade-in duration-300">
          <TeamMatcher />
        </div>
      )}

      {/* TAB 3: PROJECTS HUB */}
      {activeTab === 'projects' && (
        <div className="animate-in fade-in duration-300">
          <ProjectExplorer />
        </div>
      )}

      {/* TAB 4: PEER DIRECTORY */}
      {activeTab === 'peers' && (
        <div className="animate-in fade-in duration-300">
          <PeerDirectory />
        </div>
      )}

      {/* TAB 5: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
          <NotificationFeed />
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
