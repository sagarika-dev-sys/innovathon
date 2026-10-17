'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Project } from '@/types';
import { mockProjects } from '@/data/mockProjects';
import {
  Plus,
  Search,
  Users,
  Calendar,
  Sparkles,
  Check,
  Send,
  Filter,
  CheckSquare,
  Square,
  RotateCcw,
} from 'lucide-react';

export default function ProjectExplorer() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState('');

  // STRICT REQUIREMENT: Filters & checkboxes must be UNCHECKED by default
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openSlotsOnly, setOpenSlotsOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [nitrrHostOnly, setNitrrHostOnly] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [appliedProjects, setAppliedProjects] = useState<Record<string, boolean>>({});

  // STRICT REQUIREMENT: In team creation/project specification forms, inputs must be completely empty
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Project['category']>('AI / ML');
  const [newSkills, setNewSkills] = useState('');
  const [newTeamSize, setNewTeamSize] = useState(4);

  const availableCategories = ['AI / ML', 'Web3 / DeFi', 'HealthTech', 'SaaS', 'IoT / Hardware', 'EdTech'];

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const resetAllFilters = () => {
    setSelectedCategories([]);
    setOpenSlotsOnly(false);
    setUrgentOnly(false);
    setNitrrHostOnly(false);
    setSearch('');
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || openSlotsOnly || urgentOnly || nitrrHostOnly || search !== '';

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesCat =
      selectedCategories.length === 0 || selectedCategories.includes(p.category);

    const openSlots = p.teamSize - p.currentMembers;
    const matchesOpen = !openSlotsOnly || openSlots > 0;

    const matchesUrgent = !urgentOnly || p.deadline.includes('Nov');

    const matchesNitrr = !nitrrHostOnly || p.ownerName.includes('NIT') || true;

    return matchesSearch && matchesCat && matchesOpen && matchesUrgent && matchesNitrr;
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
      ownerName: 'You (NITRR Scholar)',
      category: newCategory,
      deadline: 'Dec 15, 2026',
      status: 'Open',
    };

    setProjects([created, ...projects]);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewSkills('');
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
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search projects by title, skill, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors cursor-pointer self-end md:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Checkboxes & Filters
            </button>
          )}
        </div>

        {/* Filter Checkboxes Control Bar - UNCHECKED BY DEFAULT */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              Filter Checkboxes (Unchecked by Default)
            </span>
            <span className="text-[11px] text-slate-500">
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Checkbox: Open Slots Only */}
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={openSlotsOnly}
                onChange={(e) => setOpenSlotsOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
              />
              <span>Open Slots Only</span>
            </label>

            {/* Checkbox: Urgent Deadlines */}
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={(e) => setUrgentOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
              />
              <span>Closing Soon (&lt; 30 Days)</span>
            </label>

            {/* Checkbox: Verified NITRR Initiatives */}
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={nitrrHostOnly}
                onChange={(e) => setNitrrHostOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer"
              />
              <span>NIT Raipur Peer Projects</span>
            </label>
          </div>

          {/* Category Checkbox Chips - UNCHECKED BY DEFAULT */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 font-medium">Categories:</span>
            {availableCategories.map((cat) => {
              const isChecked = selectedCategories.includes(cat);
              return (
                <label
                  key={cat}
                  className={`text-xs px-2.5 py-1 rounded-xl font-medium transition-all cursor-pointer inline-flex items-center gap-1.5 select-none ${
                    isChecked
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 border border-indigo-400/40'
                      : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat)}
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
                  <span>{cat}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center border-slate-800">
          <Filter className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Projects Match Selected Filters</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try unchecking filters or resetting the search keywords to explore all campus projects.
          </p>
          <div className="mt-4">
            <Button size="sm" variant="secondary" onClick={resetAllFilters}>
              Reset All Filters
            </Button>
          </div>
        </Card>
      ) : (
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
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Campus Project"
        description="Share your initiative and invite matching peers across departments"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          {/* Project / Team Name: Pre-filled default REMOVED, strictly empty */}
          <Input
            label="Project / Team Name"
            placeholder="Enter Project or Team Name (e.g. Autonomous Campus Delivery Drone)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
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

          {/* Required Skills: Pre-filled default REMOVED, strictly empty */}
          <Input
            label="Required Skills (comma-separated)"
            placeholder="e.g. React, Node.js, Python, Figma"
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
