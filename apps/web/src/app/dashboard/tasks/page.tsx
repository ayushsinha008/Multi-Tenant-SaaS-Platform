'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, MessageSquare, Paperclip, MoreVertical, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

const priorities: Record<string, string> = {
  'Low': 'bg-slate-500/20 text-slate-400',
  'Medium': 'bg-blue-500/20 text-blue-400',
  'High': 'bg-orange-500/20 text-orange-400',
  'Urgent': 'bg-red-500/20 text-red-400',
};

const columnMap: Record<string, string> = {
  'Todo': 'TODO',
  'In Progress': 'IN_PROGRESS',
  'In Review': 'REVIEW',
  'Done': 'DONE',
};

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data.tasks;
    }
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data.projects;
    }
  });

  const createTask = useMutation({
    mutationFn: async (data: { title: string; projectId: string; priority: string }) => {
      setErrorMsg('');
      const res = await api.post('/tasks', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to create task');
    }
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const res = await api.patch(`/tasks/${taskId}`, { status });
      return res.data;
    },
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueryData(['tasks'], (old: any) => {
        if (!old) return old;
        return old.map((t: any) => t._id === taskId ? { ...t, status } : t);
      });

      return { previousTasks };
    },
    onError: (err, newTodo, context: any) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const columns = ['Todo', 'In Progress', 'In Review', 'Done'];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    setDraggedTaskId(null);
    
    if (taskId) {
      updateTaskStatus.mutate({ taskId, status: targetCol });
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Board</h1>
          <p className="text-slate-400 mt-1">Manage tasks across all projects.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Your board is empty. Create a task to start tracking work."
          primaryAction={{ label: 'Create Task', onClick: () => setIsModalOpen(true) }}
        />
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 h-full">
          {columns.map((col) => {
            const colTasks = tasks.filter((t: any) => t.status === col);
            return (
              <div 
                key={col} 
                className="w-80 shrink-0 flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col)}
              >
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{col.replace('_', ' ')}</h3>
                    <span className="bg-white/10 text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium">
                      {colTasks.length}
                    </span>
                  </div>
                  <button className="text-slate-500 hover:text-white p-1" onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 px-1 custom-scrollbar min-h-[150px] rounded-xl border border-transparent hover:border-white/5 transition-colors pb-10">
                  {colTasks.map((task: any) => (
                    <motion.div
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, task._id)}
                      layoutId={task._id}
                      key={task._id}
                      className={`bg-[#111827] border border-white/10 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group ${draggedTaskId === task._id ? 'opacity-50 scale-95' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorities[task.priority || 'Medium']}`}>
                          {task.priority || 'Medium'}
                        </span>
                        <button className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <h4 className="text-sm font-medium text-white mb-1 group-hover:text-indigo-400 transition-colors">
                        {task.title}
                      </h4>
                      {task.project && (
                        <p className="text-xs text-slate-500 mb-4">{task.project.name}</p>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 text-slate-500">
                          <div className="flex items-center gap-1 text-xs">
                            <MessageSquare className="w-3.5 h-3.5" /> 0
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Paperclip className="w-3.5 h-3.5" /> 0
                          </div>
                        </div>
                        
                        {task.assignee ? (
                          <Avatar src={task.assignee.avatar} fallback={task.assignee.name} size="sm" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-dashed border-slate-600 flex items-center justify-center">
                            <Users className="w-3 h-3 text-slate-600" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task" description="Add a new task to your board.">
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          createTask.mutate({ 
            title: fd.get('title') as string, 
            projectId: fd.get('projectId') as string,
            priority: fd.get('priority') as string 
          });
        }} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Task Title</label>
            <Input name="title" required placeholder="Design new landing page" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Project</label>
            <select name="projectId" required className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="" disabled selected>Select a project</option>
              {projects.map((p: any) => (
                <option key={p._id} value={p._id} className="bg-[#111827] text-white">{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
            <select name="priority" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" defaultValue="Medium">
              <option value="Low" className="bg-[#111827] text-white">Low</option>
              <option value="Medium" className="bg-[#111827] text-white">Medium</option>
              <option value="High" className="bg-[#111827] text-white">High</option>
              <option value="Urgent" className="bg-[#111827] text-white">Urgent</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createTask.isPending || projects.length === 0}>
              {createTask.isPending ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
          {projects.length === 0 && (
            <p className="text-xs text-orange-400 mt-2">You need to create a project first before adding tasks.</p>
          )}
        </form>
      </Modal>
    </div>
  );
}
