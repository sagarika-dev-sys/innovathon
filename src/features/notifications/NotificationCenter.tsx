'use client';

import React from 'react';
import NotificationFeed from '@/components/ui/NotificationFeed';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Bell, ShieldAlert, Sparkles } from 'lucide-react';

export default function NotificationCenter() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            Notification & Activity Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time collaboration alerts, team invitations, and algorithm match updates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <NotificationFeed />
        </div>

        <div className="md:col-span-4 space-y-4">
          <Card className="p-5 border-indigo-500/20">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Notification Settings
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Automatic match notifications trigger whenever a campus peer enters the pool whose skills overlap &gt;80% with your active projects.
            </p>
            <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-slate-300">Instant Alert Engine</span>
              <Badge variant="emerald" size="sm">Active</Badge>
            </div>
          </Card>

          <Card className="p-5 border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Campus Privacy
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your contact details and availability schedules are only shared when you explicitly accept a collaboration invite.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
