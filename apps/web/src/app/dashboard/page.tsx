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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
          <p className="text-slate-400 mt-1">Here's what's happening in your workspace today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:border-white/20 transition-colors group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                    +12%
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-400 mt-1">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <Card className="h-[400px]">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Activity Timeline</h3>
              <div className="flex items-center justify-center h-64 text-slate-500">
                <BarChart3 className="w-12 h-12 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-[400px]">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 z-10 ring-4 ring-[#111827]" />
                    {i !== 2 && <div className="absolute top-4 left-[3px] w-px h-12 bg-white/10" />}
                    <div>
                      <p className="text-sm text-slate-300"><span className="text-white font-medium">Sarah</span> completed a task</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
