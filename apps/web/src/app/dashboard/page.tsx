'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { Folder, CheckSquare, Users, Activity, TrendingUp, ArrowRight, Clock, Sparkles } from 'lucide-react';

const cardColors = [
  { bg: 'var(--sky)', icon: '#7DD3FC' }, // sky
  { bg: 'var(--lavender)', icon: '#C4B5FD' }, // lavender
  { bg: 'var(--mint)', icon: '#86EFAC' }, // mint
  { bg: 'var(--pink-pastel)', icon: '#F9A8D4' }, // pink
];

export default function DashboardOverview() {
  const { activeWorkspaceId, user } = useAuthStore();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', activeWorkspaceId],
    queryFn: async () => { const res = await api.get('/analytics'); return res.data; },
    enabled: !!activeWorkspaceId,
  });

  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => { const res = await api.get('/organizations'); return res.data.organizations || []; }
  });

  const activeOrg = organizations.find((org: any) => org._id === activeWorkspaceId);
  let rawVelocity = analytics?.charts?.velocityChart || [0, 0, 0, 0, 0, 0, 0];
  const maxVelocity = Math.max(...rawVelocity, 1);
  const barHeights = rawVelocity.map((count: number) => (count / maxVelocity) * 100);

  const kpis = [
    { label: 'Projects', value: analytics?.overview?.totalProjects ?? 0, icon: Folder, color: cardColors[0] },
    { label: 'Active Tasks', value: analytics?.overview?.totalTasks ?? 0, icon: CheckSquare, color: cardColors[1] },
    { label: 'Team Members', value: analytics?.overview?.totalMembers ?? 0, icon: Users, color: cardColors[2] },
    { label: 'Completion', value: '64%', icon: TrendingUp, color: cardColors[3] },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">

      {/* Welcome header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-base font-medium text-ink/50 mt-1">
            Here's what's happening in <span className="font-bold text-ink">{activeOrg?.name || 'your workspace'}</span>
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border-[3px] border-ink bg-lavender shadow-neo-sm">
          <Sparkles className="w-4 h-4 text-ink" strokeWidth={2.5} />
          <span className="text-sm font-bold text-ink">{activeOrg?.name || 'Workspace'}</span>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="group rounded-2xl border-[3px] border-ink p-6 shadow-neo-md hover:-translate-y-1 hover:shadow-neo-lg transition-all cursor-default"
            style={{ backgroundColor: kpi.color.bg }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl border-[2px] border-ink flex items-center justify-center"
                style={{ backgroundColor: kpi.color.icon }}
              >
                <kpi.icon className="w-5 h-5 text-ink" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold text-ink/40 uppercase tracking-wide">{kpi.label}</span>
            </div>
            <div className="text-4xl font-bold text-ink tracking-tight">
              {isLoading ? '—' : kpi.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-5 rounded-2xl border-[3px] border-ink bg-white shadow-neo-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b-[3px] border-ink bg-pink-pastel flex items-center justify-between">
            <h2 className="font-bold text-ink">Recent Activity</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#86EFAC] border-[1px] border-ink animate-pulse" />
              <span className="text-xs font-medium text-ink/50">Live</span>
            </div>
          </div>
          <div className="divide-y-[2px] divide-[#1A1A1A]/10">
            {[
              { text: 'New project created', time: '2m ago', dot: 'var(--sky)' },
              { text: 'Task marked complete', time: '1h ago', dot: 'var(--mint)' },
              { text: 'Member invited', time: '3h ago', dot: 'var(--lavender)' },
              { text: 'Settings updated', time: '1d ago', dot: 'var(--pink-pastel)' },
            ].map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-cream transition-colors">
                <div className="w-3 h-3 rounded-full border-[2px] border-ink shrink-0" style={{ backgroundColor: item.dot }} />
                <p className="text-sm font-medium text-ink flex-1">{item.text}</p>
                <div className="flex items-center gap-1 text-ink/30 shrink-0">
                  <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="text-xs font-medium">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t-[2px] border-ink/10">
            <a href="/dashboard/activity" className="flex items-center gap-1.5 text-xs font-bold text-ink/40 hover:text-ink transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-7 rounded-2xl border-[3px] border-ink bg-white shadow-neo-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b-[3px] border-ink bg-mint flex items-center justify-between">
            <div>
              <h2 className="font-bold text-ink">Completed Tasks</h2>
              <p className="text-xs font-medium text-ink/50 mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#86EFAC] border-[2px] border-ink" />
              <span className="text-xs font-medium text-ink/50">Tasks</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-end h-[180px] gap-1.5">
              {barHeights.map((h: number, i: number) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.4 + i * 0.04, type: 'spring', stiffness: 100 }}
                  className="flex-1 rounded-t-lg border-[2px] border-ink cursor-crosshair transition-colors"
                  style={{ backgroundColor: i === 6 ? '#86EFAC' : 'var(--mint)' }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t-[2px] border-ink/10">
              <span className="text-xs font-medium text-ink/30">7 days ago</span>
              <span className="text-xs font-medium text-ink/30">Today</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick nav */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Projects', href: '/dashboard/projects', icon: Folder, color: 'var(--sky)' },
          { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare, color: 'var(--mint)' },
          { label: 'Members', href: '/dashboard/members', icon: Users, color: 'var(--pink-pastel)' },
          { label: 'Activity', href: '/dashboard/activity', icon: Activity, color: 'var(--orange-pastel)' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group flex items-center justify-between p-5 rounded-2xl border-[3px] border-ink bg-white shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-lg transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border-[2px] border-ink flex items-center justify-center" style={{ backgroundColor: item.color }}>
                <item.icon className="w-4 h-4 text-ink" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-ink">{item.label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-ink/20 group-hover:text-ink group-hover:translate-x-0.5 transition-all" strokeWidth={2.5} />
          </a>
        ))}
      </motion.div>
    </div>
  );
}
