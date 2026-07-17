'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus, LayoutGrid, List, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

// Rotating pastel card colors for projects
const projectCardColors = [
  'var(--sky)', // sky
  'var(--lavender)', // lavender
  'var(--mint)', // mint
  'var(--pink-pastel)', // pink
  'var(--yellow-pastel)', // yellow
  'var(--orange-pastel)', // orange
];

const statusBadgeVariant: Record<string, any> = {
  'ACTIVE': 'mint',
  'ARCHIVED': 'sky',
  'COMPLETED': 'lavender',
};

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => { const res = await api.get('/projects'); return res.data.projects; }
  });

  const createProject = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const res = await api.post('/projects', data);
      return res.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); setIsModalOpen(false); }
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">Projects</h1>
          <p className="text-sm font-medium text-ink/40 mt-1">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} in this workspace
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-xl border-[3px] border-ink overflow-hidden shadow-neo-sm">
            <button
              onClick={() => setView('grid')}
              className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-cream'}`}
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2.5 transition-colors border-l-[2px] border-ink ${view === 'list' ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-cream'}`}
            >
              <List className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="default" size="default">
            <Plus className="w-4 h-4 mr-2" strokeWidth={3} />
            New Project
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-52 rounded-2xl border-[3px] border-ink bg-cream animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No projects yet"
          description="Create your first project to start organizing your team's work."
          accentColor='var(--sky)'
          primaryAction={{ label: '+ New Project', onClick: () => setIsModalOpen(true) }}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project: any, i: number) => {
              const cardColor = projectCardColors[i % projectCardColors.length];
              return (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border-[3px] border-ink overflow-hidden shadow-neo-md hover:-translate-y-1 hover:shadow-neo-lg transition-all group"
                >
                  {/* Card color band */}
                  <div className="h-2" style={{ backgroundColor: cardColor }} />

                  <div className="bg-white p-6">
                    {/* Status + number */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={statusBadgeVariant[project.status] || 'sky'}>
                        {project.status || 'ACTIVE'}
                      </Badge>
                      <span className="text-xs font-bold text-ink/20">#{String(i + 1).padStart(2, '0')}</span>
                    </div>

                    {/* Project name */}
                    <h2 className="text-xl font-bold text-ink tracking-tight mb-2 leading-tight">{project.name}</h2>

                    {project.description && (
                      <p className="text-sm font-medium text-ink/50 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t-[2px] border-ink/10">
                      <div className="flex items-center gap-1.5 text-ink/30">
                        <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="text-xs font-medium">
                          {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <a href="/dashboard/tasks" className="flex items-center gap-1 text-xs font-bold text-ink/30 hover:text-ink transition-colors">
                        Tasks <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* List view */
        <div className="rounded-2xl border-[3px] border-ink overflow-hidden shadow-neo-md">
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-6 px-6 py-3.5 bg-ink text-white text-xs font-bold uppercase tracking-wide">
            <span className="w-8">#</span>
            <span>Project</span>
            <span className="w-24 text-center">Status</span>
            <span className="w-20 text-right">Created</span>
          </div>
          <div className="divide-y-[2px] divide-[#1A1A1A]/10">
            {projects.map((project: any, i: number) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-[auto_1fr_auto_auto] gap-6 px-6 py-4 bg-white hover:bg-cream items-center transition-colors"
              >
                <span className="w-8 text-xs font-bold text-ink/20">#{i + 1}</span>
                <div>
                  <h3 className="text-base font-bold text-ink">{project.name}</h3>
                  {project.description && (
                    <p className="text-xs font-medium text-ink/40 mt-0.5 line-clamp-1">{project.description}</p>
                  )}
                </div>
                <div className="w-24 flex justify-center">
                  <Badge variant={statusBadgeVariant[project.status] || 'sky'}>{project.status || 'ACTIVE'}</Badge>
                </div>
                <div className="w-20 text-right text-xs font-medium text-ink/30">
                  {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Project" description="Create a project to organize your team." accentColor='var(--sky)'>
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          createProject.mutate({ name: fd.get('name') as string, description: fd.get('description') as string });
        }} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-ink mb-2">Project Name</label>
            <Input name="name" required placeholder="Project Alpha" />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink mb-2">Description</label>
            <textarea name="description" rows={3} className="flex w-full rounded-xl border-[3px] border-ink bg-white px-4 py-3 text-sm font-medium placeholder:text-ink/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-lavender-dark resize-none shadow-neo-sm" placeholder="What's this project about?" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createProject.isPending} variant="primary">
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
