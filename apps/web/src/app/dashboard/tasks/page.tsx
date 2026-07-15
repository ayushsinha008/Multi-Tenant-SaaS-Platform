'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, MessageSquare, Paperclip, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

// Each column gets its own pastel identity
const columnConfig: Record<string, { bg: string; header: string; pill: string; empty: string }> = {
  'Todo':        { bg: '#FFFDF5',  header: '#BAE6FD', pill: 'sky',     empty: '#BAE6FD' },
  'In Progress': { bg: '#FFFDF5',  header: '#FEF08A', pill: 'yellow',  empty: '#FEF08A' },
  'In Review':   { bg: '#FFFDF5',  header: '#DDD6FE', pill: 'lavender',empty: '#DDD6FE' },
  'Done':        { bg: '#FFFDF5',  header: '#BBF7D0', pill: 'mint',    empty: '#BBF7D0' },
};

const priorityStyle: Record<string, string> = {
  'Low':    'bg-[#BAE6FD] text-[#1A1A1A] border-[#1A1A1A]',
  'Medium': 'bg-[#FEF08A] text-[#1A1A1A] border-[#1A1A1A]',
  'High':   'bg-[#FBCFE8] text-[#1A1A1A] border-[#1A1A1A]',
  'Urgent': 'bg-[#1A1A1A] text-white border-[#1A1A1A]',
};

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => { const res = await api.get('/tasks'); return res.data.tasks; }
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => { const res = await api.get('/projects'); return res.data.projects; }
  });

  const createTask = useMutation({
    mutationFn: async (data: { title: string; projectId: string; priority: string }) => {
      setErrorMsg('');
      const res = await api.post('/tasks', data);
      return res.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }); setIsModalOpen(false); },
    onError: (err: any) => { setErrorMsg(err.response?.data?.message || 'Failed to create task'); }
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const res = await api.patch(`/tasks/${taskId}`, { status });
      return res.data;
    },
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: any) => old?.map((t: any) => t._id === taskId ? { ...t, status } : t));
      return { previousTasks };
    },
    onError: (_: any, __: any, context: any) => { queryClient.setQueryData(['tasks'], context?.previousTasks); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }); }
  });

  const columns = ['Todo', 'In Progress', 'In Review', 'Done'];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    setDraggedTaskId(null);
    setDragOverCol(null);
    if (taskId) updateTaskStatus.mutate({ taskId, status: col });
  };

  return (
    <div className="flex flex-col h-full">

      {/* Slim toolbar */}
      <div className="px-6 py-4 border-b-[3px] border-[#1A1A1A] bg-[#FFFDF5] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-[#1A1A1A]">Kanban Board</h1>
          <div className="hidden sm:flex items-center gap-2">
            {columns.map(col => {
              const count = tasks.filter((t: any) => t.status === col).length;
              const cfg = columnConfig[col];
              return (
                <div key={col} className="flex items-center gap-1.5 px-3 py-1 rounded-full border-[2px] border-[#1A1A1A] text-xs font-bold" style={{ backgroundColor: cfg.header }}>
                  {col} <span className="opacity-50">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} />
          New Task
        </Button>
      </div>

      {/* Board */}
      {tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-10">
          <div className="max-w-md w-full">
            <EmptyState
              icon={CheckSquare}
              title="Board is empty"
              description="Create your first task and bring your Kanban board to life."
              accentColor="#BBF7D0"
              primaryAction={{ label: '+ New Task', onClick: () => setIsModalOpen(true) }}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-hidden bg-[#FFFDF5]">
          <div className="grid grid-cols-4 h-full w-full">
            {columns.map((col) => {
            const colTasks = tasks.filter((t: any) => t.status === col);
            const cfg = columnConfig[col];
            const isDragOver = dragOverCol === col;

            return (
              <div
                key={col}
                className={`flex flex-col border-r-[3px] border-[#1A1A1A] last:border-r-0 transition-colors ${isDragOver ? 'bg-[#F8F8F0]' : ''}`}
                style={{ backgroundColor: cfg.bg }}
                onDragOver={(e) => { 
                  e.preventDefault(); 
                  if (dragOverCol !== col) setDragOverCol(col);
                }}
                onDragLeave={() => {
                  // We could clear it here, but leaving it until drop prevents flickering
                  // setDragOverCol(null)
                }}
                onDrop={(e) => handleDrop(e, col)}
              >
                {/* Column header */}
                <div
                  className="px-5 py-4 border-b-[3px] border-[#1A1A1A] flex items-center justify-between sticky top-0 z-20"
                  style={{ backgroundColor: cfg.header }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#1A1A1A]">{col}</span>
                    <span className="text-xs font-bold text-[#1A1A1A]/40">({colTasks.length})</span>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-7 h-7 rounded-lg border-[2px] border-[#1A1A1A] bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#1A1A1A]" strokeWidth={3} />
                  </button>
                </div>

                {/* Cards */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  {colTasks.map((task: any) => (
                    <motion.div
                      key={task._id}
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, task._id)}
                      className={`group rounded-xl border-[3px] border-[#1A1A1A] bg-white p-4 cursor-grab active:cursor-grabbing shadow-[3px_3px_0px_#1A1A1A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1A1A1A] transition-all ${draggedTaskId === task._id ? 'opacity-40 scale-95' : ''}`}
                    >
                      {/* Priority pill */}
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full border-[2px] text-[11px] font-bold mb-3 ${priorityStyle[task.priority || 'Medium']}`}>
                        {task.priority || 'Medium'}
                      </div>

                      <h4 className="text-sm font-bold text-[#1A1A1A] mb-2 leading-snug">{task.title}</h4>

                      {task.project && (
                        <p className="text-xs font-medium text-[#1A1A1A]/40 mb-3">{task.project.name}</p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t-[2px] border-[#1A1A1A]/10">
                        <div className="flex items-center gap-3 text-[#1A1A1A]/30">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
                            <span className="text-xs font-medium">0</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Paperclip className="w-3.5 h-3.5" strokeWidth={2} />
                            <span className="text-xs font-medium">0</span>
                          </div>
                        </div>
                        {task.assignee ? (
                          <Avatar src={task.assignee.avatar} fallback={task.assignee.name} size="sm" />
                        ) : (
                          <div className="w-7 h-7 rounded-full border-[2px] border-[#1A1A1A]/20 border-dashed flex items-center justify-center">
                            <Users className="w-3 h-3 text-[#1A1A1A]/20" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isDragOver && colTasks.length === 0 && (
                    <div className="rounded-xl border-[3px] border-dashed border-[#1A1A1A]/20 p-8 flex items-center justify-center">
                      <span className="text-sm font-medium text-[#1A1A1A]/20">Drop here</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Task" description="Add a task to the board." accentColor="#BBF7D0">
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          createTask.mutate({ title: fd.get('title') as string, projectId: fd.get('projectId') as string, priority: fd.get('priority') as string });
        }} className="space-y-5">
          {errorMsg && <div className="p-3 rounded-xl bg-red-50 border-[2px] border-red-300 text-sm font-medium text-red-600">{errorMsg}</div>}
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Task Title</label>
            <Input name="title" required placeholder="Design new component..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Project</label>
            <select name="projectId" required className="flex w-full h-12 rounded-xl border-[3px] border-[#1A1A1A] bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C4B5FD] shadow-[3px_3px_0px_#1A1A1A]">
              <option value="">Select a project</option>
              {projects.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Priority</label>
            <select name="priority" defaultValue="Medium" className="flex w-full h-12 rounded-xl border-[3px] border-[#1A1A1A] bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C4B5FD] shadow-[3px_3px_0px_#1A1A1A]">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createTask.isPending || !projects.length} variant="mint">
              {createTask.isPending ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
          {!projects.length && <p className="text-xs font-medium text-red-500">Please create a project first.</p>}
        </form>
      </Modal>
    </div>
  );
}
