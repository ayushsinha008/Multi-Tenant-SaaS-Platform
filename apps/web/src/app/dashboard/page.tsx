'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Folder, CheckSquare, Users, Activity, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function DashboardOverview() {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', activeWorkspaceId],
    queryFn: async () => {
      const res = await api.get('/analytics');
      return res.data;
    },
    enabled: !!activeWorkspaceId,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-[#111827] rounded-xl border border-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: 'Total Projects', value: analytics?.overview?.totalProjects || 0, icon: Folder, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Active Tasks', value: analytics?.overview?.totalTasks || 0, icon: CheckSquare, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Team Members', value: analytics?.overview?.totalMembers || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Completion Rate', value: '64%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  if (!analytics?.overview?.totalProjects && !analytics?.overview?.totalTasks) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Welcome to your new workspace"
        description="Get started by creating your first project and inviting your team members to collaborate."
        primaryAction={{ label: 'Create Project', onClick: () => window.location.href = '/dashboard/projects' }}
      />
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Huge Editorial Header */}
      <div className="flex flex-col md:flex-row items-end justify-between border-b-[4px] border-black pb-8 gap-8">
        <div>
          <h1 className="text-7xl font-black tracking-tighter text-black uppercase leading-none">
            System<br/><span className="text-[#00FF4C]" style={{ WebkitTextStroke: '3px black' }}>Overview</span>
          </h1>
          <p className="text-xl font-bold text-black/70 mt-4 uppercase max-w-md">Command center active. All systems operational. Your workspace at a glance.</p>
        </div>
        <div className="hidden lg:block text-right">
          <div className="text-9xl font-black text-black/5 tracking-tighter leading-none select-none">
            {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* Broken Grid: 70 / 30 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Massive KPI Hero (70%) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-8"
        >
          <div className="h-full border-[4px] border-black bg-[#00FF4C] p-12 shadow-[12px_12px_0_0_#000000] relative overflow-hidden group hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[20px_20px_0_0_#000000] transition-all">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 border-[8px] border-black rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700" />
            <h2 className="text-2xl font-black uppercase border-[3px] border-black inline-block px-4 py-2 bg-white mb-12">Total Active Projects</h2>
            <div className="text-[10rem] font-black leading-none tracking-tighter text-black -ml-4">{analytics?.overview?.totalProjects || 0}</div>
            <div className="absolute bottom-8 right-8 text-black">
              <TrendingUp className="w-24 h-24" strokeWidth={1} />
            </div>
          </div>
        </motion.div>

        {/* Supporting Stat (30%) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-4 flex flex-col gap-8"
        >
          <div className="flex-1 border-[4px] border-black bg-black p-8 shadow-[8px_8px_0_0_#00FF4C] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_0_#00FF4C] transition-all flex flex-col justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #00FF4C 25%, transparent 25%, transparent 75%, #00FF4C 75%, #00FF4C), repeating-linear-gradient(45deg, #00FF4C 25%, transparent 25%, transparent 75%, #00FF4C 75%, #00FF4C)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 text-[#00FF4C]">
              <Users className="w-12 h-12 mb-6" strokeWidth={2} />
              <div className="text-6xl font-black tracking-tighter">{analytics?.overview?.totalMembers || 0}</div>
              <div className="text-xl font-bold uppercase mt-2">Team Members</div>
            </div>
          </div>
          
          <div className="flex-1 border-[4px] border-black bg-white p-8 shadow-[8px_8px_0_0_#000000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_0_#000000] transition-all flex flex-col justify-between">
            <div className="text-black">
              <CheckSquare className="w-12 h-12 mb-6" strokeWidth={2} />
              <div className="text-6xl font-black tracking-tighter">{analytics?.overview?.totalTasks || 0}</div>
              <div className="text-xl font-bold uppercase mt-2">Active Tasks</div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Another broken grid layout: 40 / 60 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-5">
          <div className="h-full border-[4px] border-black bg-white p-8 shadow-[8px_8px_0_0_#000000]">
            <div className="flex items-center justify-between border-b-[4px] border-black pb-4 mb-6">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-black">Recent Activity</h3>
              <Activity className="w-8 h-8 text-[#00FF4C] stroke-black" strokeWidth={2} />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-6 relative group">
                  <div className="w-4 h-4 bg-[#00FF4C] border-[3px] border-black mt-1 z-10 group-hover:scale-150 transition-transform" />
                  {i !== 2 && <div className="absolute top-6 left-[6px] w-[4px] h-16 bg-black" />}
                  <div>
                    <p className="text-lg font-bold text-black uppercase leading-tight"><span className="bg-black text-[#00FF4C] px-2 py-0.5 mr-2">SYS</span> Task Updated</p>
                    <p className="text-sm font-bold text-black/50 mt-1 uppercase">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-7">
          <div className="h-full border-[4px] border-black bg-black p-8 shadow-[12px_12px_0_0_#00FF4C] relative overflow-hidden">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-[#00FF4C] mb-8 relative z-10">Velocity Matrix</h3>
            
            {/* Abstract Graphic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-64 border-y-[4px] border-[#00FF4C]/20 -rotate-12 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 border-y-[4px] border-[#00FF4C]/20 rotate-12 pointer-events-none" />
            
            <div className="relative z-10 flex items-end h-[250px] gap-4 w-full px-4">
              {[40, 70, 45, 90, 65, 80, 50, 100].map((height, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.5 + (i * 0.1), type: 'spring' }}
                  className="flex-1 bg-[#00FF4C] border-[3px] border-black hover:bg-white transition-colors cursor-crosshair"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
