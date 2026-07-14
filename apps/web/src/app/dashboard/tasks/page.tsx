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
    'Low': 'bg-white text-black border-[2px] border-black shadow-[2px_2px_0_0_#000000]',
    'Medium': 'bg-[#00FF4C] text-black border-[2px] border-black shadow-[2px_2px_0_0_#000000]',
    'High': 'bg-black text-[#00FF4C] border-[2px] border-black shadow-[2px_2px_0_0_#00FF4C]',
    'Urgent': 'bg-[#FF0000] text-black border-[2px] border-black shadow-[2px_2px_0_0_#000000]',
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-end justify-between mb-12 border-b-[4px] border-black pb-8 shrink-0">
        <div>
          <h1 className="text-7xl font-black tracking-tighter text-black uppercase leading-none">
            Kanban<br/><span className="text-white" style={{ WebkitTextStroke: '3px black' }}>Board</span>
          </h1>
          <p className="text-xl font-bold text-black/70 mt-4 uppercase">Manage workflows and deployments.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-black text-[#00FF4C] border-[3px] border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#00FF4C] hover:text-black hover:shadow-none hover:translate-x-1 hover:translate-y-1 h-16 px-8 text-lg">
          <Plus className="w-6 h-6 mr-2" strokeWidth={3} />
          Deploy Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="Board Offline"
          description="Initialize your first task to bring the board online."
          primaryAction={{ label: 'Deploy Task', onClick: () => setIsModalOpen(true) }}
        />
      ) : (
        <div className="flex gap-8 overflow-x-auto pb-8 h-full custom-scrollbar">
          {columns.map((col) => {
            const colTasks = tasks.filter((t: any) => t.status === col);
            return (
              <div 
                key={col} 
                className="w-96 shrink-0 flex flex-col border-[4px] border-black bg-[#ECECEC] shadow-[8px_8px_0_0_#000000]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col)}
              >
                <div className="flex items-center justify-between p-4 bg-white border-b-[4px] border-black">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter leading-none">{col.replace('_', ' ')}</h3>
                    <span className="bg-black text-[#00FF4C] text-sm px-2 py-0.5 font-black border-[2px] border-black">
                      {colTasks.length}
                    </span>
                  </div>
                  <button className="text-black hover:bg-[#00FF4C] p-1 border-[2px] border-transparent hover:border-black transition-colors" onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-6 h-6" strokeWidth={3} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 p-4 min-h-[150px]">
                  {colTasks.map((task: any) => (
                    <motion.div
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, task._id)}
                      layoutId={task._id}
                      key={task._id}
                      className={`bg-white border-[3px] border-black p-5 cursor-grab active:cursor-grabbing hover:bg-[#00FF4C] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000000] transition-all group ${draggedTaskId === task._id ? 'opacity-50 scale-95' : 'shadow-[4px_4px_0_0_#000000]'}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 ${priorities[task.priority || 'Medium']}`}>
                          {task.priority || 'Medium'}
                        </span>
                        <button className="text-black opacity-0 group-hover:opacity-100 transition-opacity bg-white border-[2px] border-black">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <h4 className="text-xl font-black text-black mb-2 uppercase leading-none tracking-tighter">
                        {task.title}
                      </h4>
                      {task.project && (
                        <p className="text-sm font-bold text-black/60 uppercase tracking-widest mb-6 border-b-[2px] border-black pb-4">{task.project.name}</p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-4 text-black">
                          <div className="flex items-center gap-1 font-black">
                            <MessageSquare className="w-5 h-5" strokeWidth={2.5} /> 0
                          </div>
                          <div className="flex items-center gap-1 font-black">
                            <Paperclip className="w-5 h-5" strokeWidth={2.5} /> 0
                          </div>
                        </div>
                        
                        {task.assignee ? (
                          <Avatar src={task.assignee.avatar} fallback={task.assignee.name} size="sm" />
                        ) : (
                          <div className="w-8 h-8 bg-black border-[2px] border-white text-white flex items-center justify-center shadow-[2px_2px_0_0_#00FF4C]">
                            <Users className="w-4 h-4" />
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Deploy Task" description="Inject a new task into the pipeline.">
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          createTask.mutate({ 
            title: fd.get('title') as string, 
            projectId: fd.get('projectId') as string,
            priority: fd.get('priority') as string 
          });
        }} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-[#FF0000] border-[4px] border-black text-black font-black uppercase shadow-[4px_4px_0_0_#000000]">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-xl font-black text-black mb-2 uppercase tracking-tighter">Task Title</label>
            <Input name="title" required placeholder="DESIGN NEW UI" />
          </div>
          <div>
            <label className="block text-xl font-black text-black mb-2 uppercase tracking-tighter">Project</label>
            <select name="projectId" required className="flex w-full h-12 border-[3px] border-black bg-white px-4 text-sm font-bold text-black shadow-[4px_4px_0_0_#000000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF4C] focus-visible:ring-offset-2 transition-all cursor-pointer">
              <option value="" disabled selected>SELECT A PROJECT</option>
              {projects.map((p: any) => (
                <option key={p._id} value={p._id} className="font-bold">{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xl font-black text-black mb-2 uppercase tracking-tighter">Priority</label>
            <select name="priority" className="flex w-full h-12 border-[3px] border-black bg-white px-4 text-sm font-bold text-black shadow-[4px_4px_0_0_#000000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF4C] focus-visible:ring-offset-2 transition-all cursor-pointer" defaultValue="Medium">
              <option value="Low" className="font-bold">LOW</option>
              <option value="Medium" className="font-bold">MEDIUM</option>
              <option value="High" className="font-bold">HIGH</option>
              <option value="Urgent" className="font-bold">URGENT</option>
            </select>
          </div>
          <div className="pt-6 flex justify-end gap-4 border-t-[4px] border-black mt-8">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createTask.isPending || projects.length === 0} className="bg-black text-[#00FF4C] hover:bg-[#00FF4C] hover:text-black">
              {createTask.isPending ? 'DEPLOYING...' : 'DEPLOY TASK'}
            </Button>
          </div>
          {projects.length === 0 && (
            <p className="text-sm font-black text-[#FF0000] mt-4 uppercase border-[2px] border-black p-2 bg-white inline-block">PROJECT REQUIRED BEFORE DEPLOYMENT.</p>
          )}
        </form>
      </Modal>
    </div>
  );
}
