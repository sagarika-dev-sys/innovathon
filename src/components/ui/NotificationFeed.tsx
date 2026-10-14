'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from './Card';
import Badge from './Badge';
import Button from './Button';
import Avatar from './Avatar';
import { NotificationItem } from '@/types';
import { initialNotifications } from '@/data/mockProjects';
import { Bell, Check, Sparkles, UserPlus, Info, CheckCircle2 } from 'lucide-react';

export default function NotificationFeed() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'match' | 'invite' | 'system'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleAction = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true, actionLabel: 'Accepted' } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'invite':
        return <UserPlus className="w-4 h-4 text-indigo-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Activity & Alerts</h2>
            <p className="text-xs text-slate-400">Campus invitations & skill match alerts</p>
          </div>
        </div>
        {unreadCount > 0 ? (
          <div className="flex items-center gap-2">
            <Badge variant="rose" size="sm" dot>
              {unreadCount} New
            </Badge>
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
            >
              Clear
            </button>
          </div>
        ) : (
          <Badge variant="slate" size="sm">
            All Caught Up
          </Badge>
        )}
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {(['all', 'match', 'invite', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors text-xs font-medium cursor-pointer ${
                filter === t
                  ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No notifications matching this filter.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 flex gap-3 ${
                  item.read
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-800/40 border-indigo-500/20 shadow-sm shadow-indigo-950/30'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.sender ? (
                    <Avatar name={item.sender.name} size="sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      {getIcon(item.type)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-slate-100 truncate">{item.title}</h4>
                    <span className="text-[10px] text-slate-500 shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>

                  {item.actionLabel && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={item.actionLabel === 'Accepted' ? 'secondary' : 'primary'}
                        onClick={() => handleAction(item.id)}
                        className="text-[11px] py-1 px-3"
                      >
                        {item.actionLabel === 'Accepted' && <Check className="w-3 h-3 mr-1" />}
                        {item.actionLabel}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
}
