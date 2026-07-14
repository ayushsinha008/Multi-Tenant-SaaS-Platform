'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus, MoreHorizontal, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data.projects;
    }
  });

  const createProject = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const res = await api.post('/projects', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsModalOpen(false);
    }
  });

  if (isLoading) return <div className="animate-pulse flex gap-6">Loading projects...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
          <p className="text-slate-400 mt-1">Manage and track your team's initiatives.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-[#111827] border border-white/10 p-1 rounded-lg flex items-center">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No projects yet"
          description="Create your first project to start organizing tasks and collaborating with your team."
          primaryAction={{ label: 'Create Project', onClick: () => setIsModalOpen(true) }}
        />
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
          <AnimatePresence>
            {projects.map((project: any, i: number) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card className="hover:border-indigo-500/30 transition-all duration-300 group cursor-pointer h-full">
                  <div className={`p-6 ${view === 'list' ? 'flex items-center gap-6' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <Folder className="w-6 h-6" />
                      </div>
                      <button className="text-slate-500 hover:text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className={view === 'list' ? 'flex-1' : ''}>
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4">{project.description || 'No description provided.'}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={project.status === 'ACTIVE' ? 'success' : 'secondary'}>
                          {project.status || 'ACTIVE'}
                        </Badge>
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((j) => (
                            <div key={j} className="w-7 h-7 rounded-full bg-slate-700 border-2 border-[#111827] z-10" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project" description="Projects help you organize your team's tasks.">
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          createProject.mutate({ name: fd.get('name') as string, description: fd.get('description') as string });
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
            <Input name="name" required placeholder="Website Redesign" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea name="description" rows={3} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Optional details..." />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
