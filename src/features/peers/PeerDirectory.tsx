'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { studentsData } from '@/data/students';
import {
  Search,
  GraduationCap,
  Check,
  UserPlus,
  Code2,
  Filter,
  RotateCcw,
} from 'lucide-react';

export default function PeerDirectory() {
  const [search, setSearch] = useState('');

  // STRICT REQUIREMENT: Filters & checkboxes must be UNCHECKED by default
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [highAvailOnly, setHighAvailOnly] = useState(false);
  const [verifiedGithubOnly, setVerifiedGithubOnly] = useState(false);
  const [nitrrOnly, setNitrrOnly] = useState(false);

  const [invited, setInvited] = useState<Record<string, boolean>>({});

  const availableSkills = [
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

  const toggleSkill = (sk: string) => {
    if (selectedSkills.includes(sk)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== sk));
    } else {
      setSelectedSkills([...selectedSkills, sk]);
    }
  };

  const resetAllFilters = () => {
    setSelectedSkills([]);
    setHighAvailOnly(false);
    setVerifiedGithubOnly(false);
    setNitrrOnly(false);
    setSearch('');
  };

  const hasActiveFilters =
    selectedSkills.length > 0 || highAvailOnly || verifiedGithubOnly || nitrrOnly || search !== '';

  const filtered = studentsData.filter((s) => {
    const matchesSearch =
      search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      (s.college && s.college.toLowerCase().includes(search.toLowerCase())) ||
      s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.every((sk) =>
        s.skills.some((studentSkill) => studentSkill.toLowerCase() === sk.toLowerCase())
      );

    const matchesAvail = !highAvailOnly || s.availability >= 85;
    const matchesGithub = !verifiedGithubOnly || Boolean(s.github);
    const matchesNitrr = !nitrrOnly || (s.college && s.college.includes('NIT'));

    return matchesSearch && matchesSkills && matchesAvail && matchesGithub && matchesNitrr;
  });

  const handleInvite = (id: string) => {
    setInvited((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Campus Peer Directory</h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore {studentsData.length} indexed students across departments with verified skills and live availability
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Checkboxes & Filters
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <div className="max-w-md">
          <Input
            placeholder="Search by name, role, college, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Filter Checkbox Panel - UNCHECKED BY DEFAULT */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              Directory Filter Checkboxes (Unchecked by Default)
            </span>
            <span className="text-[11px] text-slate-500">
              Showing {filtered.length} of {studentsData.length} peers
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={highAvailOnly}
                onChange={(e) => setHighAvailOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
              />
              <span>High Availability Only (&gt;= 85%)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={verifiedGithubOnly}
                onChange={(e) => setVerifiedGithubOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
              />
              <span>Verified GitHub Contributor</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={nitrrOnly}
                onChange={(e) => setNitrrOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
              />
              <span>NIT Raipur Scholar</span>
            </label>
          </div>

          {/* Skill Checkbox Chips - UNCHECKED BY DEFAULT */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 font-medium">Filter Skills:</span>
            {availableSkills.map((sk) => {
              const isChecked = selectedSkills.includes(sk);
              return (
                <label
                  key={sk}
                  className={`text-xs px-2.5 py-1 rounded-xl font-medium transition-all cursor-pointer inline-flex items-center gap-1.5 select-none ${
                    isChecked
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 border border-indigo-400/40'
                      : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSkill(sk)}
                    className="sr-only"
                  />
                  <span
                    className={`w-3 h-3 rounded-[3px] border flex items-center justify-center text-[9px] ${
                      isChecked
                        ? 'border-white bg-indigo-500 text-white'
                        : 'border-slate-600 bg-slate-900 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span>{sk}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center border-slate-800">
          <Filter className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Peers Match Current Filters</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try unchecking filters or search terms to browse the complete directory.
          </p>
          <div className="mt-4">
            <Button size="sm" variant="secondary" onClick={resetAllFilters}>
              Reset All Filters
            </Button>
          </div>
        </Card>
      ) : (
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
      )}
    </div>
  );
}
