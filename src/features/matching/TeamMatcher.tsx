'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import { generateTeam } from '@/lib/matchingAlgorithm';
import { studentsData } from '@/data/students';
import { MatchingResult } from '@/types';
import { Sparkles, Users, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Send, Check } from 'lucide-react';

const skillCategories = {
  'Frontend & Mobile': ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Frontend'],
  'Backend & Databases': ['Node.js', 'Express', 'Python', 'Django', 'Java', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Databases', 'Backend', 'GraphQL'],
  'AI / ML & Data': ['Python', 'Machine Learning', 'ML', 'PyTorch', 'TensorFlow', 'Deep Learning', 'Data Analysis'],
  'Design & Product': ['UI/UX', 'Figma', 'User Research'],
  'Systems & Specialized': ['C++', 'Rust', 'WebAssembly', 'Solidity', 'Algorithms', 'Testing', 'CI/CD', 'Documentation'],
};

const quickPresets = [
  { name: 'Full-Stack Web3', skills: ['React', 'Node.js', 'Solidity', 'Rust', 'UI/UX'], size: 4 },
  { name: 'AI Hackathon MVP', skills: ['Python', 'Machine Learning', 'Next.js', 'UI/UX'], size: 3 },
  { name: 'High-Perf Systems', skills: ['C++', 'Algorithms', 'Testing', 'Documentation'], size: 2 },
  { name: 'Enterprise Cloud', skills: ['Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'Testing'], size: 3 },
];

export default function TeamMatcher() {
  const [projectName, setProjectName] = useState('Campus Hackathon AI Tool');
  const [teamSize, setTeamSize] = useState<number>(3);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'Node.js', 'Machine Learning', 'UI/UX']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [matchResult, setMatchResult] = useState<MatchingResult | null>(() => {
    return generateTeam(studentsData, ['React', 'Node.js', 'Machine Learning', 'UI/UX'], 3);
  });
  const [isMatching, setIsMatching] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState<Record<string, boolean>>({});

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const applyPreset = (preset: typeof quickPresets[0]) => {
    setSelectedSkills(preset.skills);
    setTeamSize(preset.size);
    handleMatchWithParams(preset.skills, preset.size);
  };

  const handleMatchWithParams = (skills: string[], size: number) => {
    setIsMatching(true);
    setTimeout(() => {
      const result = generateTeam(studentsData, skills, size);
      setMatchResult(result);
      setIsMatching(false);
    }, 250);
  };

  const handleRunMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) return;
    handleMatchWithParams(selectedSkills, teamSize);
  };

  const handleInvite = (id: string) => {
    setInvitedMembers((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900/80 to-slate-950/90 border border-indigo-500/20 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <Badge variant="indigo" size="md" dot className="mb-3">
            Algorithmic Combinatorial Matcher v2.0
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Synthesize Your Optimum <span className="gradient-text">Hackathon Team</span>
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Specify required skills and squad size. The engine exhaustively evaluates candidate permutations across the campus pool, prioritizing maximum skill coverage first and peak member availability second.
          </p>

          {/* Quick Presets */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
            {quickPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-colors cursor-pointer"
              >
                {preset.name} ({preset.size}p)
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <form onSubmit={handleRunMatch} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Project Specification
                </h3>
                <p className="text-xs text-slate-400 mt-1">Configure your requirements to begin matching</p>
              </div>

              <Input
                label="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Distributed DeFi Vault"
                required
              />

              {/* Team Size Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="team-size-slider" className="font-medium text-slate-300">Target Squad Size</label>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold">
                    {teamSize} Members
                  </span>
                </div>
                <input
                  id="team-size-slider"
                  aria-label="Target Squad Size"
                  type="range"
                  min="1"
                  max="6"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 px-1">
                  <span>1 (Solo)</span>
                  <span>3 (Recommended)</span>
                  <span>6 (Squad)</span>
                </div>
              </div>

              {/* Skill Selection by Category */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-300 block">
                  Required Competencies ({selectedSkills.length} selected)
                </label>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {Object.entries(skillCategories).map(([category, skills]) => (
                    <div key={category} className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill) => {
                          const isSelected = selectedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all duration-150 cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40 border border-indigo-400/40'
                                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/60 border border-slate-700/50'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Skill Input */}
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Add custom skill (e.g. Solidity)"
                    className="flex-1 rounded-xl bg-slate-900 border border-slate-700/80 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <Button type="button" size="sm" variant="secondary" onClick={addCustomSkill}>
                    Add
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                variant="glow"
                size="lg"
                isLoading={isMatching}
                className="w-full mt-2"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Synthesize Optimum Team
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {matchResult ? (
            <>
              {/* Metrics Card */}
              <Card className="p-6 border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-900/60">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div>
                    <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">
                      Match Assessment
                    </span>
                    <h2 className="text-xl font-bold text-white mt-0.5">{projectName}</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Computed across {studentsData.length} active campus profiles
                    </p>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-full bg-slate-900 border-2 border-indigo-500/40 flex flex-col items-center justify-center shadow-lg shadow-indigo-600/20">
                      <span className="text-lg font-black gradient-text">
                        {Math.round(matchResult.score)}%
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                        Score
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Skill Coverage</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-bold text-white">
                        {matchResult.coveragePercentage}%
                      </span>
                      <span className="text-xs text-slate-500">
                        ({matchResult.coveredSkills.length}/{selectedSkills.length})
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Avg Availability</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-bold text-emerald-400">
                        {matchResult.averageAvailability}%
                      </span>
                      <span className="text-xs text-slate-500">weekly</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-400 block">Squad Leanliness</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xl font-bold text-cyan-400">
                        {matchResult.team.length}
                      </span>
                      <span className="text-xs text-slate-500">/ {teamSize} target</span>
                    </div>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="mt-6 pt-6 border-t border-white/[0.08] space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Covered Requirements ({matchResult.coveredSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {matchResult.coveredSkills.length === 0 ? (
                        <span className="text-xs text-slate-500">None covered</span>
                      ) : (
                        matchResult.coveredSkills.map((sk) => (
                          <Badge key={sk} variant="emerald" size="sm">
                            ✓ {sk}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>

                  {matchResult.missingSkills.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        Unsatisfied Requirements ({matchResult.missingSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {matchResult.missingSkills.map((sk) => (
                          <Badge key={sk} variant="rose" size="sm">
                            ✕ {sk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Selected Candidate Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Selected Squad Roster ({matchResult.team.length} Members)
                  </h3>
                  <span className="text-xs text-slate-400">Ranked by lexicographical optimum</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {matchResult.team.map((member, idx) => {
                    const isInvited = invitedMembers[member.id];
                    return (
                      <Card key={member.id} className="p-5 glass-panel-hover border-slate-800">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <Avatar name={member.name} availability={member.availability} size="lg" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{member.name}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                  Slot #{idx + 1}
                                </span>
                              </div>
                              <p className="text-xs text-indigo-300 mt-0.5">{member.role}</p>
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{member.bio}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block uppercase font-medium">
                                Availability
                              </span>
                              <span className="text-xs font-bold text-emerald-400">
                                {member.availability}%
                              </span>
                            </div>

                            <Button
                              size="sm"
                              variant={isInvited ? 'secondary' : 'primary'}
                              onClick={() => handleInvite(member.id)}
                              className="text-xs"
                              disabled={isInvited}
                            >
                              {isInvited ? (
                                <>
                                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                                  Invited
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5 mr-1" />
                                  Send Invite
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Member Skill Badges */}
                        <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold mr-1">
                            Skills:
                          </span>
                          {member.skills.map((s) => {
                            const isReq = selectedSkills.some(
                              (rs) => rs.toLowerCase().trim() === s.toLowerCase().trim()
                            );
                            return (
                              <Badge
                                key={s}
                                variant={isReq ? 'cyan' : 'slate'}
                                size="sm"
                              >
                                {isReq && '★ '}
                                {s}
                              </Badge>
                            );
                          })}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <Card className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-slate-600 mx-auto animate-spin" />
              <h3 className="text-base font-semibold text-slate-300 mt-4">Evaluating Campus Pool</h3>
              <p className="text-xs text-slate-500 mt-1">Calculating optimum combination...</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
