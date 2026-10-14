'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { studentsData } from '@/data/students';
import { Search, GraduationCap, Check, UserPlus, Code2 } from 'lucide-react';

export default function PeerDirectory() {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [invited, setInvited] = useState<Record<string, boolean>>({});

  const allSkills = [
    'All',
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'Machine Learning',
    'UI/UX',
    'Java',
    'C++',
    'Rust',
  ];

  const filtered = studentsData.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      (s.college && s.college.toLowerCase().includes(search.toLowerCase())) ||
      s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));

    const matchesSkill =
      selectedSkill === 'All' ||
      s.skills.some((sk) => sk.toLowerCase() === selectedSkill.toLowerCase());

    return matchesSearch && matchesSkill;
  });

  const handleInvite = (id: string) => {
    setInvited((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Campus Peer Directory</h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore {studentsData.length} indexed students across departments with verified skills and live availability
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by name, role, college, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Skill filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {allSkills.map((sk) => (
            <button
              key={sk}
              onClick={() => setSelectedSkill(sk)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedSkill === sk
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((student) => {
          const isInvited = invited[student.id];

          return (
            <Card key={student.id} className="p-5 glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} availability={student.availability} size="lg" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{student.name}</h3>
                      <p className="text-xs text-indigo-400 font-medium">{student.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Availability
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {student.availability}%
                    </span>
                  </div>
                </div>

                {student.college && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-3">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    <span>{student.college}</span>
                  </div>
                )}

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-2">
                  {student.bio}
                </p>

                {/* Skill Badges */}
                <div className="mt-3.5 flex flex-wrap gap-1">
                  {student.skills.map((sk) => (
                    <Badge key={sk} variant="slate" size="sm">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
                {student.github ? (
                  <a
                    href={`https://github.com/${student.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>@{student.github}</span>
                  </a>
                ) : (
                  <span />
                )}

                <Button
                  size="sm"
                  variant={isInvited ? 'secondary' : 'primary'}
                  onClick={() => handleInvite(student.id)}
                  disabled={isInvited}
                  className="text-xs py-1 px-3"
                >
                  {isInvited ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Invited
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 mr-1" />
                      Invite
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
