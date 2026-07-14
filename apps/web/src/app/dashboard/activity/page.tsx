'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Activity as ActivityIcon, Clock, LogIn, FilePlus, CheckSquare, Settings } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityPage() {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activity', activeWorkspaceId],
    queryFn: async () => {
      const res = await api.get(`/activity`);
      return res.data.activities;
    },
    enabled: !!activeWorkspaceId
  });

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return LogIn;
    if (action.includes('CREATE')) return FilePlus;
    if (action.includes('UPDATE')) return Settings;
    if (action.includes('TASK')) return CheckSquare;
    return ActivityIcon;
  };

  const getActionColor = (action: string) => {
    if (action.includes('DELETE')) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (action.includes('CREATE')) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (action.includes('UPDATE')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Activity Log</h1>
        <p className="text-slate-400 mt-1">Track all changes and events across your workspace.</p>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-[#111827] rounded-xl border border-white/5" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <EmptyState
          icon={ActivityIcon}
          title="No activity yet"
          description="Actions performed by you and your team members will appear here."
        />
      ) : (
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[23px] w-px bg-white/10" />
          <div className="space-y-6 relative z-10">
            {activities.map((activity: any) => {
              const Icon = getActionIcon(activity.action);
              const colorClass = getActionColor(activity.action);

              return (
                <div key={activity._id} className="flex gap-4 group">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${colorClass} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 bg-[#111827] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-white">{activity.userId?.name || 'A user'}</span>
                        {' '}{activity.details || activity.action.toLowerCase().replace(/_/g, ' ')}
                      </p>
                      <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0 ml-4">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {activity.ipAddress && (
                      <p className="text-xs text-slate-500 font-mono mt-2">IP: {activity.ipAddress}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
