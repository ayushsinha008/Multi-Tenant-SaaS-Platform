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
    <div className="space-y-12 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-[4px] border-black pb-8 gap-8">
        <div>
          <h1 className="text-7xl font-black tracking-tighter text-black uppercase leading-none">
            Active<br/><span className="text-white" style={{ WebkitTextStroke: '3px black' }}>Projects</span>
          </h1>
          <p className="text-xl font-bold text-black/70 mt-4 uppercase">Manage and track your initiatives.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000000]">
            <button onClick={() => setView('grid')} className={`p-3 border-r-[3px] border-black transition-colors ${view === 'grid' ? 'bg-[#00FF4C] text-black' : 'text-black hover:bg-black hover:text-[#00FF4C]'}`}>
              <LayoutGrid className="w-6 h-6" strokeWidth={2.5} />
            </button>
            <button onClick={() => setView('list')} className={`p-3 transition-colors ${view === 'list' ? 'bg-[#00FF4C] text-black' : 'text-black hover:bg-black hover:text-[#00FF4C]'}`}>
              <List className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[#00FF4C] text-black border-[3px] border-black shadow-[4px_4px_0_0_#000000] hover:bg-black hover:text-[#00FF4C] h-14">
            <Plus className="w-6 h-6 mr-2" strokeWidth={3} />
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
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'flex flex-col gap-6'}>
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
                <Card className="hover:border-black transition-all group cursor-pointer h-full border-[4px] border-black bg-white shadow-[8px_8px_0_0_#000000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_0_#000000]">
                  <div className={`p-8 ${view === 'list' ? 'flex items-center gap-8' : ''}`}>
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-16 h-16 bg-black flex items-center justify-center text-[#00FF4C] shrink-0 transform -rotate-3 group-hover:rotate-0 transition-transform">
                        <Folder className="w-8 h-8" strokeWidth={2.5} />
                      </div>
                      <button className="text-black hover:bg-black hover:text-[#00FF4C] p-2 transition-colors border-[2px] border-transparent hover:border-black opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-6 h-6" strokeWidth={3} />
                      </button>
                    </div>
                    
                    <div className={view === 'list' ? 'flex-1' : ''}>
                      <h3 className="text-3xl font-black text-black uppercase tracking-tighter mb-2 group-hover:text-[#00FF4C] transition-colors leading-none" style={{ WebkitTextStroke: '1px black' }}>{project.name}</h3>
                      <p className="text-sm font-bold text-black/60 line-clamp-2 mb-8 uppercase tracking-widest">{project.description || 'No description provided.'}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t-[4px] border-black">
                        <Badge variant={project.status === 'ACTIVE' ? 'success' : 'secondary'}>
                          {project.status || 'ACTIVE'}
                        </Badge>
                        <div className="flex -space-x-3">
                          {[1, 2, 3].map((j) => (
                            <div key={j} className="w-10 h-10 rounded-none bg-black border-[3px] border-white z-10 flex items-center justify-center text-[#00FF4C] font-black text-xs uppercase">{j}</div>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Project" description="Initialize a new workspace node.">
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          createProject.mutate({ name: fd.get('name') as string, description: fd.get('description') as string });
        }} className="space-y-6">
          <div>
            <label className="block text-xl font-black text-black mb-2 uppercase tracking-tighter">Project Name</label>
            <Input name="name" required placeholder="Website Redesign" />
          </div>
          <div>
            <label className="block text-xl font-black text-black mb-2 uppercase tracking-tighter">Description</label>
            <textarea name="description" rows={4} className="flex w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-bold text-black shadow-[4px_4px_0_0_#000000] placeholder:text-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF4C] focus-visible:ring-offset-2 transition-all focus-visible:shadow-[6px_6px_0_0_#000000] focus-visible:-translate-y-0.5 focus-visible:-translate-x-0.5 resize-none" placeholder="Optional details..." />
          </div>
          <div className="pt-6 flex justify-end gap-4 border-t-[4px] border-black mt-8">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createProject.isPending} className="bg-black text-[#00FF4C] hover:bg-[#00FF4C] hover:text-black">
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
