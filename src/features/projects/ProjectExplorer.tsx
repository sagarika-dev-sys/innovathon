'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Project } from '@/types';
import { mockProjects } from '@/data/mockProjects';
import { Plus, Search, Users, Calendar, Sparkles, Check, Send } from 'lucide-react';

export default function ProjectExplorer() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [appliedProjects, setAppliedProjects] = useState<Record<string, boolean>>({});

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Project['category']>('AI / ML');
  const [newSkills, setNewSkills] = useState('React, Python, Machine Learning');
  const [newTeamSize, setNewTeamSize] = useState(4);

  const categories = ['All', 'AI / ML', 'Web3 / DeFi', 'HealthTech', 'SaaS'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleApply = (id: string) => {
    setAppliedProjects((prev) => ({ ...prev, [id]: true }));
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      requiredSkills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      teamSize: newTeamSize,
      currentMembers: 1,
      ownerName: 'You (Current User)',
      category: newCategory,
      deadline: 'Dec 15, 2026',
      status: 'Open',
    };

    setProjects([created, ...projects]);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Campus Project Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover peer projects looking for teammates or register your own initiative
          </p>
        </div>

        <Button
          variant="glow"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Post New Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search projects by title, skill, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => {
          const isApplied = appliedProjects[project.id];
          const openSlots = project.teamSize - project.currentMembers;

          return (
            <Card key={project.id} className="p-6 glass-panel-hover flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="indigo" size="sm">
                    {project.category}
                  </Badge>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    Due {project.deadline}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Skills Required */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.requiredSkills.map((sk) => (
                    <Badge key={sk} variant="slate" size="sm">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Footer info & CTA */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    {project.currentMembers}/{project.teamSize} Filled
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    {openSlots} {openSlots === 1 ? 'Slot' : 'Slots'} Open
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={isApplied ? 'secondary' : 'primary'}
                  onClick={() => handleApply(project.id)}
                  disabled={isApplied}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Applied
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Apply
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Campus Project"
        description="Share your initiative and invite matching peers across departments"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="e.g. Autonomous Campus Delivery Drone"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="AI / ML">AI / ML</option>
              <option value="Web3 / DeFi">Web3 / DeFi</option>
              <option value="HealthTech">HealthTech</option>
              <option value="SaaS">SaaS</option>
              <option value="IoT / Hardware">IoT / Hardware</option>
              <option value="EdTech">EdTech</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Description & Goals</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Outline project mission and the problem you're solving..."
              className="w-full rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm p-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <Input
            label="Required Skills (comma-separated)"
            placeholder="React, Node.js, Python, Figma"
            value={newSkills}
            onChange={(e) => setNewSkills(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Squad Target Size: {newTeamSize} Members</label>
            <input
              type="range"
              min="2"
              max="6"
              value={newTeamSize}
              onChange={(e) => setNewTeamSize(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              Publish Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
